const schisma = require('schisma')

const HitPipsSchema = schisma({
  $type: 4,
  $validate: v => {
    if (v < 0) return 'field must be greater than 0'
    if (isNaN(v)) return 'field must be a number'
    if (![4,6,8,10,12].includes(v)) return 'field must be 4, 6, 8, 10, or 12'
  },
})

module.exports = HitPipsSchema