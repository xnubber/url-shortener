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



// router
const routes = require('./routes')
app.use(routes)




app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})