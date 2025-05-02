import { BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'

const __dirname = import.meta.dirname
let promptWindow = null
let promptResolve = null

export function createPromptWindow(title = 'Add Task', value = '') {
  // If the prompt window is already open, focus it and show it
  if (promptWindow) {
    promptWindow.focus()
    promptWindow.show()
    promptWindow.setAlwaysOnTop(true)
    // Remove always on top after a short delay
    setTimeout(() => {
      if (promptWindow) {
        promptWindow.setAlwaysOnTop(false)
      }
    }, 200)

    return Promise.reject(new Error('Prompt window already open'))
  }

  return new Promise((resolve) => {
    promptResolve = resolve

    // Set background color based on current theme
    const isDarkMode = nativeTheme.shouldUseDarkColors
    const backgroundColor = isDarkMode ? '#25272a' : '#eaebed'

    promptWindow = new BrowserWindow({
      titleBarStyle: 'hidden', // Hide the title bar
      width: 400,
      height: 212,
      title,
      minimizable: false,
      maximizable: false,
      resizable: false,
      show: false, // Don't show the window until content is ready
      backgroundColor, // Set background color to match theme
      transparent: true, // Enable transparency for smooth transitions
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    // Store the initial value and determine mode
    promptWindow.__initialValue = value
    promptWindow.__mode = value ? 'edit' : 'new'

    // Show window only when content is ready to prevent flash
    promptWindow.once('ready-to-show', () => {
      promptWindow.show()
    })

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
