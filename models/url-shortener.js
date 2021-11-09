const mongoose = require('mongoose')

const urlShortenerSchema = new mongoose.Schema({
  origin_url: {
    type: String,
    required: true,
  },
  shorten_url: {
    type: String,
    required: true,
  },
  shorten_id: {
    type: String,
    required: true
  },
  custom: {
    type: String,
  },
  password: {
    type: String,
  },
  QR_code: {
    type: String
  },
})

const UrlShortener = mongoose.model('UrlShortener', urlShortenerSchema)
module.exports = UrlShortener