import yaml from 'yaml'
import unreson from 'unreson'
import fs from 'fs'
import path from 'path'
import electron from 'electron'
const dialog = electron.remote.dialog

/**
 * YAMLFile provides a method to load, store, and modify YAML files backed by a schema.
 */
class YAMLFile extends unreson.StateObject {
  constructor(p, type) {
    super()
    this._path = p
    this._shortpath = path.basename(this._path) || 'untitled.aedifex'
    this._loaded = false
    this._saved = true
    this._type = type

    this._id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })

    this.addListener('change', () => {
      this._saved = false
    })
    this.addListener('undo', () => {
      this._saved = false
    })
    this.addListener('redo', () => {
      this._saved = false
    })
  }

  /**
   * load reads and parses a YAML document into the YAMLFile's state. It also attempts to acquire a schema from the static typeMap.
   */
  async load() {
    if (this.path) {
      let text = await fs.promises.readFile(this.path, {encoding: 'utf8'})
      let obj = yaml.parse(text)
      this._type = obj.type
      let schm = YAMLFile._typeMap[this._type]
      if (schm) {
        console.log(schm.validate(obj))
        this._state = schm.conform(obj)
      } else {
        this._state = obj
      }
    } else {
      if (!this._type || typeof this._type !== 'string') {
        this._type = Object.keys(YAMLFile._typeMap)[0]
      }
      let schm = YAMLFile._typeMap[this._type]
      if (schm) {
        this._state = schm.create()
      }
    }
  }

  /**
   * save attempts to save the current state to the current path. If no path is provided, then a save as dialog is shown to the user. If the state does not pass schema validation, then a prompt is provided and the user is given the option to forcibly save.
   */
  async save() {
    if (!this.path) {
      let result = dialog.showSaveDialogSync({
        title: 'Save Aedifex file to...',
        defaultPath: this._shortpath,
        filters: [{
          name: 'aedifex',
          extensions: ['aedifex', 'aed']
        },
        {
          name: 'yaml',
          extensions: ['yaml', 'yml']
        }],
      })
      if (result) {
        this._path = result
        this._shortpath = path.basename(this._path)
      }
    }
    if (!this.path) {
      return false
    }

    let schm = YAMLFile._typeMap[this._type]
    if (schm) {
      let r = schm.validate(this._state)
      if (r.length) {
        let msg = `Cannot save "${this.path}"\n\n`
        for (let {where, message, code, value} of r) {
          msg += `"${where}" with a value of "${value}" is ${code}: ${message}\n\n`
        }
        msg += `Forcibly saved files may not be openable!`
        let results = dialog.showMessageBoxSync({
          title: 'Cannot save file',
          message: msg,
          type: 'error',
          buttons: ['Force Save', 'OK'],
          defaultId: 1,
          cancelId: 1,
        })
        if (results === 1) {
          return false
        }
      }
    }

    let text = yaml.stringify(this._state)
    let result = await fs.promises.writeFile(this.path, text, {encoding: 'utf8'})
    if (!result) {
      this._saved = true
      this.emit('saved')
      return true
    }
    return false
  }

  // unsaved returns if the file has unsaved changes.
  get unsaved() {
    return !this._saved
  }

  // close closes the file.
  /**
   * close attempts to close the file. If there are unsaved changes, a prompt is shown allowing the user to save, not save, or cancel the operation.
   */
  async close() {
    let shouldClose = false
    if (!this._saved) {
      let result = dialog.showMessageBoxSync({
        type: "question",
        buttons: ["Save", "Don't Save", "Cancel"],
        defaultId: 2,
        title: "Unsaved changes",
        message: `Do you want to save the changes you made to ${this.path}?`,
        detail: "Your changes will be lost if you don't save them.",
      })
      if (result === 0) { // Save
        result = await this.save()
        if (result) {
          return 'close'
        }
      } else if (result === 1) { // Don't Save
        return 'close'
      }
    } else {
      return 'close'
    }
    return 'cancel'
  }

  // rename renames the file by its short name.
  /**
   * rename attempts to rename the file's underlying path to the given parameter. If a file exists at the location, a prompt is shown asking to overwrite.
   * 
   * @param {string} to - The file path to rename to.
   */
  async rename(to) {
    let succeeded = false
    if (this._path) {
      let newPath = path.join(this._path.substring(0, this._path.length - path.basename(this._path).length), to + path.extname(this._path))
      to = to + path.extname(this._path)
      try {
        await fs.promises.stat(newPath)
        let results = dialog.showMessageBoxSync({
          title: 'File exists',
          message: `Cannot rename "${this._shortpath}" to "${to}", as a file with that name already exists.`,
          type: 'warning',
          buttons: ["Overwrite", "OK"]
        })
        if (results === 0) {
          await fs.promises.rename(this._path, newPath)
          this._shortpath = to
          this._path = newPath
        }
      } catch(err) {
        if (err.code === 'ENOENT') {
          try {
            await fs.promises.rename(this._path, newPath)
            this._shortpath = to
            this._path = newPath
          } catch(err) {
            dialog.showMessageBoxSync({
              title: 'Cannot rename file',
              message: err.toString(),
              type: 'error',
            })
          }
        } else {
          dialog.showMessageBoxSync({
            title: 'Cannot rename file',
            message: err.toString(),
            type: 'error',
          })
        }
      }
    }
    this.emit('rename')
  }

  // id gets the unique random ID of the file.
  get id() {
    return this._id
  }

  // path returns the full underlying path of the file.
  get path() {
    return this._path
  }

  // title returns the basename of the file excluding extensions.
  get title() {
    return path.basename(this._shortpath, path.extname(this._shortpath))
  }

  // type returns a string corresponding to the type of aedifex entry this file represents.
  get type() {
    return this._type
  }
}
YAMLFile.addSchisma = (type, schm) => {
  YAMLFile._typeMap[type] = schm
}
YAMLFile._typeMap = {}

export default YAMLFile
