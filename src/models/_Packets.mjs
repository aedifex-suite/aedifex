import fs from 'fs'
import path from 'path'
import _Config, { userData } from 'models/_Config'
import semver from 'semver'
import EventEmitter from 'events'

/**
 * Packets provides an interface to loading external packet modules.
 */
class Packets extends EventEmitter {
  #packets = []
  constructor() {
    super()
  }
  async restore() {
    if (_Config.settings.packets?.entries?.length) {
      for (let loc of _Config.settings.packets.entries) {
        await this.load(loc)
      }
    }
    this.emit('ready')
  }
  get packets() {
    return this.#packets
  }
  async install(loc) {
    // Install from loc, unpacking/copying as needed into our appdata dir.
  }
  // load attempts to load a packet from a given directory location. If loc is not an absolute path, then "<appdata>/packets" is used.
  async load(loc) {
    let index = this.#packets.length
    this.#packets.push({
      source: loc,
      module: null,
    })
    let p = this.#packets[index]
    this.emit('add', {
      packet: p
    })

    this.emit('loading', {
      packet: p
    })
    // If the path is not absolute, assume we're loading from our own packets directory.
    if (!path.isAbsolute(loc)) {
      loc = path.resolve(path.join(userData, 'packets', loc))
      console.log('set local path to absolute', loc)
    }
    if (loc.endsWith('.aedpak') || loc.endsWith('.aedifex-pack')) {
      // TODO: acquire app data dir, check if zip has entries or is a subdir, acquire new loc from this, then await unpack(loc) to that dir and set loc to new loc.
    }
    try {
      let pkg = JSON.parse(await fs.promises.readFile(path.join(loc, 'package.json')))
      let m = require(loc)
      if (!m.sheets || m.sheets.length === 0) {
        throw 'no sheets in packet!'
      }
      p.module = m
      p.package = pkg
    } catch(err) {
      console.log(err)
      this.#packets.splice(index, 1)
      this.emit('failed', {
        packet: p,
        error: err,
      })
    }
    this.emit('loaded', {
      packet: p
    })
    return p
  }
  // unpack attempts to unpack a given location packet into the application's packets store.
  async unpack(loc) {
    this.emit('unpack')
  }
  //
  findSupportingSheet(type, version) {
    for (let p of this.#packets) {
      for (let s of p.module.sheets) {
        for (let m of s.match) {
          if (type.match(m.type)) {
            if (semver.satisfies(version, m.version) || !version) {
              return {
                editor: s.editor,
                viewer: s.viewer,
                schema: s.schema,
              }
            } else {
              // Type match but no semver match.
            }
          } else {
            // No type match.
          }
        }
      }
    }
  }
}

export default new Packets()
