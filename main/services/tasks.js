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
 * @param {string} task - The task to add
 */
export function addTask(task) {
  const tasks = loadTasks()
  tasks.unshift(task)
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
 * @param {string} taskToDelete - The task to delete
 */
export function deleteTask(taskToDelete) {
  const tasks = loadTasks()
  const updatedTasks = tasks.filter((task) => task !== taskToDelete)
  saveTasks(updatedTasks)
}

/**
 * Edit a specific task in the list
 * @param {string} oldTask - The task to edit
 * @param {string} newTask - The new task value
 */
export function editTask(oldTask, newTask) {
  const tasks = loadTasks()
  const taskIndex = tasks.indexOf(oldTask)
  if (taskIndex !== -1) {
    tasks[taskIndex] = newTask
    saveTasks(tasks)
  } else {
    console.error(`Task "${oldTask}" not found.`)
  }
}
