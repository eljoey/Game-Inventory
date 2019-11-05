const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CartSchema = new Schema({
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
})

// URL virtual
CartSchema.virtual('url').get(function() {
  return '/shop/cart/' + this._id
})

// Total price on cart
CartSchema.virtual('total').get(function() {
  return this.games.map(game => game.price).reduce((acc, num) => acc + num, 0)
})
