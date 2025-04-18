import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const settingsPath = path.join(app.getPath('userData'), 'settings.json')

const defaultSettings = {
  showUndoneIcon: true,
  maxTasks: 33, // Default to non-scrolling amount
}

export function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
      return { ...defaultSettings, ...settings }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
  return defaultSettings
}

export function saveSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}
