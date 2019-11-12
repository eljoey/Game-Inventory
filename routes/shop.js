const express = require('express')
const router = express.Router()

const game_controller = require('../controllers/gameController.js')
const publisher_controller = require('../controllers/publisherController')
const genre_controller = require('../controllers/genreController')
const shop_controller = require('../controllers/shopController')

// Shop Default page

router.get('/', shop_controller.index)

/// GAME ROUTES ///

// GET, Create game
router.get('/game/create', game_controller.game_create_get)

// POST, Create game
router.post('/game/create', game_controller.game_create_post)

// GET, delete game
router.get('/game/:id/delete', game_controller.game_delete_get)

// POST, delete game
router.post('/game/:id/delete', game_controller.game_delete_post)

// GET, update game
router.get('/game/:id/update', game_controller.game_update_get)

// POST, update game
router.post('/game/:id/update', game_controller.game_update_post)

// GET, specific game
router.get('/game/:id', game_controller.game_detail)

// GET, all games
router.get('/games', game_controller.game_list)

// /// PUBLISHER ROUTES ///

// GET, create publisher
router.get('/publisher/create', publisher_controller.publisher_create_get)

// POST, create publisher
router.post('/publisher/create', publisher_controller.publisher_create_post)

// GET, delete publisher
router.get('/publisher/:id/delete', publisher_controller.publisher_delete_get)

// POST, delete publisher
router.post('/publisher/:id/delete', publisher_controller.publisher_delete_post)

// GET, update publisher
router.get('/publisher/:id/update', publisher_controller.publisher_update_get)

// POST, update publisher
router.post('/publisher/:id/update', publisher_controller.publisher_update_post)

// GET, specific publisher
router.get('/publisher/:id', publisher_controller.publisher_detail)

// GET, all publishers
router.get('/publishers', publisher_controller.publisher_list)

// /// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get)

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post)

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get)

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post)

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get)

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post)

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail)

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list)

module.exports = router
