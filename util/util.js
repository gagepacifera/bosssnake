/*
 * Choose alternate move if your snake will die
 */
function dontDie (gameState, move) {
  console.log('dont die! move = ' + move + ', gameState = ' + JSON.stringify(gameState))
  let adjacent = getAdjacent(gameState)
  console.log('adjacent = ' + JSON.stringify(adjacent))
  console.log('i am headed toward a ' + adjacent[move])

  // if current move isn't set or will result in death, pick a better one (if possible)
  if (!move || move === undefined || (adjacent[move] && adjacent[move].hasOwnProperty('what') && (adjacent[move].what === 'wall' || adjacent[move].what === 'head' || adjacent[move].what === 'body' || adjacent[move].what === 'my-body'))) {
    console.log('uh oh... headed toward a ' + adjacent[move].what)
    let myMove

    if (!adjacent.up || adjacent.up === 'food') {
      myMove = 'up'
    } else if (!adjacent.right || adjacent.right === 'food') {
      myMove = 'right'
    } else if (!adjacent.down || adjacent.down === 'food') {
      myMove = 'down'
    } else if (!adjacent.left || adjacent.left === 'food') {
      myMove = 'left'
    } else {
      console.log('checkmate :(')
      myMove = 'up'
    }

    console.log(`redirecting ${myMove}`)
    return myMove
  }

  console.log('whew, not gonna die! headed ' + move + ' toward a space with ' + adjacent[move])

  return move
}

/*
 * Return what is in adjacent squares
 */
function getAdjacent (gameState) {
  // console.log('adjacent start')
  let adjacent = {
    down: null,
    left: null,
    right: null,
    up: null
  }

  let pos = {
    x: gameState.you.body[0].x,
    y: gameState.you.body[0].y
  }
  // console.log(`adjacent: your head is at ${pos.x}, ${pos.y}`)

  let map = getBoardMap(gameState)
  // console.log(`adjacent: map = ` + JSON.stringify(map))

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

  return adjacent
}

/*
 * Return game board elements in two dimensional array
 */
function getBoardMap (gameState) {
  // create blank map
  let map = []
  for (let x = 0; x < gameState.board.width; x++) {
    map.push([])
    for (let y = 0; y < gameState.board.height; y++) {
      map[x].push(null)
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
}

module.exports = {
  dontDie,
  getAdjacent,
  getBoardMap
}
