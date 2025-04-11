import { Menu } from 'electron'
import { loadTasks, addTask, clearTasks, deleteTask } from '../services/tasks.js'
import prompt from 'electron-prompt'

/**
 * Builds and returns the context menu that appears when clicking the tray icon
 * The menu displays all tasks and includes options to add new tasks or quit the app
 *
 * @param {Function} updateTray - Callback to update the tray after menu actions
 * @returns {Menu} The context menu for the tray icon
 */
export function buildContextMenu(updateTray) {
  const tasks = loadTasks()

  // Convert each task into a menu item with submenu containing delete option
  const taskItems = tasks.map((task) => ({
    label: `${task}`,
    submenu: [{
      label: 'Delete',
      click: () => {
        deleteTask(task)
        updateTray()
      }
    }]
  }))

  // Add a separator and options to add task or quit
  return Menu.buildFromTemplate([
    // Title
    { label: 'Tasks', enabled: false },
    { type: 'separator' },

    // Task List
    ...taskItems,
    { type: 'separator' },

    // Add new task option
    {
      label: 'Add Task',
      click: () => {
        prompt({
          title: 'Add New Task',
          label: 'Task:',
          type: 'input',
        })
          .then((r) => {
            if (r !== null) {
              addTask(r)
              updateTray()
            }
          })
          .catch(console.error)
      },
    },

    // Clear option
    {
      label: 'Clear',
      click: () => {
        clearTasks()
        updateTray()
      },
    },

    // Quit option
    { label: 'Quit', role: 'quit' },
  ])
}
