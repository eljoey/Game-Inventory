const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const GameSchema = new Schema({
  title: { type: String, required: true, min: 2, max: 100 },
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher', required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
  released: { type: Date, default: Date.now },
  stock: { type: Number, default: 1 },
  price: { type: Number, required: true }
})

// URL virtual
GameSchema.virtual('url').get(function() {
  return '/game/' + this._id
})

// YYYY MM DD Date virtual
GameSchema.virtual('date_formatted').get(function() {
  return moment(this.released).format('YYYY-MM-DD')
})

// Export model
module.exports = mongoose.model('Game', GameSchema)
