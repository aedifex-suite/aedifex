const schisma = require('schisma')
const { NumberValuesSchema } = require('schemata/NumberValuesSchema')

/*AbilityScoreSchema = schisma({
  $type: Number,
  $default: 10,
  $validate: v => {
    if (v < 0) {
      return 'cannot be less than 0'
    }
  }
})*/

const BestiaryEntrySchema = schisma({
  type: 'bestiary',
  core: {
    hd: 1,
    hitdie: 8,
  },
  "ability scores": {
    str: {
      $type: NumberValuesSchema,
      $default: { value: 10 },
    },
    dex: {
      $type: NumberValuesSchema,
      $default: { value: 10 },
    },
    con: {
      $type: NumberValuesSchema,
      $default: { value: 10 },
    },
    wis: {
      $type: NumberValuesSchema,
      $default: { value: 10 },
    },
    int: {
      $type: NumberValuesSchema,
      $default: { value: 10 },
    },
    cha: {
      $type: NumberValuesSchema,
      $default: { value: 10 },
    },
  }
})

module.exports = BestiaryEntrySchema