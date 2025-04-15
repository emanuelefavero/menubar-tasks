import crypto from 'crypto'
import { getEncryptionKey } from './key.js'

const ALGORITHM = 'aes-256-cbc'
const IV = Buffer.alloc(16, 0) // You can randomize this per entry for extra security if needed

const KEY = getEncryptionKey()

/**
 * Encrypts a string and returns a base64-encoded string
 * @param {string} data - The string to encrypt
 * @returns {string} The encrypted string in base64 format
 */
export function encryptData(data) {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV)
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()])
  return encrypted.toString('base64')
}

/**
 * Decrypts a base64-encoded string back into plaintext
 * @param {string} base64Data - The encrypted string in base64
 * @returns {string} The decrypted string
 */
export function decryptData(base64Data) {
  const encrypted = Buffer.from(base64Data, 'base64')
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    'utf8'
  )
}
