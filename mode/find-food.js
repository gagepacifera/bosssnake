const which = 'find-food'

function process (request) {
  // get food
  let pos = request.body.you.body[0]
  console.log(`circles: i'm at ${pos.x}, ${pos.y}`)

  // go toward first food found in same row or column
  request.body.board.food.forEach(function (el) {
    console.log(`food found!`, el)
    if (el.x === pos.x) {
      console.log(`circles: same x`)
      if (el.y > pos.y) {
        return 'down'
      } else {
        return 'up'
      }
    } else if (el.y === pos.y) {
      console.log(`circles: same y`)
      if (el.x > pos.x) {
        return 'right'
      } else {
        return 'left'
      }
    }
  })
}

module.exports = {
  process,
  which
}
