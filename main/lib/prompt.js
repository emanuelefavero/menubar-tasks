import prompt from 'electron-prompt'
import path from 'path'

/**
 * Shows a prompt dialog with customizable title and input label
 * @param {string} title - The title of the prompt window
 * @param {string} value - The default value for the input field
 * @returns {Promise<string|null>} The user input or null if cancelled
 */
export function showPrompt(title, value = '') {
  // NOTE: Make sure that the CSS file is in the same directory as this file and check if it will still work after building
  const __dirname = import.meta.dirname // ? added in Node.js v21.2.0, v20.11.0
  const customStylesheet = path.join(__dirname, './prompt.css')

  return prompt({
    title,
    value, // ? Useful for editing tasks
    customStylesheet, // Path to the CSS file
    label: 'Task:',
    type: 'input',
    buttonLabels: {
      ok: 'Done',
      cancel: 'Cancel',
    },
    height: 162,
  })
}
