const { insertGuitars, getAllGuitars } = require('../controllers/guitar')

const guitarsRouter = require('express').Router()

guitarsRouter.post('/setguitars', insertGuitars)
guitarsRouter.get('/', getAllGuitars)

module.exports = guitarsRouter
