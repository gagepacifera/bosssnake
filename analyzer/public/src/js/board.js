/*
 * Return board markup
 */
function display (gameState) {
  try {

    let map = getBoardMap(gameState)

    var html = ``
    html += `<div id="board" class="board">`

    let x = 0;
    let y = 0;
    while( y < map[0].length ) {
      html += `<div class="tile x-${x} y-${y} ${map[x][y].what}"><!-- ${map[x][y].what} --></div>`
      if ( x == gameState.board.width - 1) {
        x = 0
        y++
      } else {
        x++
      }
    }

    html += `</div>`

    // write variable board styles
    html += `<style>
      #board {
        grid-template-columns: repeat(${gameState.board.width}, 1fr);
        grid-template-rows: repeat(${gameState.board.height}, 1fr);
      }
    </style>`

    return html

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

module.exports = {
  display,
  getBoardMap,
}
