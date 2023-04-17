const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const promoModel = require('../db/promotions');

const promRouter = express.Router();

promRouter.use(bodyParser.json());

promRouter.route('/:promoId')
    .get(async (req, res, next) => {
        promoModel.findById(req.params.promoId)
            .then(data => {
                if (data) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                } else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    })
    .put((req, res, next) => {
        promoModel.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((data) => {
                if (data) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                } else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        promoModel.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promRouter.route('/')
    .get((req, res, next) => {
        promoModel.find({})
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        promoModel.create(req.body)
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(async (req, res, next) => {
        promoModel.remove({})
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = promRouter;