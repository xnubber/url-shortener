// express
const express = require('express')
const app = express()
const port = 3000

// express handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({defaultLayout: 'main', extname:'.hbs'}))
app.set('view engine', 'hbs')

// mongoose
require('./config/mongoose')
const UrlShortener = require('./models/url-shortener')

// tools
app.use(express.urlencoded({extended: true}))
const nanoid = require('./helpers/randomId')


// routes
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {
  const shortenId = nanoid()
  const originUrl = req.body
  originUrl.shorten_id = shortenId
  console.log(originUrl)
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})