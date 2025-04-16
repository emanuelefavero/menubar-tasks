import { app } from 'electron'
import { initializeTray } from './tray/tray.js'

// TODO add a settings menu item to open a settings window
// TODO add max tasks setting to limit the number of tasks shown in the menu
// TODO add a max characters setting to limit the number of characters the user can input when adding or editing a task
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
