// express
const express = require('express')
const router = express.Router()

// models
const UrlShortener = require('../../models/url-shortener')

// tools
const nanoid = require('../../helpers/randomId')
const catchAsync = require('../../helpers/catchAsync')
const ExpressError = require('../../helpers/ExpressError')
const got = require('got')

// index page
router.get('/', (req, res) => {
  res.render('index')
})

// check and create
router.post('/', catchAsync(async(req, res, next) => {
  const host = req.headers.host
  let {origin_url} = req.body
  const url = new URL(origin_url)
  try {
    // check original url domain name valid or not
    const response = await got(url.origin)
    //check original url existed in DB or not
    let counter = 10;
    while (counter) {
      try {
        // check or create
        let existUrl = await UrlShortener.findOne({ origin_url }).lean()
        let shorten_id = Math.floor(Math.random() * 5)
        const shorten_url = host + '/' + shorten_id
        existUrl ? existUrl : await UrlShortener.create({ origin_url, shorten_id, shorten_url })
        renderUrl = existUrl || Object.assign(req.body, { shorten_url: shorten_url, shorten_id: shorten_id })
        
        res.render('shorten', { renderUrl })
        counter = 0
      } catch (err) {
        // nanoid()
        // duplicate key, retry, max 10 times
        if (err.code === 11000) {
          counter-- 
          if (counter === 0) {
            throw new ExpressError('Server error', 501)
          }
        } else {
          throw new ExpressError('Server error', 500)
        }
      }
    }
  } catch(err) {
    throw new ExpressError(`${err}`, err.statusCode || 404)
  } 
}))

// redirect shorten url
router.get('/:shorten_id', catchAsync(async (req, res, next) => {
  const shorten_id = req.params
  const checkExist = await UrlShortener.findOne(shorten_id).lean()
  if (checkExist) {
    res.redirect(`${checkExist.origin_url}`)
  } else {
    throw new ExpressError('Uh oh. We could not find a link at that URL', 404)
  }
}))

module.exports = router