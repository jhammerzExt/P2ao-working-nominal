/**
 * Universal failsafe copy-to-clipboard utility.
 * Handles permission errors, async rejections, and fallback textarea DOM selection.
 */
export const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  // 1. Try modern navigator.clipboard.writeText
  if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fall through to legacy fallback if writeText is blocked by browser permissions
    }
  }

  // 2. Legacy fallback using invisible textarea and document.execCommand('copy')
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (_) {
    // Fall through
  }

  return false;
};
