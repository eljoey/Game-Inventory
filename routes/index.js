const Game = require('../models/game')
const Publisher = require('../models/publisher')
const Genre = require('../models/genre')

const express = require('express')
const router = express.Router()

const async = require('async')

/* GET home page. */
router.get('/', function(req, res, next) {
  async.parallel(
    {
      game_count: callback => {
        Game.countDocuments({}, callback)
      },
      publisher_count: callback => {
        Publisher.countDocuments({}, callback)
      },
      genre_count: callback => {
        Genre.countDocuments({}, callback)
      }
    },
    (err, results) => {
      res.render('index', {
        title: 'Game Store Home',
        error: err,
        data: results
      })
    }
  )
})

module.exports = router
