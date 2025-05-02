import { Tray, nativeImage, app } from 'electron'
import { loadTasks } from '../services/tasks.js'
import { loadSettings } from '../services/settings.js'
import { getFirstNCharsNoTruncate } from '../utils/text.js'
import path from 'path'
import fs from 'fs'
import { buildContextMenu } from './menu.js'

const isDev = !app.isPackaged

let tray = null
let updateTrayFn = null

/**
 * Updates the tray display based on settings
 */
function updateTrayDisplay() {
  const settings = loadSettings()
  const tasks = loadTasks()

  switch (settings.trayDisplay) {
    case 'lastUndoneTask':
      // Show last undone task or default text if no tasks
      const undoneTasks = tasks.filter((task) => !task.done)
      const lastUndoneTask =
        undoneTasks.length > 0
          ? undoneTasks[0].text
          : tasks.length > 0
          ? '✅ All Tasks Done'
          : 'No Tasks'
      tray.setImage(nativeImage.createEmpty())
      tray.setTitle(getFirstNCharsNoTruncate(lastUndoneTask, 50))
      break
    case 'lastTask':
      // Show last task or default text if no tasks
      const lastTask = tasks.length > 0 ? tasks[0].text : 'No Tasks'
      tray.setImage(nativeImage.createEmpty())
      tray.setTitle(getFirstNCharsNoTruncate(lastTask, 50))
      break

    case 'appName':
      tray.setImage(nativeImage.createEmpty())
      tray.setTitle('Tasks')
      break

    case 'icon':
    // Show icon only
    default:
      // Set the icon path based on the app's environment (dev or production)
      const iconPath = isDev
        ? path.join(app.getAppPath(), 'images', 'icon-black.png')
        : path.join(process.resourcesPath, 'images', 'icon-black.png')

      // Create a native image from the icon path and resize it
      const icon = nativeImage
        .createFromPath(iconPath)
        .resize({ width: 16, height: 16 })

      // Set the tray icon and title
      icon.setTemplateImage(true)
      tray.setTitle('')
      tray.setImage(icon)
      break
  }
}

/**
 * Creates and initializes the tray icon
 */
export function initializeTray() {
  // Start with an empty icon
  tray = new Tray(nativeImage.createEmpty())
  // Store tray reference globally for keyboard shortcut handling
  global.tray = tray
  updateTray()

  // Watch for changes to the tasks file and update the tray accordingly
  fs.watchFile(path.join(app.getPath('userData'), 'tasks.json'), updateTray)

  // Listen for settings updates
  app.on('settings-updated', updateTray)
}

/**
 * Updates the tray icon's context menu and display
 */
function updateTray() {
  updateTrayDisplay()
  tray.setContextMenu(buildContextMenu(updateTray))
}

export function createTray() {
  // Start with an empty icon
  tray = new Tray(nativeImage.createEmpty())
  // Store tray reference globally for keyboard shortcut handling
  global.tray = tray

  function updateTray() {
    updateTrayDisplay()
    const contextMenu = buildContextMenu(updateTray)
    tray.setContextMenu(contextMenu)
  }

  updateTrayFn = updateTray
  updateTray()

  // Listen for settings updates
  app.on('settings-updated', updateTray)

  return tray
}
