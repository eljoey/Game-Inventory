const Game = require('../models/game')
const Publisher = require('../models/publisher')
const Genre = require('../models/genre')

const async = require('async')
const { body, validationResult, sanitizeBody } = require('express-validator')

exports.game_create_get = function(req, res, next) {
  async.parallel(
    {
      publishers: callback => {
        Publisher.find(callback)
      },
      genres: callback => {
        Genre.find(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      res.render('game_form', {
        title: 'Create Game',
        publishers: results.publishers,
        genres: results.genres
      })
    }
  )
}
exports.game_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = []
      else req.body.genre = new Array(req.body.genre)
    }
    next()
  },

  // Validate
  body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('publisher', 'Publisher must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('released', 'Released must not be empty').isISO8601(),
  body('stock', 'Stock must not be empty')
    .trim()
    .isNumeric()
    .withMessage('Stock has non-numeric characters'),
  body('price', 'Price ')
    .trim()
    .isNumeric()
    .withMessage('Price has non-numeric characters'),

  // Sanitize
  sanitizeBody('genre.*').escape(),
  sanitizeBody('title').escape(),
  sanitizeBody('publisher').escape(),
  sanitizeBody('released').toDate(),
  sanitizeBody('stock').escape(),
  sanitizeBody('price').escape(),

  // Process

  (req, res, next) => {
    const errors = validationResult(req)

    //enter date as utc
    const dateToFormat = req.body.released
    const released = new Date(
      dateToFormat.getTime() - dateToFormat.getTimezoneOffset() * -60000
    )

    let game = new Game({
      title: req.body.title,
      publisher: req.body.publisher,
      genre: req.body.genre,
      released: released,
      stock: req.body.stock,
      price: req.body.price
    })

    if (!errors.isEmpty()) {
      // Render form again if errors
      async.parallel(
        {
          publishers: callback => {
            Publisher.find(callback)
          },
          genres: callback => {
            Genre.find(callback)
          }
        },
        (err, results) => {
          if (err) {
            return next(err)
          }

          // Mark genres as checked
          for (let i = 0; i < results.genres.length; i++) {
            if (game.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true'
            }
          }

          res.render('game_form', {
            title: 'Create Game',
            publishers: results.publishers,
            genres: results.genres,
            game: game,
            errors: errors.array()
          })
        }
      )
      return
    } else {
      // Form data is valid. Save Game
      game.save(err => {
        res.redirect(game.url)
      })
    }
  }
]

exports.game_delete_get = function(req, res, next) {
  Game.findById(req.params.id)
    .populate('publisher')
    .populate('genre')
    .exec((err, gamefound) => {
      if (err) {
        return next(err)
      }

      res.render('game_delete', {
        title: 'Delete Game',
        game: gamefound
      })
    })
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
      res.render('game_detail', {
        title: 'Game Detail',
        game_info: game_info
      })
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
