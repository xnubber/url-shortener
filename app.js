// express
const express = require('express')
const app = express()
const port = 3000

// express handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// mongoose
require('./config/mongoose')
const UrlShortener = require('./models/url-shortener')

// tools
app.use(express.urlencoded({ extended: true }))
const nanoid = require('./helpers/randomId')
const dns = require('dns')


// routes
app.get('/', (req, res) => {

  res.render('index')
})

app.post('/', async (req, res) => {
  const host = req.headers.host
  let originUrl = req.body
  const url = new URL(originUrl.origin_url)
  dns.lookup(url.hostname, (err) => {
    if (err) {
      console.log(err)
    }
  })

  let existUrl = await UrlShortener.findOne({ origin_url: originUrl.origin_url }).lean()
  if (!existUrl) {
    let shortenId = nanoid()
    let existId = await UrlShortener.findOne({ shorten_id: shortenId }).lean()
    while (existId) {
      shortenId = nanoid()
      existId = await UrlShortener.findOne({ shorten_id: shortenId }).lean()
    }
    const shorten_url = host + '/' + shortenId
    originUrl.shorten_url = shorten_url
    originUrl.shorten_id = shortenId
    const newUrl = new UrlShortener(originUrl)
    await newUrl.save()
  } else {
    originUrl = existUrl
  }
  
  res.render('shorten', { originUrl })
})




app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})