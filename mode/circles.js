const which = 'circles'

function process (request) {
  // circles!
  let remainder = request.body.turn % 4
  if (remainder === 0) {
    return 'up'
  } else if (remainder === 1) {
    return 'right'
  } else if (remainder === 2) {
    return 'down'
  } else if (remainder === 3) {
    return 'left'
  }
}

module.exports = {
  process,
  which
}
