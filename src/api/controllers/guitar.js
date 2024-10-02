const Guitar = require('../models/guitar')
const guitars = require('../../../guitars.json')

const insertGuitars = async (req, res, next) => {
  try {
    await Guitar.insertMany(guitars.results)
    return res.status(201).json('Todos los sets de guitarras subidos a la BBDD')
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}

const getAllGuitars = async (req, res, next) => {
  try {
    const allGuitars = await Guitar.find()
    return res.status(200).json(allGuitars)
  } catch (error) {
    return res.status(400).json(error)
  }
}

module.exports = {
  insertGuitars,
  getAllGuitars
}
