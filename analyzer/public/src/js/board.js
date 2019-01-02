/*
 * Return board markup
 */
function display (gameState) {
  try {

    let map = getBoardMap(gameState)
    return `<p>Turn = <strong>${gameState.turn}</strong></p>`
    
  } catch (err) {

    console.error('gameState: error = ', err)

  }
}

/*
 * Return game board elements in two dimensional array
 */
function getBoardMap (gameState) {
  try {

    // create blank map
    let map = []
    for (let x = 0; x < gameState.board.width; x++) {
      map.push([])
      for (let y = 0; y < gameState.board.height; y++) {
        map[x].push({ what:'empty' })
      }
    }

    // add snakes to map
    gameState.board.snakes.forEach((snake) => {
      snake.body.forEach((segment, i) => {
        let what
        if (i === 0) {
          what = 'head'
        } else if (i === snake.body.length - 1) {
          what = 'tail'
        } else {
          what = 'body'
        }
        map[segment.x][segment.y] = {
          snake: snake,
          what: what
        }
      })
    })

    // add you to map
    gameState.you.body.forEach((segment, i) => {
      let what
      if (i === 0) {
        what = 'my-head'
      } else if (i === gameState.you.body.length - 1) {
        what = 'my-tail'
      } else {
        what = 'my-body'
      }
      map[segment.x][segment.y] = {
        snake: gameState.you,
        what: what
      }
    })

    // add food to map
    gameState.board.food.forEach((f) => {
      map[f.x][f.y] = {
        what: 'food'
      }
    })

    return map

  } catch (err) {

    console.error('getBoardMap: error = ', err)

  }
}

module.exports = {
  display,
  getBoardMap,
}
