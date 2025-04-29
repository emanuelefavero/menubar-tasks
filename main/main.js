import { app } from 'electron'
import { initializeTray } from './tray/tray.js'
import { loadSettings } from './services/settings.js'
import AutoLaunch from 'auto-launch'

// TODO Add notarization with electron builder or npm electron-notarize @see https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/ and https://www.electron.build/code-signing-mac.html

const autoLauncher = new AutoLaunch({
  name: 'MenuBar Tasks',
  path: app.getPath('exe'),
  isHidden: true,
})

// Update auto-launch based on settings
async function updateAutoLaunch() {
  const settings = loadSettings()
  try {
    const isEnabled = await autoLauncher.isEnabled()
    if (settings.openAtLogin && !isEnabled) {
      await autoLauncher.enable()
    } else if (!settings.openAtLogin && isEnabled) {
      await autoLauncher.disable()
    }
  } catch (error) {
    console.error('Error updating auto-launch:', error)
  }
}

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
  // Set up auto-launch
  updateAutoLaunch()
})

// Listen for settings changes
app.on('settings-updated', updateAutoLaunch)
