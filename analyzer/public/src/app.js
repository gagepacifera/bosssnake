var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

fetch('http://localhost:5000/analyze', { mode: "no-cors" })
  .then((response) => {
    console.log("response = ", response)
    return response.json()
  })
  .then((data) => {
    console.log("data = " + JSON.stringify(data))
  })
  .catch((err) => {
    console.error('fetch failed: err = ', err)
  })
