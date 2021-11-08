const { customAlphabet } = require('nanoid')
const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
const upperCase = lowerCase.toUpperCase()
const num = '0123456789'
const collection = lowerCase + upperCase + num

const nanoid = customAlphabet(collection, 5)

module.exports = nanoid
