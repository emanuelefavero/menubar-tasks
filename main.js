import { app, Menu, Tray, nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'

let tray = null
const TASKS_FILE = path.join(app.getPath('userData'), 'tasks.json')

// Helper to read and write tasks
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return []
  return JSON.parse(fs.readFileSync(TASKS_FILE))
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2))
}

function addTask(task) {
  const tasks = loadTasks()
  tasks.push(task)
  saveTasks(tasks)
}

function buildContextMenu() {
  const tasks = loadTasks()

  const taskItems = tasks.map((task, index) => ({
    label: `${index + 1}. ${task}`,
    enabled: false,
  }))

  return Menu.buildFromTemplate([
    { label: 'Tasks:', enabled: false },
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

function updateTray() {
  const tasks = loadTasks()
  const lastTask = tasks[tasks.length - 1] || ''
  const shortTitle = lastTask.substring(0, 10) || 'No tasks'

  tray.setTitle(shortTitle)
  tray.setContextMenu(buildContextMenu())
}

app.whenReady().then(() => {
  // Optional: hide dock icon
  app.dock?.hide()

  tray = new Tray(nativeImage.createEmpty()) // We won't show an icon, just text

  tray.setContextMenu(buildContextMenu())
  updateTray()

  // Refresh the title if tasks.json changes externally (optional)
  fs.watchFile(TASKS_FILE, updateTray)
})
