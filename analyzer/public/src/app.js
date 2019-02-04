const board = require('./js/board.js')

var analyzerData;

fetch('http://localhost:5000/analyze', { mode: "no-cors" })
  .then((response) => {
    console.log("response = ", response)
    return response.json()
  })
  .then((data) => {
    console.log("data = " + JSON.stringify(data))
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
      },
      created: function () {
        window.addEventListener('keyup', this.handleKeyPress)
      },
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
