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

const HitPipsSchema = schisma({
  $type: 4,
  $validate: v => {
    if (v < 0) return 'field must be greater than 0'
    if (isNaN(v)) return 'field must be a number'
    if (![4,6,8,10,12].includes(v)) return 'field must be 4, 6, 8, 10, or 12'
  },
})

const StringSchema = schisma({
  $type: String,
  $validate: v => {
    if (v == '') return 'field must not be empty'
  },
})

const BestiaryLevelSchema = schisma({
  class: StringSchema,
  level: {
    $type: 1,
    $validate: v => {
      if (v < 0) return 'level must be greater than 0'
      if (isNaN(v)) return 'level must be a number'
    },
  },
  hitpips: HitPipsSchema,
})

const BestiaryFeatSchema = schisma({
  name: StringSchema,
})

const BestiaryLanguageSchema = schisma({
  name: StringSchema,
  distance: 0, // Only used if name == telepathy
})

const BestiarySkillSchema = schisma({
  name: StringSchema,
  value: Number,
})

const BestiaryDamageSchema = schisma({
  dice: Number,
  pips: Number,
  bonus: Number,
  types: [String],
})

const BestiaryMeleeSchema = schisma({
  name: StringSchema,
  attacks: Number,
  tohit: Number,
  damage: [BestiaryDamageSchema],
})

const BestiarySpellSchema = schisma({
  name: StringSchema,
  dc: {
    $type: Number,
    $required: false,
  },
  extra: String,
  // TODO: summons
})

const BestiaryEntrySchema = schisma({
  type: 'bestiary',
  name: StringSchema,
  description: '',
  race: StringSchema,
  // Defense
  "natural ac": Number,
  hitdice: 1,
  hitpips: HitPipsSchema,
  levels: [BestiaryLevelSchema],
  fortitude: NumberValuesSchema,
  reflex: NumberValuesSchema,
  will: NumberValuesSchema,
  dr: [{
    $type: {
      value: Number,
      bypass: String,
    },
  }],
  immune: [String],
  resist: [{
    $type: {
      type: String,
      value: Number,
    }
  }],
  sr: NumberValuesSchema,
  // Offense
  speed: {
    $type: Number,
    $default: 30,
  },
  melee: [BestiaryMeleeSchema],
  "special attacks": [String],
  "spell-like abilities": {
    cl: Number,
    concentration: Number,
    constant: [BestiarySpellSchema],
    "at will": [BestiarySpellSchema],
    "3/day": [BestiarySpellSchema],
    "1/day": [BestiarySpellSchema],
  },
  // Statistics
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
  },
  bab: Number,
  cmb: Number,
  cmd: Number,
  feats: [BestiaryFeatSchema],
  skills: [BestiarySkillSchema],
  languages: [BestiaryLanguageSchema],
})

module.exports = {
  BestiaryLevelSchema,
  BestiaryEntrySchema
}
