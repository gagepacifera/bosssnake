/*
 * Return board markup
 */
function display (gameState, overlay) {
  try {

    // write board map

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

    // write overlay
    console.log('board.display: overlay = ')
    console.dir(JSON.parse(JSON.stringify(overlay)));

    if (overlay && overlay.length) {
      for (var i=0; i<overlay.length; i++) {
        // console.log('this overlay is')
        // console.dir(JSON.parse(JSON.stringify(overlay[i])))
        let typeClass = ""

        if (overlay[i].hasOwnProperty('type') && overlay[i].type === 'heatmap') {
          typeClass += " heatmap"

          if (overlay[i].hasOwnProperty('color')) {
            html += `<style>.board.overlay-${i} figure { background-color: ${overlay[i].color}; }</style>`
          }

        }

        html += `<div class="board overlay overlay-${i}${typeClass}">`

        let x = 0;
        let y = 0;
        while( y < map[0].length ) {
          // console.log(`x = ${x}, y = ${y}, entry = ${overlay[i].value[x][y]}`)
          let tileContent = ""
          let tileHeatmapHtml = ""
          if (overlay[i].value[x][y]) {
            tileContent = overlay[i].value[x][y]
          }

          if (overlay[i].hasOwnProperty('type') && overlay[i].type === 'heatmap') {
            let tileOpacity = 0
            if (!overlay[i].value[x][y]) {
              tileOpacity = 0
            } else if (!isNaN(overlay[i].value[x][y]) && overlay[i].value[x][y] > 1) {
              tileOpacity = 1
            } else if (!isNaN(overlay[i].value[x][y]) && overlay[i].value[x][y] < 0) {
              tileOpacity = 0
            } else if (!isNaN(overlay[i].value[x][y])) {
              tileOpacity = parseFloat((overlay[i].value[x][y] * 0.9).toFixed(4)).toString().replace(/^0+/, '')
            }
            tileHeatmapHtml = `<figure style="opacity:${tileOpacity}"></figure>`
            tileContent = tileOpacity
          }
          html += `<div class="tile x-${x} y-${y}" title="${tileContent}">${tileHeatmapHtml}<span>${tileContent}</span></div>`
          if ( x == gameState.board.width - 1) {
            x = 0
            y++
          } else {
            x++
          }
        }

        html += `</div>`
      }
    }

    // write variable board styles
    html += `<style>
      .board {
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
