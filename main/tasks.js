import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const TASKS_FILE = path.join(app.getPath('userData'), 'tasks.json')

export function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return []
  return JSON.parse(fs.readFileSync(TASKS_FILE))
}

export function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2))
}

export function addTask(task) {
  const tasks = loadTasks()
  tasks.push(task)
  saveTasks(tasks)
}
