const Genre = require('../models/genre')
const Game = require('../models/game')
const async = require('async')
const validator = require('express-validator')

const { body, validationResult } = require('express-validator')

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

exports.genre_delete_get = function(req, res, next) {
  async.parallel(
    {
      genre: callback => {
        Genre.findById(req.params.id).exec(callback)
      },
      genre_games: callback => {
        Game.find({ genre: req.params.id }).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.genre === null) {
        res.redirect('/shop/genres')
      }

      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_games: results.genre_games
      })
    }
  )
}

exports.genre_delete_post = function(req, res, next1) {
  async.parallel(
    {
      genre: callback => {
        Genre.findById(req.body.id).exec(callback)
      },
      genre_games: callback => {
        Game.find({ genre: req.body.id }).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.genre_games.length > 0) {
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_games: results.genre_games
        })
      } else {
        Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
          if (err) {
            return next(err)
          }

          res.redirect('/shop/genres')
        })
      }
    }
  )
}

exports.genre_update_get = function(req, res, next) {
  Genre.findById(req.params.id).exec((err, foundGenre) => {
    if (err) {
      return next(err)
    }

    if (genre === null) {
      let err = 'Genre not found'
      err.status = 404
      return next(err)
    }

    res.render('genre_form', {
      title: 'Update Genre',
      genre: foundGenre
    })
  })
}

exports.genre_update_post = [
  body('name', 'Genre must be specified')
    .trim()
    .isLength({ min: 1 }),

  body('name').escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    let genre = new Genre({
      name: req.body.name,
      _id: req.params.id
    })

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array()
      })
      return
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function(
        err,
        updatedGenre
      ) {
        if (err) {
          return next(err)
        }

        res.redirect(updatedGenre.url)
      })
    }
  }
]
