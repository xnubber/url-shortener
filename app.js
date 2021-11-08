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

// routes
app.get('/', (req, res) => {
  console.log(window.location.hostname)
  res.render('index')
})

app.post('/', async (req, res) => {
  const newShortUrl = new UrlShortener(req.body)
  await newShortUrl.save()
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})