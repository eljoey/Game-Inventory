const Publisher = require('../models/publisher')
const Game = require('../models/game')
const async = require('async')
const { body, validationResult, sanitizeBody } = require('express-validator')

exports.publisher_list = function(req, res, next) {
  Publisher.find()
    .sort('name')
    .exec((err, publishers) => {
      if (err) {
        return next(err)
      }

      res.render('publisher_list', {
        title: 'Publisher List',
        publishers: publishers
      })
    })
}

exports.publisher_detail = function(req, res, next) {
  async.parallel(
    {
      publisher: callback => {
        Publisher.findById(req.params.id).exec(callback)
      },
      publisher_games: callback => {
        Game.find({ publisher: req.params.id }).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.publisher === null) {
        const err = new Error('Publisher not found')
        err.status = 404
        return next(err)
      }

      res.render('publisher_detail', {
        title: 'Publisher Detail',
        publisher: results.publisher,
        publisher_games: results.publisher_games
      })
    }
  )
}

exports.publisher_create_get = function(req, res, next) {
  res.send('Publisher Create-GET: TODO')
}

exports.publisher_create_post = function(req, res, next) {
  res.send('Publisher Create-POST: TODO')
}

exports.publisher_delete_get = function(req, res, next) {
  res.send('Publisher Delete-GET:')
}

exports.publisher_delete_post = function(req, res, next) {
  res.send('Publisher Delete-POST: TODO')
}

exports.publisher_update_get = function(req, res, next) {
  res.send('Publisher Update-GET: TODO')
}

exports.publisher_update_post = function(req, res, next) {
  res.send('Publisher Update-POST: TODO')
}
