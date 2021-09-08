const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const Comment = require('../models/comment')
const async = require('async');
const mongoose = require('mongoose');

exports.get_index = (req, res, next) => {
    res.send('not implemented'); // TODO implement
};

exports.read_all_posts = (req, res, next) => {
    Post.find()
    .sort([['timestamp', 'descending']])
    .exec((err, results) => {
        if(err) { return next(err); }
        res.json({ results })
    });
};

exports.read_post = (req, res, next) => {
    async.parallel({
        post: (callback) => {
            Post.findById(req.params.id)
            .exec(callback);
        },
        comments: (callback) => {
            Comment.find({ 'post': req.params.id })
            .exec(callback);
        },
    }, (err, results) => {
        if(err) { return next(err); }
        res.json({ results });
    });
};

exports.create_post = [
    body('header', 'Header is required').trim().isLength({ min: 1, max: 160 }).escape(),
    body('body', 'Body is required').trim().isLength({ min: 1, max: 20000 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (!errors.isEmpty()) {
                res.json({
                  data: req.body,
                  errors: errors.array(),
                });
                return;
            }
        } else {
            const userId = mongoose.Types.ObjectId(req.body.userIdString); //TODO Should read user session
            const { published, header, body } = req.body;
            const post = new Post({
                published: published,
                header: header,
                body: body,
                user: userId,
                timestamp: Date.now(),
            }); 
            post.save((err) => {
                if (err) { return next(err); }
                res.status(200).json({ log: 'post sent' });
            });
        }
    }
];

exports.update_post = [
    body('header', 'Header is required').trim().isLength({ min: 1, max: 160 }).escape(),
    body('body', 'Body is required').trim().isLength({ min: 1, max: 20000 }).escape(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (!errors.isEmpty()) {
                res.json({
                  data: req.body,
                  errors: errors.array(),
                });
                return;
            }
        } else {
            const userId = mongoose.Types.ObjectId(req.body.userIdString); //TODO Should read user session
            const { published, header, body } = req.body; //TODO add user somehow
            const post = await Post.findByIdAndUpdate(req.params.id, {
                published: published,
                header: header,
                body: body,
                user: userId,
                timestamp: Date.now(),
            });
            if(!post) { 
                res.status(404).json({ log: 'post not found'}); 
            } else {
                res.status(200).json({ log: "updated successfully" });
            }
        }
    }
];

exports.delete_post = async (req, res, next) => {
    async.parallel({
        post: (callback) => {
            Post.findById(req.params.id)
            .exec(callback);
        },
        comments: (callback) => {
            Comment.find({ 'post': req.params.id })
            .exec(callback);
        },
    }, async (err, results) => {
        if(err) { return next(err); }
        const post = await Post.findByIdAndDelete(req.params.id);
        if(results.comments) {
            results.comments.forEach(comment => {
                Comment.findByIdAndDelete(comment._id);
            });
        }
        if(!post) { 
            res.status(404).json({ log: 'post not found'}); 
        } else {
            res.status(200).json({ log: "deleted successfully" });
        }
    }); 
};
