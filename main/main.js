import { app } from 'electron'
import { initializeTray } from './tray/tray.js'

// TODO add borders and different background color to the container class in globals.css which is used in settings.html (like the Mac OS settings menu)
// TODO move "Add Task" option before the Tasks in the menu
// TODO ? replace input with textarea to show more line of text in prompt (you should probably use a custom prompt since electron-prompt does not support it)
// TODO add a max characters setting to limit the number of characters the user can input when adding or editing a task (135 chars is when the text is truncated)
// TODO create and add app icon
// TODO add a setting to choose if showing the last task, an icon, the app name "Tasks" in the tray icon

// Prevent the app from quitting when all windows are closed
app.on('window-all-closed', (e) => {
  e.preventDefault()
})

// Initialize the app when Electron is ready
app.whenReady().then(() => {
  // Hide the dock icon on macOS
  app.dock?.hide()
  // Initialize the tray
  initializeTray()
})
