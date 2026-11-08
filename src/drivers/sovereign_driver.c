/**
 * sovereign_driver.c - Consolidated Linux PCI Driver with Coherent DMA & mmap
 * Architecture: Linux Kernel Module (PCI Driver + Character Device mmap)
 */

#include <linux/module.h>
#include <linux/init.h>
#include <linux/pci.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/device.h>
#include <linux/dma-mapping.h>
#include <linux/mm.h>
#include <linux/io.h>

#define VENDOR_INTEL_ID     0x8086
#define DEVICE_HOST_BRIDGE  0x29C0
#define DMA_BUFFER_SIZE     (64 * 1024) // 64 KB Coherent DMA Ring Buffer
#define CDEV_NAME           "sovereign_bus"

// Driver Instance Private Data Structure
struct sovereign_driver_dev {
    struct pci_dev *pdev;
    void __iomem *bar0_virt;
    
    // DMA Allocation Fields
    void *dma_cpu_virt;
    dma_addr_t dma_bus_addr;
    size_t dma_size;

    // Character Device Fields
    dev_t dev_num;
    struct cdev cdev;
    struct class *dev_class;
    struct device *dev_device;
};

static struct sovereign_driver_dev *global_sdev = NULL;

// 1. Character Device mmap File Operation
static int sovereign_cdev_mmap(struct file *filp, struct vm_area_struct *vma)
{
    struct sovereign_driver_dev *sdev = filp->private_data;
    unsigned long size = vma->vm_end - vma->vm_start;
    unsigned long pfn;

    if (!sdev || !sdev->dma_cpu_virt) {
        return -EINVAL;
    }

    if (size > sdev->dma_size) {
        return -EINVAL;
    }

    // Set non-cached page protections for zero-latency memory synchronization
    vma->vm_page_prot = pgprot_noncached(vma->vm_page_prot);

    // Retrieve Page Frame Number (PFN) for the allocated coherent DMA memory
    pfn = page_to_pfn(virt_to_page(sdev->dma_cpu_virt));

    // Remap PFN range into user-space Virtual Memory Area (VMA)
    if (remap_pfn_range(vma, vma->vm_start, pfn, size, vma->vm_page_prot)) {
        pr_err("sovereign_driver: remap_pfn_range failed\n");
        return -EAGAIN;
    }

    pr_info("sovereign_driver: DMA buffer mapped to user space (Address: %lx, Size: %lu)\n",
            vma->vm_start, size);
    return 0;
}

static int sovereign_cdev_open(struct inode *inode, struct file *filp)
{
    filp->private_data = global_sdev;
    return 0;
}

static int sovereign_cdev_release(struct inode *inode, struct file *filp)
{
    return 0;
}

static const struct file_operations sovereign_fops = {
    .owner   = THIS_MODULE,
    .open    = sovereign_cdev_open,
    .release = sovereign_cdev_release,
    .mmap    = sovereign_cdev_mmap,
};

// 2. PCI ID Match Table
static const struct pci_device_id sovereign_pci_ids[] = {
    { PCI_DEVICE(VENDOR_INTEL_ID, DEVICE_HOST_BRIDGE) },
    { 0, }
};
MODULE_DEVICE_TABLE(pci, sovereign_pci_ids);

