const schisma = require('schisma')
const { NumberValuesSchema } = require('schemata/NumberValuesSchema')
const StringSchema  = require('schemata/String')
const HitPipsSchema = require('schemata/HitPips')
const DamageSchema  = require('schemata/Damage')

/*AbilityScoreSchema = schisma({
  $type: Number,
  $default: 10,
  $validate: v => {
    if (v < 0) {
      return 'cannot be less than 0'
    }
  }
})*/

const SizeSchema = schisma({
  $type: String,
  $default: 'medium',
  $validate: v => {
    if (typeof v !== "string" && !(v instanceof String)) return 'field must be a string'
    if (!['fine', 'diminutive', 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal'].includes(v)) return "field must be 'fine', 'diminutive', 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal'"
  },
})

const BABSchema = schisma({
  $type: Number,
  $default: 0.75,
  $validate: v => {
    if (v < 0) return 'field must be greater than 0'
    if (isNaN(v)) return 'field must be a number'
    if (![0.5,0.75,1].includes(v)) return 'field must be 0.5, 0.75, or 1'
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
  favored: Boolean,
  prestige: Boolean,
  hitpips: HitPipsSchema,
  bab: BABSchema,
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

const BestiaryMeleeSchema = schisma({
  name: StringSchema,
  attacks: Number,
  tohit: Number,
  damage: [DamageSchema],
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
  size: SizeSchema,
  // Defense
  "natural ac": Number,
  hitdice: 1,
  hitpips: HitPipsSchema,
  bab: BABSchema,
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
