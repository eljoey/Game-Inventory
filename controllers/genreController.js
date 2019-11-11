const Genre = require('../models/genre')
const Game = require('../models/game')
const async = require('async')
const validator = require('express-validator')

const { body, validationResult, sanitizeBody } = require('express-validator')

exports.genre_list = function(req, res) {
  Genre.find()
    .sort('name')
    .exec(function(err, list_genres) {
      if (err) {
        return next(err)
      }

      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genres
      })
    })
}
exports.genre_detail = function(req, res) {
  res.send('Single Genre - TODO')
}
exports.genre_create_get = function(req, res) {
  res.send('Create Genre GET - TODO')
}
exports.genre_create_post = function(req, res) {
  res.send('Create Genre POST - TODO')
}
exports.genre_delete_get = function(req, res) {
  res.send('Delete Genre GET - TODO')
}
exports.genre_delete_post = function(req, res) {
  res.send('Delete Genre POST - TODO')
}
exports.genre_update_get = function(req, res) {
  res.send('Update Genre GET - TODO')
}
exports.genre_update_post = function(req, res) {
  res.send('Update Genre POST - TODO')
}
