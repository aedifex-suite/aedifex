const schisma = require('schisma')

AbilityScoreSchema = schisma({
  $type: Number,
  $default: 10,
  $validate: v => {
    if (v < 0) {
      return 'cannot be less than 0'
    }
  }
})

const BestiaryEntrySchema = schisma({
  type: 'bestiary',
  "ability scores": {
    str: AbilityScoreSchema,
    dex: AbilityScoreSchema,
    con: AbilityScoreSchema,
    wis: AbilityScoreSchema,
    int: AbilityScoreSchema,
    cha: AbilityScoreSchema,
  }
})

module.exports = BestiaryEntrySchema