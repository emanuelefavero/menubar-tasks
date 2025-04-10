import { app, Tray, Menu, nativeImage } from 'electron'
import { addTask, loadTasks } from './tasks.js'
import path from 'path'
import fs from 'fs'

let tray = null

function buildContextMenu() {
  const tasks = loadTasks()

  const taskItems = tasks.map((task, i) => ({
    label: `${i + 1}. ${task}`,
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
  const last = tasks.at(-1) ?? ''
  tray.setTitle(last.slice(0, 10) || 'No tasks')
  tray.setContextMenu(buildContextMenu())
}

app.whenReady().then(() => {
  app.dock?.hide()
  tray = new Tray(nativeImage.createEmpty())
  updateTray()

  fs.watchFile(path.join(app.getPath('userData'), 'tasks.json'), updateTray)
})
