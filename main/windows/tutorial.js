import { BrowserWindow, ipcMain, app, nativeTheme } from 'electron'
import path from 'path'
import fs from 'fs'
import { reopenMenu } from '../utils/menu.js'
import { loadSettings, saveSettings } from '../services/settings.js'

const __dirname = import.meta.dirname
let tutorialWindow = null

/**
 * Creates and displays the tutorial window
 */
export function createTutorialWindow() {
  // If the tutorial window is already open, focus it and show it
  if (tutorialWindow) {
    tutorialWindow.focus()
    tutorialWindow.show()
    tutorialWindow.setAlwaysOnTop(true)
    // Remove always on top after a short delay
    setTimeout(() => {
      if (tutorialWindow) {
        tutorialWindow.setAlwaysOnTop(false)
      }
    }, 200)
    return
  }

  // Set background color based on current theme
  const isDarkMode = nativeTheme.shouldUseDarkColors
  const backgroundColor = isDarkMode ? '#25272a' : '#eaebed'

  tutorialWindow = new BrowserWindow({
    titleBarStyle: 'hidden', // Hide the title bar
    width: 600,
    height: 448, // Adjusted for side-by-side layout
    title: 'MenuBar Tasks Tutorial',
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

  tutorialWindow.loadFile(path.join(__dirname, 'tutorial.html'))

  // Show window only when content is ready to prevent flash
  tutorialWindow.once('ready-to-show', () => {
    reopenMenu({ preventDefault: () => {} }) // ? Fake an event to reopen menu
    tutorialWindow.show()
  })

  tutorialWindow.on('closed', () => {
    tutorialWindow = null

    // Mark tutorial as shown in settings
    const settings = loadSettings()
    if (!settings.tutorialShown) {
      settings.tutorialShown = true
      saveSettings(settings)
    }

    // Reopen the tray menu when the tutorial window is closed
    reopenMenu({ preventDefault: () => {} }) // ? Fake an event to reopen menu
  })
}

// IPC handler to get tutorial images
ipcMain.handle('get-tutorial-images', () => {
  const isDev = !app.isPackaged
  const basePath = isDev
    ? path.join(app.getAppPath(), 'images')
    : path.join(process.resourcesPath, 'images')

  return {
    appIcon: path.join(basePath, 'icon.png'),
    menubarIcon: path.join(basePath, 'tutorial-menubar-icon.png'),
    step1: path.join(basePath, 'tutorial-step-1.png'),
    step2: path.join(basePath, 'tutorial-step-2.png'),
    step3: path.join(basePath, 'tutorial-step-3.png'),
  }
})

// IPC handler to close the tutorial window
ipcMain.handle('close-tutorial', () => {
  if (tutorialWindow) {
    tutorialWindow.close()
  }
})

/**
 * Checks if the tutorial should be shown (first launch) and shows it if needed
 */
export function showTutorialIfFirstLaunch() {
  const settings = loadSettings()

  // If tutorialShown is false or doesn't exist in settings, this is first launch or user never saw tutorial
  if (
    settings.tutorialShown === undefined ||
    settings.tutorialShown === false
  ) {
    // Only set tutorialShown to false if it's undefined
    if (settings.tutorialShown === undefined) {
      settings.tutorialShown = false
      saveSettings(settings)
    }

    console.log('Showing tutorial for first launch...')
    // Show tutorial after a short delay to ensure the app is fully loaded
    setTimeout(createTutorialWindow, 500)
  } else {
    console.log('Tutorial already shown previously')
  }
}
