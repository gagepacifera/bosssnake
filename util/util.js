const moves = ['up', 'right', 'down', 'left']

/*
 * Choose alternate move if your snake will die
 */
function dontDie (gameState, move) {

  try {
    // if current move isn't set or will result in death, pick a better one (if possible)
    console.log('dont die! move = ' + move + ', gameState = ' + JSON.stringify(gameState))

    // if move is invalid, get random move
    if (!move || move === undefined || move === null || moves.indexOf(move) === -1) {
      move = getRandomMove()
      console.log(`INVALID MOVE!! picking a rando (${move})`)
    }

    // figure out what's around me
    let adjacent = getAdjacent(gameState)
    console.log('adjacent = ' + JSON.stringify(adjacent))
    console.log('i am headed toward a ' + adjacent[move].what)

    if ( adjacent[move].what !== 'empty' && adjacent[move].what !== 'food' && adjacent[move].what !== 'my-tail' ) {
      console.log('uh oh... headed toward a ' + adjacent[move].what)

      let redirect = false

      moves.forEach((dir) => {
        if ( adjacent[dir].what === 'empty' || adjacent[dir].what === 'food' || adjacent[dir].what === 'my-tail' ) {
          redirect = dir
        }
      })

      if (redirect) {
        console.log(`redirecting ${redirect}`)
        move = redirect
      } else {
        console.log('checkmate :(')
      }
    }

  } catch (err) {

    console.error('dontDie: err = ', err)
    move = getRandomMove()

  }

  return move

}

/*
 * Return what is in adjacent squares
 */
function getAdjacent (gameState) {
  let adjacent = {
    down: { what: 'empty' },
    left: { what: 'empty' },
    right: { what: 'empty' },
    up: { what: 'empty' },
  }

  try {
    let pos = {
      x: gameState.you.body[0].x,
      y: gameState.you.body[0].y
    }

    let map = getBoardMap(gameState)

    // get item to left of your head
    if (pos.x === 0) {
      adjacent.left = {
        what: 'wall'
      }
    } else {
      adjacent.left = map[pos.x - 1][pos.y]
    }

    // get item to right of your head
    if (pos.x === gameState.board.width - 1) {
      adjacent.right = {
        what: 'wall'
      }
    } else {
      adjacent.right = map[pos.x + 1][pos.y]
    }

    // get item above your head
    if (pos.y === 0) {
      adjacent.up = {
        what: 'wall'
      }
    } else {
      adjacent.up = map[pos.x][pos.y - 1]
    }

    // get item to top of your head
    if (pos.y === gameState.board.height - 1) {
      adjacent.down = {
        what: 'wall'
      }
    } else {
      adjacent.down = map[pos.x][pos.y + 1]
    }
  } catch (err) {
    console.error('getAdjacent: error = ', err)
  }

  return adjacent
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
        if (gameState.turn === 0 || i === 0) {
          what = 'head'
        } else if ((gameState.turn === 1 && i > 0 && i < 3) || i === snake.body.length - 1) {
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
      if (gameState.turn === 0 || i === 0) {
        what = 'my-head'
      } else if ((gameState.turn === 1 && i > 0 && i < 3) || i === gameState.you.body.length - 1) {
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

function getRandomMove () {
  let moves = ['up','right','down','left'];
  return moves[Math.floor(Math.random() * moves.length)];
}

module.exports = {
  moves,
  dontDie,
  getAdjacent,
  getBoardMap,
  getRandomMove,
}
