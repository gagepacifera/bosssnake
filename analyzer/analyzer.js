const express = require('express')

let history = []

function init(app) {
  try {
    // return game state history in json format
    app.get('/analyze', (request, response) => {
      response.set({ 'Access-Control-Allow-Origin': '*' })
      return response.json( {history: history} )
    })
    // serve analyzer page
    app.use('/analyzer', express.static('analyzer/public'))
  } catch (err) {
    console.error('init: err = ', err)
  }
}

function record(gameState) {
  try {
    history.push(gameState)
  } catch (err) {
    console.error('record: err = ', err)
  }
  return
}

function reset(gameState) {
  try {
    history = []
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
