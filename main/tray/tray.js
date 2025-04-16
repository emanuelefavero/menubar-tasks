import { Tray, nativeImage, app } from 'electron'
import { loadTasks } from '../services/tasks.js'
import { getFirstNCharsNoTruncate } from '../utils/text.js'
import path from 'path'
import fs from 'fs'
import { buildContextMenu } from './menu.js'

let tray = null

/**
 * Creates and initializes the tray icon
 */
export function initializeTray() {
  tray = new Tray(nativeImage.createEmpty())
  updateTray()

  // Watch for changes to the tasks file and update the tray accordingly
  fs.watchFile(path.join(app.getPath('userData'), 'tasks.json'), updateTray)
}

/**
 * Updates the tray icon's title and context menu
 * The title shows the most recent task with its completion status (truncated to 12 characters)
 */
function updateTray() {
  const tasks = loadTasks()
  const lastTask = tasks.at(0)
  let title = 'No tasks'

  if (lastTask) {
    const { done } = lastTask
    const status = done ? '✅ ' : ''
    const charLimit = done ? 9 : 12
    title = status + getFirstNCharsNoTruncate(lastTask.text, charLimit)
  }

  tray.setTitle(title)
  tray.setContextMenu(buildContextMenu(updateTray))
}
