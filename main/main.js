import { app } from 'electron'
import { initializeTray } from './tray/tray.js'
import { loadSettings } from './services/settings.js'
import AutoLaunch from 'auto-launch'

// TODO Reopen menu after task is edited (when the prompt window is closed)
// TODO Reopen menu after settings are updated (when the settings window is closed)
// TODO Prevent duplicate tasks from being added (when a duplicate task is added, remove the old one and add the new one so that it is at the top of the list)
// TODO Add keyboard shortcut accelerator to edit task menu item (`CommandOrControl+Control+${index+1}`) ? (check compatibility with system shortcuts)
// TODO Add "Customer Support" menu item below "Settings" menu item (send email to support email address)
// TODO Add "About MenuBar Tasks" menu item below "Customer Support" menu item (show a window with icon, app name, version, author name, website link and GitHub link)
// TODO place "Settings", "Customer Support" and "About MenuBar Tasks" menu items in a separate submenu called "App"
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
