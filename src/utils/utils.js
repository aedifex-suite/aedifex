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


/**
 * getBaseAttack returns the highest base attack from the base HD*BAB or each level's BAB * level. This presumes non-fractional BAB calculation.
 * @param {BestiaryEntrySchema} entry The entry to target
 * @returns {Number} Calculated highest base attack.
 */
function getBaseAttack(entry) {
  let bestattack = Math.floor(entry.hitdice * entry.bab)
  if (entry.levels) {
    for (let i = 0; i < entry.levels.length; i++) {
      let level = entry.levels[i]
      let baseattack = Math.floor(level.bab * level.level)
      if (baseattack > bestattack) {
        bestattack = baseattack
      }
    }
  }
  return bestattack
}

const sizeModifiers = {
  'fine': -8,
  'diminutive': -4,
  'tiny': -2,
  'small': -1,
  'medium': 0,
  'large': 1,
  'huge': 2,
  'gargantuan': 4,
  'colossal': 8,
}

function getCMB(entry) {
  let baseattack = getBaseAttack(entry)
  let strmod = Math.floor((entry["ability scores"].str.value-10)/2)
  let sizemod = sizeModifiers[entry.size]
  let other = 0 // TODO
  return baseattack + strmod + sizemod + other
}

function getCMD(entry) {
  let base = 10
  let baseattack = getBaseAttack(entry)
  let strmod = Math.floor((entry["ability scores"].str.value-10)/2)
  let dexmod = Math.floor((entry["ability scores"].dex.value-10)/2)
  let sizemod = sizeModifiers[entry.size]
  let other = 0 // TODO: This could be deflection, dodge, insight, morale, profale, sacred, as well as penalties (to Touch AC)
  return base + baseattack + strmod + dexmod + sizemod + other
}

const shortAlignments = {
  'neutral': 'N',
  'good': 'G',
  'evil': 'E',
  'lawful': 'L',
  'chaotic': 'C',
}

function getShortAlignment(alignment) {
  let a = '-'
  if (alignment.law === 'neutral' && alignment.moral === 'neutral') {
    a = 'N'
  } else {
    a = shortAlignments[alignment.law]+shortAlignments[alignment.moral]
  }
  return a
}

function getSave(entry, which) {
  let basesave = entry.saves[which]==='good'?2:0
  basesave += entry.saves[which]==='good'?0.5:0.34 * entry.hitdice // NOTE: I don't know if 0.34 is correct, but it works up to lvl 20.
  if (entry.levels) {
    for (let i = 0; i < entry.levels.length; i++) {
      let level = entry.levels[i]
      let save = level.saves[which]==='good'?2:0
      save += level.saves[which]==='good'?0.5:0.34 * level.level
      if (save > basesave) {
        basesave = save
      }
    }
  }
  return basesave
}

module.exports = {
  averageHP: averageHP,
  conHP: conHP,
  collectHD: collectHD,
  getBaseAttack: getBaseAttack,
  getCMB: getCMB,
  getCMD: getCMD,
  getShortAlignment: getShortAlignment,
  getSave: getSave,
}