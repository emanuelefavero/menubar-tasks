import { app } from 'electron'

/**
 * Reopens the tray menu after a keyboard shortcut is executed
 *
 * @param {Event} event - The event object from the click handler
 * @param {number} [delay=50] - Delay in milliseconds before reopening the menu
 */
export function reopenMenuAfterShortcut(event, delay = 50) {
  // Check if this was triggered by a keyboard shortcut
  if (event && event.triggeredByAccelerator) {
    // Set a slight delay to reopen the menu
    setTimeout(() => {
      // Force the tray menu to popup again after keyboard shortcut
      const tray = global.tray || app.dock?.getBounds?.().tray
      if (tray && tray.popUpContextMenu) {
        tray.popUpContextMenu()
      }
    }, delay) // Small delay to allow the menu to close first
  }
}
