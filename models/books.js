const { Schema, model } = require('mongoose')

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  img:{
    type: String,
    required:true,
    default:"https://tataev-market.ru/local/templates/tataev-market/assets/images/products/empty-product-img.jpg"
  },
  genre:{
    type: String,
    required:true,
    default:"Боевик"
  },
  raiting: {
    type:Number,
    default: 0
  }

})

module.exports = model('book', bookSchema)