# Kbuild Makefile for sovereign_driver.ko
MODULE_NAME := sovereign_driver
obj-m := $(MODULE_NAME).o

KDIR ?= /lib/modules/$(shell uname -r)/build
PWD  := $(shell pwd)

.PHONY: all default clean

default: all

all:
	@if [ -d "$(KDIR)" ]; then \
		$(MAKE) -C $(KDIR) M=$(PWD) modules; \
	else \
		echo "Notice: Kernel headers directory $(KDIR) not found on this system."; \
		echo "To compile on a Linux system, install matching kernel headers (e.g. sudo apt install linux-headers-\$$(uname -r))."; \
	fi

clean:
	@if [ -d "$(KDIR)" ]; then \
		$(MAKE) -C $(KDIR) M=$(PWD) clean; \
	else \
		rm -f *.o *.ko *.mod *.mod.c *.symvers *.order .*.cmd; \
	fi
