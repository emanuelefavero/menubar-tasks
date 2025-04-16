/**
 * This function takes a string and a character limit as input and returns the first N characters of the string without truncating any words.
 *
 * @param {string} input
 * @param {number} charLimit
 * @returns {string}
 */

export function getFirstNCharsNoTruncate(input, charLimit) {
  if (typeof input !== 'string') throw new Error('input must be a string')
  if (!charLimit || charLimit < 0 || typeof charLimit !== 'number')
    throw new Error('charLimit must be a positive number')
  if (!input) return ''
  if (input < charLimit) return input

  let words = input.split(' ')

  // If the first word is longer than charLimit, truncate the word by adding '...'
  if (words[0].length > charLimit) {
    return words[0].slice(0, charLimit - 2) + '...'
  }

  let result = ''

  for (let word of words) {
    // If adding the word exceeds the charLimit, break the loop
    if ((result + word).length > charLimit) break

    // If result + word is less than charLimit, add the word to result and also add a space before the word if result is not empty
    result += (result ? ' ' : '') + word
  }

  return result
}

/**
 * This function takes a string and returns it with a strikethrough effect using combining characters.
 *
 * @param {string} text
 * @returns {string}
 */

export function strikethrough(text) {
  return (
    text
      .split('')
      .map((char) => char + '\u0336')
      // ? \u0336 is the combining long stroke overlay
      .join('')
  )
}
