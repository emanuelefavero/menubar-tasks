import { BrowserWindow, ipcMain, app, nativeTheme } from 'electron'
import path from 'path'
import { loadSettings, saveSettings } from '../services/settings.js'
import { reopenMenu } from '../utils/menu.js'

const __dirname = import.meta.dirname
let settingsWindow = null

export function createSettingsWindow() {
  // If the settings window is already open, focus it and show it
  if (settingsWindow) {
    settingsWindow.focus()
    settingsWindow.show()
    settingsWindow.setAlwaysOnTop(true)
    // Remove always on top after a short delay
    setTimeout(() => {
      if (settingsWindow) {
        settingsWindow.setAlwaysOnTop(false)
      }
    }, 200)
    return
  }

  // Set background color based on current theme
  const isDarkMode = nativeTheme.shouldUseDarkColors
  const backgroundColor = isDarkMode ? '#25272a' : '#eaebed'

  settingsWindow = new BrowserWindow({
    titleBarStyle: 'hidden', // Hide the title bar
    width: 420,
    height: 312,
    title: 'Settings',
    minimizable: false,
    maximizable: false,
    resizable: false,
    show: false, // Don't show until content is ready
    backgroundColor, // Set background color to match theme
    transparent: true, // Enable transparency for smooth transitions
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'))

  // Show window only when content is ready to prevent flash
  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show()
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null

    // Reopen the tray menu when the settings window is closed
    reopenMenu({ preventDefault: () => {} }) // ? Fake an event to reopen menu
  })
}

// Handle IPC events
ipcMain.handle('get-settings', () => {
  return loadSettings()
})

ipcMain.handle('save-settings', async (event, settings) => {
  saveSettings(settings)
  // Emit the settings-updated event to all windows
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('settings-updated')
  })
  // Also emit it on the main process for the tray to catch
  app.emit('settings-updated')
  return true
})
