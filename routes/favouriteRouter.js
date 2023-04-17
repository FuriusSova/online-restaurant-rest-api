const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Favourites = require('../db/favorite');
const Dishes = require('../db/dishes');

const favRouter = express.Router();

favRouter.use(bodyParser.json());

favRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, fav) => {
            if (err) {
                next(err);
            }
            else if (fav) {
                fav.populate('user');
                fav.populate('favourites.dishId')
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("You don't have any favourites");
            }
        })
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({user: req.user._id}, (err, favUser) => {
            if (err) {
                next(err);
            }
            else if (favUser) {
                req.body.forEach(element => {
                    favUser.favourites.push(element._id);
                });
                /*
                favUser.favourites.forEach(element => {
                    favUser.populate(element + "." + "dishId");
                });*/
                favUser.save()
                .then((favUser) => {
                    Favourites.findOne({user : req.user._id})
                    .populate('user')
                    .then( async () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favUser);
                    })       
                }, (err) => next(err));
            }
            else {
                Favourites.create({user : req.user._id})
                .then((fav) => {
                    req.body.forEach(element => {
                        fav.favourites.push(element._id);
                    });
                    fav.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        })
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, favUser) => {
            if (err) {
                next(err);
            }
            else if (favUser) {
                favUser.favourites.splice(0,favUser.favourites.length);
                favUser.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favUser);
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("You don't have any favourites");
            }
        })
    });

favRouter.route('/:dishId')
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            Favourites.findOne({ user: req.user._id }, (err, favUser) => {
                if (err) {
                    next(err);
                }
                else if (favUser) {
                    favUser.favourites.push({"_id" : req.params.dishId});
                    favUser.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favUser);
                }
                else {
                    Favourites.create({user : req.user._id})
                    .then((fav) => {
                        fav.favourites.push({"_id" : req.params.dishId});
                        fav.save();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fav);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }
            })
        }, (err) => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            Favourites.findOne({ user: req.user._id }, (err, favUser) => {
                if (err) {
                    next(err);
                }
                else if (favUser) {
                    favUser.favourites.forEach( (element, index) => {
                        let id = element._id.toString();
                        if(id == req.params.dishId) {
                            favUser.favourites.splice(index, 1);
                        }
                    });
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favUser);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json("You don't have any favourites");
                }
            })
        }, (err) => next(err))
    });


module.exports = favRouter;