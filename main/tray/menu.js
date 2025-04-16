import { Menu, clipboard } from 'electron'
import {
  loadTasks,
  addTask,
  clearTasks,
  deleteTask,
  editTask,
  toggleTaskDone,
} from '../services/tasks.js'
import { showPrompt } from '../lib/prompt.js'
import { strikethrough } from '../utils/text.js'

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
    label: task.done ? `✅ ${strikethrough(task.text)}` : `◻️ ${task.text}`,
    click: () => {
      toggleTaskDone(task.text)
      updateTray()
    },
    submenu: [
      {
        label: task.done ? 'Mark as Undone' : 'Mark as Done',
        click: () => {
          toggleTaskDone(task.text)
          updateTray()
        },
      },
      {
        label: 'Edit',
        click: () => {
          showPrompt('Edit Task', task.text)
            .then((r) => {
              if (r !== null) {
                if (r.trim() === '') {
                  deleteTask(task.text) // Delete task if empty
                } else {
                  editTask(task.text, r)
                }

                updateTray()
              }
            })
            .catch(console.error)
        },
      },
      {
        label: 'Delete',
        click: () => {
          deleteTask(task.text)
          updateTray()
        },
      },
      {
        label: 'Copy',
        click: () => {
          clipboard.writeText(task.text) // Copy task to clipboard
        },
      },
    ],
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
        showPrompt('Add New Task')
          .then((r) => {
            if (r !== null) {
              if (r.trim() !== '') {
                addTask(r) // Add task if not empty
              }

              updateTray()
            }
          })
          .catch(console.error)
      },
    },

    // Clear option
    tasks.length > 0
      ? {
          label: 'Clear',
          submenu: [
            {
              label: 'Clear All',
              click: () => {
                clearTasks()
                updateTray()
              },
            },
          ],
        }
      : { label: 'Clear', enabled: false }, // Disable if no tasks

    // Quit option
    { label: 'Quit', role: 'quit' },
  ])
}
