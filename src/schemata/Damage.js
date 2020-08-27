const schisma = require('schisma')

const DamageSchema = schisma({
  dice: Number,
  pips: Number,
  bonus: Number,
  types: [String],
})

module.exports = DamageSchema