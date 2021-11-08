const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/url-shortener')

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})