// 3. Managed PCI Probe Callback
static int sovereign_pci_probe(struct pci_dev *pdev, const struct pci_device_id *id)
{
    int err;
    void __iomem * const *bar_table;
    struct sovereign_driver_dev *sdev;

    pr_info("sovereign_driver: Probing PCI device %s\n", pci_name(pdev));

    sdev = devm_kzalloc(&pdev->dev, sizeof(*sdev), GFP_KERNEL);
    if (!sdev) {
        return -ENOMEM;
    }
    sdev->pdev = pdev;
    sdev->dma_size = DMA_BUFFER_SIZE;

    // A. Enable PCI Device
    err = pcim_enable_device(pdev);
    if (err) {
        dev_err(&pdev->dev, "sovereign_driver: pcim_enable_device failed\n");
        return err;
    }

    // B. Claim and Map BAR 0
    err = pcim_iomap_regions(pdev, BIT(0), "sovereign_driver");
    if (err) {
        dev_err(&pdev->dev, "sovereign_driver: pcim_iomap_regions failed\n");
        return err;
    }

    bar_table = pcim_iomap_table(pdev);
    if (!bar_table || !bar_table[0]) {
        return -ENOMEM;
    }
    sdev->bar0_virt = (void __iomem *)bar_table[0];

    // C. Configure DMA Mask & Allocate Coherent DMA Buffer
    if (dma_set_mask_and_coherent(&pdev->dev, DMA_BIT_MASK(64))) {
        if (dma_set_mask_and_coherent(&pdev->dev, DMA_BIT_MASK(32))) {
            dev_err(&pdev->dev, "sovereign_driver: DMA mask configuration failed\n");
            return -EIO;
        }
    }

    sdev->dma_cpu_virt = dma_alloc_coherent(&pdev->dev, sdev->dma_size, &sdev->dma_bus_addr, GFP_KERNEL);
    if (!sdev->dma_cpu_virt) {
        dev_err(&pdev->dev, "sovereign_driver: dma_alloc_coherent failed\n");
        return -ENOMEM;
    }

    pci_set_master(pdev);
    pci_set_drvdata(pdev, sdev);
    global_sdev = sdev;

    // D. Register Character Device Node (/dev/sovereign_bus)
    err = alloc_chrdev_region(&sdev->dev_num, 0, 1, CDEV_NAME);
    if (err < 0) {
        dev_err(&pdev->dev, "sovereign_driver: alloc_chrdev_region failed\n");
        goto free_dma;
    }

    cdev_init(&sdev->cdev, &sovereign_fops);
    sdev->cdev.owner = THIS_MODULE;

    err = cdev_add(&sdev->cdev, sdev->dev_num, 1);
    if (err < 0) {
        dev_err(&pdev->dev, "sovereign_driver: cdev_add failed\n");
        goto unregister_chrdev;
    }

    sdev->dev_class = class_create(CDEV_NAME);
    if (IS_ERR(sdev->dev_class)) {
        err = PTR_ERR(sdev->dev_class);
        goto del_cdev;
    }

    sdev->dev_device = device_create(sdev->dev_class, NULL, sdev->dev_num, NULL, CDEV_NAME);
    if (IS_ERR(sdev->dev_device)) {
        err = PTR_ERR(sdev->dev_device);
        goto destroy_class;
    }

    dev_info(&pdev->dev, "sovereign_driver: Hardware bound. BAR0: %p, DMA Bus Addr: %pad, Interface: /dev/%s\n",
             sdev->bar0_virt, &sdev->dma_bus_addr, CDEV_NAME);

    // Initialize register state
    iowrite32(0x00000001, sdev->bar0_virt + 0x04);
    return 0;

destroy_class:
    class_destroy(sdev->dev_class);
del_cdev:
    cdev_del(&sdev->cdev);
unregister_chrdev:
    unregister_chrdev_region(sdev->dev_num, 1);
free_dma:
    pci_clear_master(pdev);
    dma_free_coherent(&pdev->dev, sdev->dma_size, sdev->dma_cpu_virt, sdev->dma_bus_addr);
    return err;
}

// 4. Managed PCI Remove Callback
static void sovereign_pci_remove(struct pci_dev *pdev)
{
    struct sovereign_driver_dev *sdev = pci_get_drvdata(pdev);

    if (sdev) {
        device_destroy(sdev->dev_class, sdev->dev_num);
        class_destroy(sdev->dev_class);
        cdev_del(&sdev->cdev);
        unregister_chrdev_region(sdev->dev_num, 1);

        if (sdev->dma_cpu_virt) {
            pci_clear_master(pdev);
            dma_free_coherent(&pdev->dev, sdev->dma_size, sdev->dma_cpu_virt, sdev->dma_bus_addr);
        }
    }
    dev_info(&pdev->dev, "sovereign_driver: Driver detached cleanly.\n");
}

static struct pci_driver sovereign_pci_driver = {
    .name     = "sovereign_driver",
    .id_table = sovereign_pci_ids,
    .probe    = sovereign_pci_probe,
    .remove   = sovereign_pci_remove,
};

module_pci_driver(sovereign_pci_driver);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Sovereign Architecture Study");
MODULE_DESCRIPTION("Consolidated PCI Driver with Coherent DMA and Character Device mmap");
