import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import crypto from 'crypto'

const KEY_PATH = path.join(app.getPath('userData'), 'key.json')

/**
 * Returns a consistent encryption key for the current user/app.
 * Generates a new key and saves it if it doesn't exist.
 * @returns {Buffer} 32-byte encryption key
 */
export function getEncryptionKey() {
  if (fs.existsSync(KEY_PATH)) {
    return Buffer.from(JSON.parse(fs.readFileSync(KEY_PATH)).key, 'hex')
  }
  const key = crypto.randomBytes(32)
  fs.writeFileSync(KEY_PATH, JSON.stringify({ key: key.toString('hex') }))
  return key
}
