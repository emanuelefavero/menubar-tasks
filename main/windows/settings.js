import { BrowserWindow, ipcMain, app } from 'electron'
import path from 'path'
import { loadSettings, saveSettings } from '../services/settings.js'

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

  settingsWindow = new BrowserWindow({
    titleBarStyle: 'hidden', // Hide the title bar
    width: 420,
    height: 225,
    title: 'Settings',
    minimizable: false,
    maximizable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'))

  settingsWindow.on('closed', () => {
    settingsWindow = null
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
