var reaction = {
  'message' : 'sss. sss. sss.'
}

function get () {
  return reaction
}

function update (request) {
  var message = 'My health is ' + request.body.you.health

  reaction = {
    'message' : message,
    'data' : request.body
  }
}

module.exports = {
  get,
  update
}
