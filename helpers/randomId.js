function sample(str) {
  let randIndex = Math.floor(Math.random() * str.length)
  return str[randIndex]
}

function generateShort() {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = lowerCase.toUpperCase()
  const num = '0123456789'
  const collection = lowerCase + upperCase + num
  let shorten_id = ''
  for (let i = 0; i < 5; i++) {
    shorten_id += sample(collection)
  }
  return shorten_id
}


module.exports = generateShort