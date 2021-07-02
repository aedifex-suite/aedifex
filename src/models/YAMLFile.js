const yaml = require('yaml')
const unreson = require('unreson')
const fs = require('fs').promises
const path = require('path')
const dialog = require('electron').remote.dialog

class YAMLFile extends unreson.StateObject {
  constructor(p, type) {
    super()
    this._path = p
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

  async load() {
    if (this.path) {
      let text = await fs.readFile(this.path, {encoding: 'utf8'})
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

  async save() {
    if (!this.path) {
      let result = dialog.showSaveDialogSync({
        title: 'Save Aedifex file to...',
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
    let result = await fs.writeFile(this.path, text, {encoding: 'utf8'})
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
    return path.basename(this._path, path.extname(this._path)) || 'untitled'
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

module.exports = YAMLFile
