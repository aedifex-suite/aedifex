/**
 * averageHP returns the average HP value for the given HD and dice.
 * @param {Number} hd 
 * @param {Number} d 
 * @returns {Number}
 */
function averageHP(hd=1, d=8) {
  let error
  if (isNaN(hd)) {
    hd = 1
    error = 'bad hd'
  }
  if (isNaN(d)) {
    d = 8
    error = 'bad die'
  }
  return [Math.floor((d+1)/2 * hd), error]
}

function conHP(hd=1, con=10) {
  let error
  if (isNaN(hd)) {
    hd = 1
    error = 'bad hd'
  }
  if (isNaN(con)) {
    con = 10
    error = 'bad con'
  }
  return [Math.floor((con-10)/2) * hd, error]
}

/**
 * collectHD returns a sorted map of hitpips to hitdice collected from the entry's hitdice and hitpips as well as the entry's levels.
 * @param {BestiaryEntrySchema} entry The entry to target
 * @returns {Map} Map of hitpips to hitdice count, sorted from highest to lowest.
 */
function collectHD(entry) {
  let results = new Map()
  if (entry.hitdice && entry.hitpips) {
    results.set(entry.hitpips, entry.hitdice + (results.get(entry.hitpips)||0))
  }
  if (entry.levels) {
    for (let level of entry.levels) {
      results.set(level.hitpips, level.level + (results.get(level.hitpips)||0))
    }
  }
  results = new Map([...results.entries()].sort((a,b)=>b[0]-a[0]))
  return [results, undefined]
}

module.exports = {
  averageHP: averageHP,
  conHP: conHP,
  collectHD: collectHD,
}