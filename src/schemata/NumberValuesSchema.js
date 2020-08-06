const schisma = require('schisma')

const NumberValueSchema = schisma({
  value: Number,
  note: {
    $type: String,
    $required: false,
  },
})

const NumberValuesSchema = schisma({
  value: Number,                  // Base-line value
  extras: {
    $type: [NumberValueSchema],    //
    $required: false,
  },
  modifiers: {
    $type: [NumberValueSchema], // Modifiers
    $required: false,
  },
  applies: {
    $type: [String],              // dot-syntax to other fields the computed value applies to.
    $required: false,
  },
})

module.exports = {
  NumberValueSchema: NumberValueSchema,
  NumberValuesSchema: NumberValuesSchema,
}