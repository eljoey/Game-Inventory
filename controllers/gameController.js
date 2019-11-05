const Game = require('../models/game')
const Publisher = require('../models/publisher')
const Genre = require('../models/genre')

const aync = require('async')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

exports.game_create_get = function(req, res, next) {
  res.send('game create GET')
}
exports.game_create_post = function(req, res, next) {
  res.send('game create POST')
}
exports.game_delete_get = function(req, res, next) {
  res.send('game delete GET')
}
exports.game_delete_post = function(req, res, next) {
  res.send('game delete POST')
}
exports.game_update_get = function(req, res, next) {
  res.send('game update GET')
}
exports.game_update_post = function(req, res, next) {
  res.send('game update POST')
}
exports.game_detail = function(req, res, next) {
  Game.findById(req.params.id)
    .populate('genre')
    .populate('publisher')
    .exec((err, game_info) => {
      if (err) {
        return next(err)
      }

      if (game_info === null) {
        const err = new Error('Game not found')
        err.status = 404
        return next(err)
      }

      res.render('game_detail', { title: 'Game Detail', game_info: game_info })
    })
}
exports.game_list = function(req, res, next) {
  Game.find({})
    .populate('genre')
    .populate('publisher')
    .exec((err, list_games) => {
      if (err) {
        return next(err)
      }

      res.render('game_list', { title: 'Game List', game_list: list_games })
    })
}
