const express = require('express')
const router = express.Router()
const UrlShortener = require('../../models/url-shortener')

const nanoid = require('../../helpers/randomId')
const dns = require('dns')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', async (req, res, next) => {
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

router.get('/:shorten_id', async (req, res, next) => {
  const shorten_id = req.params
  const checkExist = await UrlShortener.findOne(shorten_id).lean()
  if (checkExist) {
    res.redirect(`${checkExist.origin_url}`)
  } else {
    res.send('Page cannot Found')
  }
})

module.exports = router