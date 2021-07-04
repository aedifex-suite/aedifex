import fs from 'fs'
import path from 'path'
import _Config from 'models/_Config'
import semver from 'semver'
import EventEmitter from 'events'

/**
 * Packets provides an interface to loading external packet modules.
 * A packet module is simply a zip file that is expected to conform to the following:
 *   * package.json
 *     * contains aedifex.schemata: [file entry] for target JavaScript CSM modules.
 *     * contains aedifex.editor: file entry for editor JavaScript CSM module. If ommitted, the DumbEntryEditor component is used.
 *     * contains aedifex.view: file entry for view JavaScript CSM module. If ommitted, the DumbEntryViewer component is used.
 * 
 * Each of these files obey the following:
 *  * [schemata] provides schisma-compatible schemas to be used for data.
 *  * editor exports a compiled Marko CSM module that accepts an input of "file"
 *  * view exports a compiled Marko CSM module that accepts an input of "file"
 */
class Packets extends EventEmitter {
  #packets = []
  constructor() {
    super()
  }
  get packets() {
    return this.#packets
  }
  // load attempts to load a packet from a given directory location.
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
