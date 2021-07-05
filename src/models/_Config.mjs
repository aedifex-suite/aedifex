import path     from 'path'
import fs       from 'fs'
import unreson  from 'unreson'
import yaml     from 'yaml'

// Get our locations.
export const appData         = process.env.APPDATA || (process.platform == 'darwin' ? path.join(process.env.HOME, 'Library/Preferences') : path.join(process.env.HOME, "/.local/share"))
export const userData        = path.join(appData, 'aedifex')
export const settingsPath    = path.join(userData, 'settings.yml')

/**
 * Config is a standalone configuration system that supports automatic saving.
 */
class Config {
  constructor() {
    // Load our settings from disk.
    let settings = {}
    try {
      settings = yaml.parse(fs.readFileSync(settingsPath, { encoding: 'utf-8'}))
    } catch (e) {
      settings = {}
    }

    // Convert it to an unreson StateObject.
    this._settings = new unreson.StateObject(settings)
    // Cause unreson object changes to start a pending save.
    this._settings.on('change', e => {
      this.startPendingSave()
    })
  }
  /**
   * load merges the current state with the given defaults.
   * 
   * @param {Object} defaults - A JSON-safe object representing the settings to store.
   */
  load(defaults) {
    // Convert it to an unreson StateObject.
    this._settings.state = Object.assign(defaults, this._settings._state)
  }
  /**
   * settings returns the underlying unreson state Proxy.
   */
  get settings() {
    return this._settings.state
  }
  /**
   * Saves the config to disk.
   * @param {Boolean} force force saving of file, ignoring the pending save system.
   */
  async save(force) {
    if (force) {
      try {
        await fs.promises.mkdir(userData, { recursive: true, mode: 0o755 })
        await fs.promises.writeFile(settingsPath, yaml.stringify(this._settings._state))
      } catch(e) {
        console.log(e)
      }
      if (this._pendingSave) clearTimeout(this._pendingSave)
    } else {
      this.startPendingSave()
    }
  }
  /**
   * Starts a pending save operation that will issue save(true)
   */
  startPendingSave() {
    if (this._pendingSave) {
      clearTimeout(this._pendingSave)
    }
    this._pendingSave = setTimeout(() => {
      this._pendingSave = null
      this.save(true)
    }, 3000)
  }
}

export default new Config()
