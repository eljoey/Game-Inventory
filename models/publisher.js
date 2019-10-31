const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PublisherSchema = new Schema({
  name: { type: String, required: true, min: 2, max: 100 }
})

// URL virtual
PublisherSchema.virtual('url').get(function() {
  return '/publisher/' + this.id
})

// Export model
module.exports = mongoose.model('Publisher', PublisherSchema)
