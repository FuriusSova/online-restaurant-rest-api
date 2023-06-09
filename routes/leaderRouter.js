const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const leaderModel = require('../db/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/:leaderId')
    .get(async (req, res, next) => {
        leaderModel.findById(req.params.leaderId)
            .then(data => {
                if (data) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                } else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    })
    .put((req, res, next) => {
        leaderModel.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((data) => {
                if (data) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                } else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        leaderModel.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

leaderRouter.route('/')
    .get((req, res, next) => {
        leaderModel.find({})
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        leaderModel.create(req.body)
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete(async (req, res, next) => {
        leaderModel.remove({})
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = leaderRouter;