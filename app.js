// express
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// express handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// mongoose
require('./config/mongoose')

// tools
app.use(express.urlencoded({ extended: true }))
const errorHandler = require('./helpers/errorHandler')
app.use(express.static('public'))

// router
const routes = require('./routes')
app.use(routes)

// error handler
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})