const Post = require('../models/post');
const Comment = require('../models/comment')
const async = require('async');
const { MongoClient, ObjectID } = require('mongodb');

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

exports.create_post = (req, res, next) => {
    const objectId = new ObjectID()
    const post = new Post({
        published: true,
        header: '5-meo DMT',
        body: 'paediatric applications',
        user: { objectId },
        timestamp: Date.now(),
    }); 
    //TODO add user somehow and replace post above with post below
/*     const { published, header, body } = req.body; 
    const post = new Post({
        published: published,
        header: header,
        body: body,
        comments: [],
        user: { objectId },
        timestamp: Date.now(),
    }); */
    post.save((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ log: 'post sent' });
      });
};

exports.update_post = async (req, res, next) => {
    const { published, header, body } = req.body; //TODO add user somehow
    const post = await Post.findByIdAndUpdate(req.params.id, {
        published: published,
        header: header,
        body: body,
        user: { objectId },
        timestamp: Date.now(),
    });
    if(!post) { 
        res.status(404).json({ log: 'post not found'}); 
    } else {
        res.status(200).json({ log: "updated successfully" });
    }
};

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
