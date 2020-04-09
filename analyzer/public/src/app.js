import Vue from '../node_modules/vue/dist/vue.js'

const board = require('./js/board.js')

var analyzerData;

fetch('http://localhost:5000/analyze', { mode: "no-cors" })
  .then((response) => {
    // console.log("response = ", response)
    return response.json()
  })
  .then((data) => {
    // console.log("data = " + JSON.stringify(data))
    // console.log("data = ", data)
    analyzerData = new Vue({
      el: '#wrapper',
      data: {
        currGame: 0,
        currTurn: 0,
        games: data.games
      },
      methods: {
        handleKeyPress(e) {
          const keyCode = String(e.keyCode || e.code || e.keyIdentifier)
          if (keyCode == 37) { // left arrow
            if (analyzerData.currTurn > 0) {
              analyzerData.currTurn--
            }
          } else if (keyCode == 39) { // right arrow
            if (analyzerData.currTurn < analyzerData.games[analyzerData.currGame].history.length - 1) {
              analyzerData.currTurn++
            }
          }
        },
        consoleDir(state) {
          console.dir(JSON.parse(JSON.stringify(state)))
        }
      },
      created: function () {
        window.addEventListener('keyup', this.handleKeyPress)
      },
      computed: {
        displayConsole: function() {
          console.log('displayConsole')
          try {
            if (analyzerData && analyzerData.hasOwnProperty('games') && analyzerData.games) {
              // console.log('we have analyzerData and games')
              // console.log(analyzerData.games[analyzerData.currGame].log[analyzerData.currTurn][0])
              var logs = analyzerData.games[analyzerData.currGame].log[analyzerData.currTurn];
              var dirs = analyzerData.games[analyzerData.currGame].dir[analyzerData.currTurn];
              // if (logs){
              //   logs.forEach((l) => {
              //     console.log(l)
              //   })
              // }
              // if (dirs){
              //   console.log('dir found!')
              //   dirs.forEach((d) => {
              //     console.log(d)
              //     console.dir(d)
              //   })
              // }
            //    // this.displayConsoleMessages()
            //    // return `${this.currTurn}`
            //    return analyzerData.games[analyzerData.currGame].log[analyzerData.currTurn]
            }
             // else {
             //   console.log('displayConsole: analyzerData = ', analyzerData)
             //   return `${this.currTurn}`
             // }
          } catch (err) {
           console.error('displayConsole: err = ', err, 'analyzerData = ', analyzerData)
          }
        }
      },
      // watch: {
      //   displayConsole: function(logsArr) {
      //     try {
      //       console.log(logsArr[0])
      //     } catch (err) {
      //       console.error('watch->displayConsole: err = ', err)
      //     }
      //   }
      // }
      watch: {
        currTurn: function() {
          try {
            // console.log(analyzerData.games[analyzerData.currGame].log[analyzerData.currTurn][0])
            return `${this.currTurn}`
          } catch (err) {
            console.error('watch->displayConsole: err = ', err)
          }
        }
      }
    })
  })
  .catch((err) => {
    console.error('fetch failed: err = ', err)
  })

Vue.filter('formatTime', function(date) {
  if (date) {
    return new Date(date).toLocaleTimeString(navigator.language, {hour:'2-digit', minute:'2-digit', second:'2-digit'})
  }
})

Vue.component('board', {
  render: function (createElement) {
    return createElement(
      'div',
      {
        domProps: {
          innerHTML: board.display(this.state)
        }
      }
    )
  },
  props: {
    state: {
      type: Object,
      required: true
    }
  }
})
