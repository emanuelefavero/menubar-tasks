import { app } from 'electron'
import fs from 'fs'
import path from 'path'

// Path to the JSON file where tasks are persisted in the user's data directory
const TASKS_FILE = path.join(app.getPath('userData'), 'tasks.json')

/**
 * Loads tasks from the JSON file
 * Returns an empty array if the file doesn't exist
 * @returns {Array} Array of tasks
 */
export function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return []
  return JSON.parse(fs.readFileSync(TASKS_FILE))
}

/**
 * Saves tasks to the JSON file
 * @param {Array} tasks - Array of tasks to save
 */
export function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2))
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
