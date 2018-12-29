// var app = new Vue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!'
//   }
// })

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
      }
    })
  })
  .catch((err) => {
    console.error('fetch failed: err = ', err)
  })

Vue.filter('formatTime', function(date) {
  if (date) {
    console.log('date = ', date)
    return new Date(date).toLocaleTimeString(navigator.language, {hour:'2-digit', minute:'2-digit', second:'2-digit'})
  }
})
