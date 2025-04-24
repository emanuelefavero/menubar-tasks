import { app } from 'electron'
import { initializeTray } from './tray/tray.js'

// TODO add a setting to choose if showing the last task, an icon, the app name "Tasks" in the tray icon
// TODO add a setting to open the app on startup

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
