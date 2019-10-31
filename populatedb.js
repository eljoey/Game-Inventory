console.log('This script populates some test games, publishers, and genres')

const userArgs = process.argv.slice(2)

const async = require('async')
const Game = require('./models/game')
const Genre = require('./models/genre')
const Publisher = require('./models/publisher')

const mongoose = require('mongoose')
const mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

let games = []
let genres = []
let publishers = []

function gameCreate(title, publisher, genre, release, stock, price, cb) {
  gameDetail = {
    title: title,
    publisher: publisher,
    genre: genre,
    release: release,
    stock: stock,
    price: price
  }

  let game = new Game(gameDetail)

  game.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game)
    games.push(game)
    cb(null, game)
  })
}

function genreCreate(name, cb) {
  let genre = new Genre({ name: name })

  genre.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New Genre: ' + genre)
    genres.push(genre)
    cb(null, genre)
  })
}

function publisherCreate(name, cb) {
  let publisher = new Publisher({ name: name })

  publisher.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New Publisher: ' + publisher)
    publishers.push(publisher)
    cb(null, publisher)
  })
}

function createGenrePublishers(cb) {
  async.series(
    [
      function(callback) {
        publisherCreate('Pearl Abyss', callback)
      },
      function(callback) {
        publisherCreate('Blizzard Entertainment', callback)
      },
      function(callback) {
        publisherCreate('Obsidian Entertainment', callback)
      },
      function(callback) {
        publisherCreate('Bethesda', callback)
      },
      function(callback) {
        publisherCreate('Valve', callback)
      },
      function(callback) {
        publisherCreate('Mojang', callback)
      },
      function(callback) {
        genreCreate('MMORPG', callback)
      },
      function(callback) {
        genreCreate('ARPG', callback)
      },
      function(callback) {
        genreCreate('FPS', callback)
      },
      function(callback) {
        genreCreate('Adventure', callback)
      },
      function(callback) {
        genreCreate('Sandbox', callback)
      },
      function(callback) {
        genreCreate('Open World', callback)
      }
    ],
    // Optional cb
    cb
  )
}

function createGames(cb) {
  async.parallel(
    [
      function(callback) {
        console.log('creating first')
        const release = new Date(2016, 3, 3)

        gameCreate(
          'Black Desert Online',
          publishers[0],
          [genres[0]],
          release,
          5,
          9.99,
          callback
        )
      },
      function(callback) {
        const release = new Date(2018, 7, 13)

        gameCreate(
          'Battle for Azeroth',
          publishers[1],
          [genres[0]],
          release,
          12,
          49.99,
          callback
        )
      },
      function(callback) {
        const release = new Date(2012, 4, 15)

        gameCreate(
          'Diablo 3',
          publishers[1],
          [genres[1]],
          release,
          1,
          19.99,
          callback
        )
      },
      function(callback) {
        const release = new Date(2019, 9, 25)

        gameCreate(
          'The Outer Worlds',
          publishers[2],
          [genres[1]],
          release,
          42,
          59.99,
          callback
        )
      },
      function(callback) {
        const release = new Date(2015, 10, 10)

        gameCreate(
          'Fallout 4',
          publishers[3],
          [genres[1]],
          release,
          4,
          29.99,
          callback
        )
      },
      function(callback) {
        const release = new Date(2011, 10, 11)

        gameCreate(
          'The Elder Scrolls V: Skyrim',
          publishers[3],
          [genres[1]],
          release,
          1,
          39.99,
          callback
        )
      },
      function(callback) {
        const release = new Date(2012, 7, 21)

        gameCreate(
          'Counter-Strike: Global Offensive',
          publishers[4],
          [genres[2]],
          release,
          2,
          0.0,
          callback
        )
      },
      function(callback) {
        const release = new Date(2011, 10, 18)

        gameCreate(
          'Minecraft',
          publishers[5],
          [genres[3], genres[4], genres[5]],
          release,
          12,
          26.95,
          callback
        )
      }
    ],
    // Optional callback
    cb
  )
}

async.series(
  [createGenrePublishers, createGames],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err)
    } else {
      console.log('Games: ' + games)
    }

    // done, disconnect from db
    mongoose.connection.close()
  }
)
