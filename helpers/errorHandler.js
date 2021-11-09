const errorHandler = ((err, req, res, next) => {
  const { message, statusCode = 501 } = err
  res.status(statusCode).render('error', { err })
})

module.exports = errorHandler