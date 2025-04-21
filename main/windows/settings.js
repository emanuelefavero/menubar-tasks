import { BrowserWindow, ipcMain, app } from 'electron'
import path from 'path'
import { loadSettings, saveSettings } from '../services/settings.js'

const __dirname = import.meta.dirname
let settingsWindow = null

export function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
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
