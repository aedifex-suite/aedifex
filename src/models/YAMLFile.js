const yaml = require('yaml')
const unreson = require('unreson')
const fs = require('fs').promises
const path = require('path')

class YAMLFile extends unreson.StateObject {
  constructor(p) {
    super()
    this._path = p
    this._loaded = false
    this.load()
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
      this._type = Object.keys(YAMLFile._typeMap)[0]
      let schm = YAMLFile._typeMap[this._type]
      if (schm) {
        this._state = schm.create()
      }
    }
  }

  async save() {
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