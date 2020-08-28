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

const AlignmentSchema = schisma({
  moral: {
    $type: String,
    $default: 'neutral',
    $validate: v => {
      if (typeof v !== "string" && !(v instanceof String)) return 'field must be a string'
      if(!['good', 'neutral', 'evil'].includes(v)) return "field must be 'good', 'neutral', or 'evil'"
    },
  },
  law: {
    $type: String,
    $default: 'neutral',
    $validate: v => {
      if (typeof v !== "string" && !(v instanceof String)) return 'field must be a string'
      if(!['lawful', 'neutral', 'chaotic'].includes(v)) return "field must be 'lawful', 'neutral', or 'chaotic'"
    },
  },
})

const SaveSchema = schisma({
  $type: String,
  $default: 'bad',
  $validate: v => {
    if (typeof v !== "string" && !(v instanceof String)) return 'field must be a string'
    if (v !== 'good' || v !== 'bad') return "field must be 'good' or 'bad'"
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
  saves: {
    fortitude: SaveSchema,
    reflex: SaveSchema,
    will: SaveSchema,
  },
})

const BestiaryFeatModifierSchema = schisma({
  dot: String,
  value: {
    $typeof: [Number, String],
  },
})

const BestiaryFeatSchema = schisma({
  name: StringSchema,
  modifies: [BestiaryFeatModifierSchema],
})

const BestiaryItemModifierSchema = schisma({
  dot: String,
  value: {
    $typeof: [Number, String],
  },
})

const BestiaryItemSchema = schisma({
  name: StringSchema,
  equipped: Boolean,
  modifies: [BestiaryItemModifierSchema],
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
  alignment: AlignmentSchema,
  // Defense
  "natural ac": Number,
  hitdice: 1,
  hitpips: HitPipsSchema,
  bab: BABSchema,
  levels: [BestiaryLevelSchema],
  saves: {
    fortitude: SaveSchema,
    reflex: SaveSchema,
    will: SaveSchema,
  },
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
  items: [BestiaryItemSchema],
  skills: [BestiarySkillSchema],
  languages: [BestiaryLanguageSchema],
})

module.exports = {
  BestiaryEntrySchema,
  BestiaryLevelSchema,
  BestiaryFeatSchema,
  BestiaryFeatModifierSchema,
  BestiaryItemSchema,
  BestiaryItemModifierSchema,
}
