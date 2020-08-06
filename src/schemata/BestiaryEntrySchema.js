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

const BestiaryFeatSchema = schisma({
  name: String,
})

const BestiaryLanguageSchema = schisma({
  name: String,
  distance: 0, // Only used if name == telepathy
})

const BestiarySkillSchema = schisma({
  name: String,
  value: Number,
})

const BestiaryDamageSchema = schisma({
  dice: Number,
  pips: Number,
  bonus: Number,
  types: [String],
})

const BestiaryMeleeSchema = schisma({
  name: String,
  attacks: Number,
  tohit: Number,
  damage: [BestiaryDamageSchema],
})

const BestiarySpellSchema = schisma({
  name: String,
  dc: {
    $type: Number,
    $required: false,
  },
  extra: String,
  // TODO: summons
})

const BestiaryEntrySchema = schisma({
  type: 'bestiary',
  description: '',
  // Defense
  "natural ac": Number,
  hitdice: 1,
  hitpips: 8,
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

module.exports = BestiaryEntrySchema
