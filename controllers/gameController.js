const Game = require('../models/game')
const Publisher = require('../models/publisher')
const Genre = require('../models/genre')

const fs = require('fs')

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
  body('price', 'Price must not be empty')
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
    console.log(errors)
    console.log(req.file)

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
      price: req.body.price,
      image: req.file ? req.file.filename : null
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
  Game.findById(req.body.gameid).exec((err, gameToDelete) => {
    if (err) {
      return next(err)
    }

    // If there is an image, delete image as well.
    if (gameToDelete.image != null) {
      fs.unlink('./public' + gameToDelete.image_file, err => {
        if (err) {
          return next(err)
        }
        console.log('./public' + gameToDelete.image_file + ' was deleted')
      })
    }

    Game.findByIdAndRemove(req.body.gameid, function deleteGame(err) {
      if (err) {
        return next(err)
      }

      res.redirect('/inventory/games')
    })
  })
}
exports.game_update_get = function(req, res, next) {
  async.parallel(
    {
      game: callback => {
        Game.findById(req.params.id)
          .populate('publisher')
          .populate('genre')
          .exec(callback)
      },
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

      if (results.game === null) {
        let error = new Error('Game not found')
        error.status = 404
        return next(error)
      }

      // Mark genres as checked
      for (let all_i = 0; all_i < results.genres.length; all_i++) {
        for (let game_i = 0; game_i < results.game.genre.length; game_i++) {
          if (
            results.genres[all_i]._id.toString() ===
            results.game.genre[game_i]._id.toString()
          ) {
            results.genres[all_i].checked = 'true'
          }
        }
      }

      res.render('game_form', {
        title: 'Update Game',
        game: results.game,
        publishers: results.publishers,
        genres: results.genres
      })
    }
  )
}
exports.game_update_post = [
  // Convert genre to array
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
  body('released', 'Released date must not be empty').isISO8601(),
  body('stock', 'Stock must not be empty')
    .trim()
    .isNumeric()
    .withMessage('Stock has non-numeric characters'),
  body('price', 'Price must not be empty')
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

  (req, res, next) => {
    const errors = validationResult(req)

    let game = new Game({
      title: req.body.title,
      publisher: req.body.publisher,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      released: req.body.released,
      stock: req.body.stock,
      price: req.body.price,
      image: req.file ? req.file.filename : req.body.currentImage,
      _id: req.params.id
    })

    if (!errors.isEmpty()) {
      // Render form again with errors

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
            title: 'Update Game',
            game: game,
            publishers: results.publishers,
            genres: results.genres,
            errors: errors.array()
          })
        }
      )
      return
    } else {
      // Valid data. Update
      Game.findByIdAndUpdate(req.params.id, game, {}, function(err, thegame) {
        if (err) {
          return next(err)
        }

        res.redirect(thegame.url)
      })
    }
  }
]

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
