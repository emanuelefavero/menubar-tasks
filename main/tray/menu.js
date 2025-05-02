import { Menu, clipboard, app } from 'electron'
import {
  loadTasks,
  addTask,
  clearTasks,
  deleteTask,
  editTask,
  toggleTaskDone,
} from '../services/tasks.js'
import { loadSettings } from '../services/settings.js'
import { createPromptWindow } from '../windows/prompt.js'
import { strikethrough } from '../utils/text.js'
import { createSettingsWindow } from '../windows/settings.js'

/**
 * Builds and returns the context menu that appears when clicking the tray icon
 * The menu displays all tasks and includes options to add new tasks or quit the app
 *
 * @param {Function} updateTray - Callback to update the tray after menu actions
 * @returns {Menu} The context menu for the tray icon
 */
export function buildContextMenu(updateTray) {
  const tasks = loadTasks()
  const settings = loadSettings()

  // Convert each task into a menu item with submenu containing delete option
  const taskItems = tasks.map((task, index) => ({
    label: task.done
      ? `✅ ${strikethrough(task.text)}`
      : settings.showUndoneIcon
      ? `◻️ ${task.text}`
      : task.text,
    // Remove accelerator from main task item
    submenu: [
      {
        label: task.done ? 'Mark as Undone' : 'Mark as Done',
        // Add accelerator to the "Mark as Done"/"Mark as Undone" submenu item for first 9 tasks
        accelerator: index < 9 ? `CommandOrControl+${index + 1}` : undefined,
        click: (_, window, event) => {
          toggleTaskDone(task.text)
          updateTray()

          // Check if this was triggered by a keyboard shortcut
          // We can detect keyboard shortcuts by checking the event object
          if (event && event.triggeredByAccelerator) {
            // Set a slight delay to reopen the menu
            setTimeout(() => {
              // Force the tray menu to popup again after keyboard shortcut
              const tray = global.tray || app.dock?.getBounds?.().tray
              if (tray && tray.popUpContextMenu) {
                tray.popUpContextMenu()
              }
            }, 50) // Small delay to allow the menu to close first
          }
        },
      },
      {
        label: 'Edit',
        click: () => {
          createPromptWindow('Edit Task', task.text)
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
        // Add accelerator to the "Delete" submenu item for first 9 tasks
        accelerator:
          index < 9 ? `CommandOrControl+Alt+${index + 1}` : undefined,
        click: (_, window, event) => {
          deleteTask(task.text)
          updateTray()

          // Check if this was triggered by a keyboard shortcut
          // We can detect keyboard shortcuts by checking the event object
          if (event && event.triggeredByAccelerator) {
            // Set a slight delay to reopen the menu
            setTimeout(() => {
              // Force the tray menu to popup again after keyboard shortcut
              const tray = global.tray || app.dock?.getBounds?.().tray
              if (tray && tray.popUpContextMenu) {
                tray.popUpContextMenu()
              }
            }, 50) // Small delay to allow the menu to close first
          }
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

    // Add new task option
    {
      label:
        tasks.length >= settings.maxTasks
          ? 'Add Task (Max Limit Reached)'
          : '➕ Add Task',
      enabled: tasks.length < settings.maxTasks,
      accelerator: 'CommandOrControl+N',
      click: () => {
        createPromptWindow()
          .then((r) => {
            if (r !== null && r.trim() !== '') {
              addTask(r)
              updateTray()
            }
          })
          .catch((error) => {
            if (error.message !== 'Prompt window already open') {
              console.error(error)
            }
          })
      },
    },
    // Task List
    ...taskItems,
    { type: 'separator' },

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

    // Settings option
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        createSettingsWindow()
      },
    },

    // Quit option
    { label: 'Quit', role: 'quit' },
  ])
}
