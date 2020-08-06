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

module.exports = {
  averageHP: averageHP,
  conHP: conHP,
}