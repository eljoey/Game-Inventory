const Publisher = require("../models/publisher");
const Game = require("../models/game");
const async = require("async");
const { body, validationResult, sanitizeBody } = require("express-validator");

exports.publisher_list = function(req, res, next) {
  Publisher.find()
    .sort("name")
    .exec((err, publishers) => {
      if (err) {
        return next(err);
      }

      res.render("publisher_list", {
        title: "Publisher List",
        publishers: publishers
      });
    });
};

exports.publisher_detail = function(req, res, next) {
  async.parallel(
    {
      publisher: callback => {
        Publisher.findById(req.params.id).exec(callback);
      },
      publisher_games: callback => {
        Game.find({ publisher: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.publisher === null) {
        const err = new Error("Publisher not found");
        err.status = 404;
        return next(err);
      }

      res.render("publisher_detail", {
        title: "Publisher Detail",
        publisher: results.publisher,
        publisher_games: results.publisher_games
      });
    }
  );
};

exports.publisher_create_get = function(req, res, next) {
  res.render("publisher_form", {
    title: "Create Publisher"
  });
};

exports.publisher_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 }),

  sanitizeBody("name").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let publisher = new Publisher({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("publisher_form", {
        title: "Create Publisher",
        publisher: publisher,
        errors: errors.array()
      });
      return;
    } else {
      Publisher.findOne({ name: req.body.name }).exec(
        (err, found_publisher) => {
          if (err) {
            return next(err);
          }

          if (found_publisher) {
            res.redirect(found_publisher.url);
          } else {
            publisher.save(err => {
              if (err) {
                return next(err);
              }

              res.redirect(publisher.url);
            });
          }
        }
      );
    }
  }
];

exports.publisher_delete_get = function(req, res, next) {
  async.parallel(
    {
      publisher: callback => {
        Publisher.findById(req.params.id).exec(callback);
      },
      publisher_games: callback => {
        Game.find({ publisher: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.publisher === null) {
        res.redirect("/inventory/publishers");
      }

      res.render("publisher_delete", {
        title: "Delete Publisher",
        publisher: results.publisher,
        publisher_games: results.publisher_games
      });
    }
  );
};

exports.publisher_delete_post = function(req, res, next) {
  async.parallel(
    {
      publisher: callback => {
        Publisher.findById(req.body.publisherid).exec(callback);
      },
      publisher_games: callback => {
        Game.find({ publisher: req.body.publisherid }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.publisher_games.length > 0) {
        res.render("publisher_delete", {
          title: "Delete Publisher",
          publisher: results.publisher,
          publisher_games: results.publisher_games
        });
        return;
      } else {
        Publisher.findByIdAndRemove(
          req.body.publisherid,
          function deletePublisher(err) {
            if (err) {
              return next(err);
            }

            res.redirect("/inventory/publishers");
          }
        );
      }
    }
  );
};

exports.publisher_update_get = function(req, res, next) {
  Publisher.findById(req.params.id).exec((err, foundPublisher) => {
    if (err) {
      return next(err);
    }

    if (foundPublisher === null) {
      const err = new Error("Publisher not found");
      err.status = 404;
      return next(err);
    }

    res.render("publisher_form", {
      title: "Update Publisher",
      publisher: foundPublisher
    });
  });
};

exports.publisher_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 }),

  body("name").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let publisher = new Publisher({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render("publisher_form", {
        title: "Update Publisher",
        publisher: publisher,
        errors: errors.array()
      });
      return;
    } else {
      Publisher.findByIdAndUpdate(req.params.id, publisher, {}, function(
        err,
        updatedPublisher
      ) {
        if (err) {
          return next(err);
        }

        res.redirect(updatedPublisher.url);
      });
    }
  }
];
