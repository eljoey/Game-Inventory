const Game = require('../models/game')
const Publisher = require('../models/publisher')
const Genre = require('../models/genre')

const aync = require('async')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

exports.game_create_get = function(req, res) {}
exports.game_create_post = function(req, res) {}
exports.game_delete_get = function(req, res) {}
exports.game_delete_post = function(req, res) {}
exports.game_update_get = function(req, res) {}
exports.game_update_post = function(req, res) {}
exports.game_detail = function(req, res) {}
exports.game_game_list = function(req, res) {}
