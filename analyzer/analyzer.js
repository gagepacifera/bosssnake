const express = require('express')

let games = []
let currGameId = ''

function init(app) {
  try {
    // return game state history in json format
    app.get('/analyze', (request, response) => {
      response.set({
        'Access-Control-Allow-Origin': '*'
      })
      return response.json( {games:games} )
    })
    // serve analyzer page
    app.use('/analyzer', express.static('analyzer/public'))
  } catch (err) {
    console.error('init: err = ', err)
  }
}

function record(gameState) {
  try {
    // if games is empty, or if new game, add new game object
    if (games.length === 0 || gameState.game.id !== currGameId) {
      games.unshift({
        date: new Date(),
        gameId: gameState.game.id,
        history: [],
      })
      currGameId = gameState.game.id
    }

    // push history to latest game
    games[0].history.push(gameState)
  } catch (err) {
    console.error('record: err = ', err)
  }
  return
}

function reset(gameState) {
  try {
    games = []
  } catch (err) {
    console.error('reset: err = ', err)
  }
  return
}

module.exports = {
  init,
  record,
  reset,
}
