import { BrowserWindow, ipcMain, app, nativeTheme } from 'electron'
import path from 'path'
import { reopenMenu } from '../utils/menu.js'

const __dirname = import.meta.dirname
let aboutWindow = null

export function createAboutWindow() {
  // If the about window is already open, focus it and show it
  if (aboutWindow) {
    aboutWindow.focus()
    aboutWindow.show()
    aboutWindow.setAlwaysOnTop(true)
    // Remove always on top after a short delay
    setTimeout(() => {
      if (aboutWindow) {
        aboutWindow.setAlwaysOnTop(false)
      }
    }, 200)
    return
  }

  // Set background color based on current theme
  const isDarkMode = nativeTheme.shouldUseDarkColors
  const backgroundColor = isDarkMode ? '#25272a' : '#eaebed'

  aboutWindow = new BrowserWindow({
    titleBarStyle: 'hidden', // Hide the title bar
    width: 320,
    height: 360,
    title: 'About MenuBar Tasks',
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

  aboutWindow.loadFile(path.join(__dirname, 'about.html'))

  // Show window only when content is ready to prevent flash
  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show()
  })

  aboutWindow.on('closed', () => {
    aboutWindow = null

    // Reopen the tray menu when the about window is closed
    reopenMenu({ preventDefault: () => {} }) // ? Fake an event to reopen menu
  })
}

// IPC handler to get the path to the app icon
ipcMain.handle('get-about-icon-path', () => {
  const isDev = !app.isPackaged
  const iconPath = isDev
    ? path.join(app.getAppPath(), 'images', 'icon.png')
    : path.join(process.resourcesPath, 'images', 'icon.png')

  return iconPath
})
