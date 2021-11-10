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
  let originUrl = req.body
  const url = new URL(originUrl.origin_url)
  try {
    // check original url domain name valid or not
    const response = await got(url.origin)
    //check original url existed in DB or not
    try {
      let existUrl = await UrlShortener.findOne({ origin_url: originUrl.origin_url }).lean()
      if (!existUrl) {
        let shortenId = nanoid()

        // check shorten_id existed in DB or not
        let existId = await UrlShortener.findOne({ shorten_id: shortenId }).lean()
        while (existId) {
          shortenId = nanoid()
          existId = await UrlShortener.findOne({ shorten_id: shortenId }).lean()
        }

        // if original url & shorten_id not exist then create
        const shorten_url = host + '/' + shortenId
        originUrl.shorten_url = shorten_url
        originUrl.shorten_id = shortenId
        const newUrl = new UrlShortener(originUrl)
        await newUrl.save()
      } else {
        originUrl = existUrl
      }
    } catch(err) {
      throw new ExpressError('Server error', 500)
    }
   
    res.render('shorten', { originUrl })
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