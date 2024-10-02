const mongoose = require('mongoose')

const guitarSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: false },
    stock: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'guitars'
  }
)

const Guitar = mongoose.model('guitars', guitarSchema, 'guitars')
module.exports = Guitar
