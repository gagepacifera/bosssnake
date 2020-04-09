const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const util = require('./util/util.js')

const modeCircles = require('./mode/circles.js')
const modeFindFood = require('./mode/find-food.js')


// const reactions = require('./reactions/reactions.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9007))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// analyzer
const analyzer = require('./analyzer/analyzer.js')
analyzer.init(app)

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#00ffaa'
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  let gameState = request.body

  analyzer.record(gameState)

  // update snarky reactions
  // reactions.update(request)

  // set mode and process
  let mode
  if (gameState.you.health > 80) {
    mode = modeCircles
  } else {
    mode = modeFindFood
  }
  // console.log(`mode = ${mode.which}`)
  try {
    if (gameState.turn%2 == 0) {
      analyzer.log(`mode = ${mode.which}`)
      analyzer.log(`health = ${gameState.you.health}`)
      analyzer.dir(gameState.you.body)
    }
  } catch (err) {
    console.error('analyzer log: error: ', err)
  }

  console.log('mode = ', mode.which)
  let move = mode.process(request)
  // console.log('post mode move = ', move)

  // Don't die!!
  // console.log( "adjacent = " + JSON.stringify(util.getAdjacent(gameState)) )
  move = util.dontDie(gameState, move)
  // console.log('post dont die move = ', move)

  // Response data
  const snakeResponse = {
    move: move // one of: ['up','down','left','right']
  }

  console.log('snake response = ', snakeResponse)

  return response.json(snakeResponse)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({})
})

// // return reactions
// app.get('/react', (request, response) => {
//   response.set({ 'Access-Control-Allow-Origin': '*' })
//   return response.json(reactions.get())
// })

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
