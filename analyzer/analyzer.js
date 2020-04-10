const express = require('express')

let games = []
let currGameId = ''
let lastRecordedGameState = false

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

function getGameIndex(gameId) {
  try {
    let gameIndex = false
    games.forEach((game, i) => {
      if (game.gameId === gameId) {
        gameIndex = i
      }
    })
    return gameIndex
  } catch (err) {
    console.log(`gameState: error: ${err}`)
    return false
  }
}

function log(str, gameState = lastRecordedGameState) {
  try {
    if (gameState) {
      let gameIndex = getGameIndex(gameState.game.id)
      games[gameIndex].log[gameState.turn].push(str)
    }
  } catch (err) {
    console.error('log: err = ', err, 'gameState = ', gameState)
  }
}

function dir(obj, gameState = lastRecordedGameState) {
  try {
    if (gameState) {
      let gameIndex = getGameIndex(gameState.game.id)
      games[gameIndex].dir[gameState.turn].push(obj)
    }
  } catch (err) {
    console.error('dir: err = ', err, 'gameState = ', gameState)
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
        log: [],
        dir: [],
      })
      currGameId = gameState.game.id
    }

    // push history to latest game
    games[0].history.push(gameState)
    games[0].log.push([])
    games[0].dir.push([])
    lastRecordedGameState = gameState
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
  dir,
  init,
  log,
  record,
  reset,
}
