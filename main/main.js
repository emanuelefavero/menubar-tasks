import { app, Tray, Menu, nativeImage } from 'electron'
import { addTask, loadTasks } from './tasks.js'
import path from 'path'
import fs from 'fs'
import { getFirstNCharsNoTruncate } from './utils/text.js'

// Global reference to the tray icon
// TIP: The tray icon is the app icon that appears in the menu bar on macOS
let tray = null

/**
 * Builds and returns the context menu that appears when clicking the tray icon
 * The menu displays all tasks and includes options to add new tasks or quit the app
 *
 * @returns {Menu} The context menu for the tray icon
 */
function buildContextMenu() {
  const tasks = loadTasks()

  // Convert each task into a menu item with numbering
  const taskItems = tasks.map((task, i) => ({
    label: `${task}`,
    // enabled: false, // Tasks are displayed but not clickable
  }))

  // Add a separator and an option to add a dummy task
  return Menu.buildFromTemplate([
    { label: 'Tasks', enabled: false },
    { type: 'separator' },
    ...taskItems,
    { type: 'separator' },
    {
      label: 'Add Dummy Task',
      click: () => {
        addTask(`Task at ${new Date().toLocaleTimeString()}`)
        updateTray()
      },
    },
    { label: 'Quit', role: 'quit' },
  ])
}

/**
 * Updates the tray icon's title and context menu
 * The title shows the most recent task (truncated to 10 characters)
 *
 * @returns {void}
 */
function updateTray() {
  const tasks = loadTasks()
  const last = tasks.at(-1) ?? ''
  // tray.setTitle(`${last.slice(0, 12)}` || 'No tasks')
  tray.setTitle(getFirstNCharsNoTruncate(last, 12) || 'No tasks')
  tray.setContextMenu(buildContextMenu())
}

// Initialize the app when Electron is ready
app.whenReady().then(() => {
  // Hide the dock icon on macOS
  app.dock?.hide()
  // Create a new tray instance with an empty icon
  tray = new Tray(nativeImage.createEmpty())
  updateTray()

  // Watch for changes to the tasks file and update the tray accordingly
  fs.watchFile(path.join(app.getPath('userData'), 'tasks.json'), updateTray)
})
