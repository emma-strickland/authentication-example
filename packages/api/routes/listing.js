module.exports = (app) => {
  app.get('/bobler', (req, res) => {
    res.send('Hello World!')
  })
}