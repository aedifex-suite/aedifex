const yaml = require('yaml')
const unreson = require('unreson')
const fs = require('fs').promises
const path = require('path')

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
      if (!this._type) {
        this._type = Object.keys(YAMLFile._typeMap)[0]
      }
      let schm = YAMLFile._typeMap[this._type]
      if (schm) {
        this._state = schm.create()
      }
    }
  }

  async save() {
    let text = yaml.stringify(this._state)
    let result = await fs.writeFile(this.path, text, {encoding: 'utf8'})
    if (!result) {
      this._saved = true
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
    return true
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