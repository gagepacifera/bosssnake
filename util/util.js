// return what is in adjacent squares
function adjacent (data) {
  // console.log('adjacent start')

  let pos = {
    x: data.you.body[0].x,
    y: data.you.body[0].y
  }
  console.log(`adjacent: you are at ${pos.x}, ${pos.y}`)

  let map = getBoardMap(data)
  // console.log(`adjacent: map = ` + map)

  return {
    down: 'unknown',
    left: 'unknown',
    right: 'unknown',
    up: 'unknown'
  }
}

function getBoardMap (data) {
  console.log('start board map')
  // create blank map
  let map = []
  // console.log('start board map 2')
  for (let x = 0; x < data.board.width; x++) {
  // let x = 0;
  // while (x < data.board.width) {
    // console.log(`make board map: x = ${x}`)
    map.push([])

    for (let y = 0; y < data.board.height; y++) {
      // console.log(`make board map: x = ${x}, y = ${y}`)
      map[x].push(null)
    }
  }

  // add snakes to map
  for (let i = 0; i < data.board.snakes.length; i++) {
    console.log('snake = ', data.board.snakes[i])
    for (let j = 0; j < data.board.snakes[i].body.length; j++) {
      let what;
      if (j === 0) {
        what = 'head'
      } else if (j === data.board.snakes[i].body.length - 1) {
        what = 'tail'
      } else {
        what = 'body'
      }
      console.log('what = ' + what)
      map[data.board.snakes[i].body[j].x][data.board.snakes[i].body[j].y] = {
        snake: data.board.snakes[i],
        what: what
      }
    }
  }

  // // add you to map
  // for (let i = 0; i < data.board.you.body.length; i++) {
  //   let what;
  //   if (i === 0) {
  //     what = 'head'
  //   } else if (i === data.board.you.body.length - 1) {
  //     what = 'tail'
  //   } else {
  //     what = 'body'
  //   }
  //   console.log('what = ' + what)
  //   map[data.board.you.body[i].x][data.board.you.body[i].y] = {
  //     snake: data.board.you,
  //     what: what
  //   }
  // }

  console.log('getBoardMap finish')

  return map
}

module.exports = {
  adjacent,
  getBoardMap
}
