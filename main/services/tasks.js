import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { encryptData, decryptData } from '../utils/crypto.js'

// Path to the JSON file where tasks are persisted in the user's data directory
const TASKS_FILE = path.join(app.getPath('userData'), 'tasks.json')

/**
 * Loads tasks from the JSON file
 * Returns an empty array if the file doesn't exist
 * @returns {Array} Array of tasks
 */
export function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return []
  const base64 = fs.readFileSync(TASKS_FILE, 'utf8')
  const decrypted = decryptData(base64)
  return JSON.parse(decrypted)
}

/**
 * Saves tasks to the JSON file
 * @param {Array} tasks - Array of tasks to save
 */
export function saveTasks(tasks) {
  const json = JSON.stringify(tasks, null, 2)
  const base64 = encryptData(json)
  fs.writeFileSync(TASKS_FILE, base64)
}

/**
 * Adds a new task to the existing list
 * If the task already exists, removes the old one and adds the new one at the top
 * @param {string} taskText - The task text to add
 */
export function addTask(taskText) {
  const tasks = loadTasks()

  // Check if task already exists and remove it
  const existingTaskIndex = tasks.findIndex((task) => task.text === taskText)
  if (existingTaskIndex !== -1) {
    tasks.splice(existingTaskIndex, 1)
  }

  // Add the new task at the top of the list
  tasks.unshift({
    text: taskText,
    done: false,
  })

  saveTasks(tasks)
}

/**
 * Clears all tasks from the list
 */
export function clearTasks() {
  saveTasks([])
}

/**
 * Deletes a specific task from the list
 * @param {string} taskText - The text of the task to delete
 */
export function deleteTask(taskText) {
  const tasks = loadTasks()
  const updatedTasks = tasks.filter((task) => task.text !== taskText)
  saveTasks(updatedTasks)
}

/**
 * Edit a specific task in the list
 * @param {string} oldText - The text of the task to edit
 * @param {string} newText - The new task text value
 */
export function editTask(oldText, newText) {
  const tasks = loadTasks()
  const taskIndex = tasks.findIndex((task) => task.text === oldText)

  if (taskIndex !== -1) {
    // Check if a task with the new text already exists (that isn't the one we're editing)
    const duplicateIndex = tasks.findIndex(
      (task, index) => task.text === newText && index !== taskIndex
    )

    if (duplicateIndex !== -1) {
      // If a duplicate exists, remove the duplicate task (not the one being edited)
      tasks.splice(duplicateIndex, 1)
    }

    // Update the task being edited with the new text
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      text: newText,
    }

    saveTasks(tasks)
  } else {
    console.error(`Task "${oldText}" not found.`)
  }
}

/**
 * Toggle the done status of a task
 * @param {string} taskText - The text of the task to toggle
 */
export function toggleTaskDone(taskText) {
  const tasks = loadTasks()
  const taskIndex = tasks.findIndex((task) => task.text === taskText)
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      done: !tasks[taskIndex].done,
    }
    saveTasks(tasks)
  } else {
    console.error(`Task "${taskText}" not found.`)
  }
}
