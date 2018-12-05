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

const request = require('request')
const http = require('http')
const querystring = require('querystring')

const modeCircles = require('./mode/circles.js')
const modeFindFood = require('./mode/find-food.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)


// --- SNAKE LOGIC GOES BELOW THIS LINE ---

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

  // // pass along request to reaction app
  // // https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
  // function passRequest (postData) {
  //   console.log('passing request start')
  //   var clientServerOptions = {
  //     uri: 'http://localhost:9002/react',
  //     body: JSON.stringify(postData),
  //     body: postData,
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     json: true
  //   }
  //   console.log('passing request')
  //   request(clientServerOptions, function (error, response) {
  //     //console.log(error, response.body)
  //     console.log('anything at all')
  //   })
  //   console.log('passing request end')
  // }
  // passRequest(request)


  // var options = {
  //   // host: 'www.google.com',
  //   // path: '/index.html',
  //   host: 'localhost:9002',
  //   path: '/react'
  // };
  //
  // // var req = http.get(options, function(res) {
  // var req = http.post(options, function(res) {
  //   console.log('STATUS: ' + res.statusCode);
  //   console.log('HEADERS: ' + JSON.stringify(res.headers));
  //
  //   // Buffer the body entirely for processing as a whole.
  //   var bodyChunks = [];
  //   res.on('data', function(chunk) {
  //     // You can process streamed parts here...
  //     bodyChunks.push(chunk);
  //   }).on('end', function() {
  //     var body = Buffer.concat(bodyChunks);
  //     console.log('BODY: ' + body);
  //     // ...and/or process the entire body here.
  //   })
  // });
  //
  // req.on('error', function(e) {
  //   console.log('ERROR: ' + e.message);
  // });

  // console.log('let\'s do it!')
  // request.post(
  //     'http://localhost:9002/move',
  //     { json: { key: 'value' } },
  //     function (error, response, body) {
  //         if (!error && response.statusCode == 200) {
  //           console.log(body)
  //         } else {
  //           console.log('something went wrong')
  //         }
  //     }
  // );

  // function PostCode(codestring) {
  //   // console.log("codestring = ", codestring)
  //   // Build the post string from an object
  //   // var post_data = querystring.stringify({
  //   //     'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
  //   //     'output_format': 'json',
  //   //     'output_info': 'compiled_code',
  //   //     'warning_level' : 'QUIET',
  //   //     // 'js_code' : JSON.stringify(codestring)
  //   //     'js_code' : {'message': 'bosssnake is here'},
  //   // })
  //   var post_data = querystring.stringify({
  //       'message' : 'yo',
  //   })
  //   // var post_data = JSON.stringify({
  //   //     'message' : 'yo',
  //   // })
  //
  //   console.log("post data = ", post_data)
  //
  //   // An object of options to indicate where to post to
  //   // var post_options = {
  //   //     host: 'closure-compiler.appspot.com',
  //   //     port: '80',
  //   //     path: '/compile',
  //   //     method: 'POST',
  //   //     headers: {
  //   //         'Content-Type': 'application/x-www-form-urlencoded',
  //   //         'Content-Length': Buffer.byteLength(post_data)
  //   //     }
  //   // };
  //   var post_options = {
  //       host: 'localhost',
  //       port: '9002',
  //       path: '/move',
  //       method: 'POST',
  //       headers: {
  //           // 'Content-Type': 'application/json',
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           'Content-Length': Buffer.byteLength(post_data)
  //       }
  //   }
  //
  //   // Set up the request
  //   var post_req = http.request(post_options, function(res) {
  //       res.setEncoding('utf8')
  //       res.on('data', function (chunk) {
  //           console.log('Response: ' + chunk)
  //       });
  //   })
  //
  //   // post the data
  //   post_req.write(post_data)
  //   post_req.end()
  //
  // }
  // PostCode(request.body)

  // request(
  //   {
  //     url: 'http://localhost:9002/move',
  //     method: "POST",
  //     json: JSON.stringify({'message':'yo'}),
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   },
  //   function (error, response, body) {
  //     if (!error && response.statusCode === 200) {
  //         console.log("body = " + body)
  //     }
  //     else {
  //         console.log("error: " + error)
  //         console.log("response.statusCode: " + response.statusCode)
  //         console.log("response.statusText: " + response.statusText)
  //     }
  //   }
  // )

  // set mode and process
  let mode
  if (request.body.you.health > 30) {
    mode = modeCircles
  } else {
    mode = modeFindFood
  }
  console.log(`mode = ${mode.which}`)

  // console.log('mode = ', mode)
  let move = mode.process(request)

  // console.log('move = ', move)

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


// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
