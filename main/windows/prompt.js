import { BrowserWindow, ipcMain } from 'electron'
import path from 'path'

const __dirname = import.meta.dirname
let promptWindow = null
let promptResolve = null

export function createPromptWindow(title = 'Add Task', value = '') {
  if (promptWindow) {
    promptWindow.focus()
    return Promise.reject(new Error('Prompt window already open'))
  }

  return new Promise((resolve) => {
    promptResolve = resolve

    promptWindow = new BrowserWindow({
      width: 400,
      height: 178,
      title,
      minimizable: false,
      maximizable: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    // Store the initial value and determine mode
    promptWindow.__initialValue = value
    promptWindow.__mode = value ? 'edit' : 'new'

    promptWindow.loadFile(path.join(__dirname, 'prompt.html'))

    // Handle window close
    promptWindow.on('closed', () => {
      promptWindow = null
      if (promptResolve) {
        promptResolve(null)
        promptResolve = null
      }
    })
  })
}

// IPC handlers
ipcMain.handle('get-initial-value', () => {
  return promptWindow?.__initialValue || ''
})

ipcMain.handle('get-mode', () => {
  return promptWindow?.__mode || 'new'
})

ipcMain.handle('submit-prompt', (event, value) => {
  if (promptResolve) {
    promptResolve(value)
    promptResolve = null
  }
  promptWindow?.close()
  promptWindow = null
})

ipcMain.handle('cancel-prompt', () => {
  if (promptResolve) {
    promptResolve(null)
    promptResolve = null
  }
  promptWindow?.close()
  promptWindow = null
})
