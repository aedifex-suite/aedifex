const EventEmitter = require("events");

/**
 * PacketLink is an object that is provided to the packet modules. This allows the packets to handle changes to files, verification, and otherwise.
 */
class PacketLink extends EventEmitter {
  constructor() {
    super()
  }
  ready() {
    this.emit('ready')
  }
  refresh() {
    this.emit('refresh')
  }
  destroy() {
    this.emit('destroy')
  }
  errors(errors) {
    this.emit('errors', errors)
  }
}

export default PacketLink
