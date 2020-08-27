const schisma = require('schisma')

const StringSchema = schisma({
  $type: String,
  $validate: v => {
    if (v == '') return 'field must not be empty'
  },
})

module.exports = StringSchema