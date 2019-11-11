const Genre = require('../models/genre')
const Game = require('../models/game')
const async = require('async')
const validator = require('express-validator')

const { body, validationResult, sanitizeBody } = require('express-validator')

exports.genre_list = function(req, res, next) {
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
exports.genre_detail = function(req, res, next) {
  async.parallel(
    {
      genre: callback => {
        Genre.findById(req.params.id).exec(callback)
      },
      games: callback => {
        Game.find({ genre: req.params.id }).exec(callback)
      }
    },
    (err, result) => {
      if (err) {
        return next(err)
      }

      if (result.genre === null) {
        const err = new Error('Genre not found')
        err.status = 404
        return next(err)
      }

      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: result.genre,
        games: result.games
      })
    }
  )
}
exports.genre_create_get = function(req, res) {
  res.render('genre_form', {
    title: 'Create Genre'
  })
}
exports.genre_create_post = [
  validator
    .body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 }),
  validator.sanitizeBody('name').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req)

    let genre = new Genre({ name: req.body.name })

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array()
      })
      return
    } else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err)
        }

        if (found_genre) {
          res.redirect(found_genre.url)
        } else {
          genre.save(err => {
            if (err) {
              return next(err)
            }

            res.redirect(genre.url)
          })
        }
      })
    }
  }
]
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
