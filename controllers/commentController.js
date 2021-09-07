const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const mongoose = require('mongoose');

exports.read_post_comments = (req, res, next) => {
    Comment.find({ 'post': req.params.postid })
    .sort([['timestamp', 'descending']])
    .exec((err, results) => {
        if(err) { return next(err); }
        res.json({ results })
    });
};

exports.create_comment = (req, res, next) => {
    const postId = mongoose.Types.ObjectId(req.body.postIdString);
    const { body, username } = req.body;
    const comment = new Comment({
        body: body,
        username: username,
        post: postId,
        timestamp: Date.now(),
    });
    comment.save((err) => {
        if(err) { return next(err) }
        res.status(200).json({ log: 'comment sent' });
    });
};

exports.update_comment = async (req, res, next) => {
    const comment = await Comment.findByIdAndUpdate(req.params.commentid, { body: req.body, edited: true });
    if(!comment) { 
        res.status(404).json({ log: 'comment not found'}); 
    } else {
        res.status(200).json({ log: "updated successfully" });
    }
};

exports.delete_comment = async (req, res, next) => {
    const comment = await Comment.findByIdAndDelete(req.params.commentid);
    if(!comment) { 
        res.status(404).json({ log: 'comment not found'}); 
    } else {
        res.status(200).json({ log: "deleted successfully" });
    }
};
