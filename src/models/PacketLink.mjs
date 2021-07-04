const EventEmitter = require("events");

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
