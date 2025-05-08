import { app } from 'electron'
import { initializeTray } from './tray/tray.js'
import { loadSettings } from './services/settings.js'
import AutoLaunch from 'auto-launch'

// TODO Add "Clear Done Tasks" option to the tray menu (disable it if no tasks are done)
// TODO Add keyboard shortcut accelerator to the "Clear Done Tasks" option, try CommandOrControl+Shift+D
// TODO Try to add a tutorial to the app that will show the user how to use the app. The tutorial should be shown when the app is first installed, and should not be shown again after that unless the user clicks a "Show Tutorial" button in the "App" submenu. If the tutorial is ugly, remove it and follow next TODO 👇
// TODO Add initial tasks (only if the tutorial is not added), a list of tasks to show when the app is first installed that will teach the user how to use the app. Make sure to only add these tasks when the app is first installed, and never again.
// TODO Add multiple language support (English, German, French, Spanish, Italian, Portuguese, Russian, Chinese, Japanese, Korean)
// TODO Add tests
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
