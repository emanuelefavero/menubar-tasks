import prompt from 'electron-prompt'

/**
 * Shows a prompt dialog with customizable title and input label
 * @param {string} title - The title of the prompt window
 * @param {string} value - The default value for the input field
 * @returns {Promise<string|null>} The user input or null if cancelled
 */
export function showPrompt(title, value = '') {
  return prompt({
    title,
    label: 'Task:',
    type: 'input',
    value,
  })
}
