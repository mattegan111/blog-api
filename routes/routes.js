const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');

/// HOME ///
// view home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/// API HOME ///
// view home with all posts
router.get('/api', post_controller.get_index);

/// POSTS ///
// view all posts
router.get('/api/posts', post_controller.read_all_posts);
// view one post
router.get('/api/posts/:id', post_controller.read_post);
// create new post
router.post('/api/posts/', post_controller.create_post);
// update post
router.put('/api/posts/:id', post_controller.update_post);
// delete post
router.delete('/api/posts/:id', post_controller.delete_post);

/// COMMENTS ///
// view one posts comments
router.get('/api/posts/:postid/comments', comment_controller.read_post_comments);
// create new comment
router.post('/api/posts/:postid/comments/:commentid', comment_controller.create_comment);
// update comment
router.put('/api/posts/:postid/comments/:commentid', comment_controller.update_comment);
// delete comment
router.delete('/api/posts/:postid/comments/:commentid', comment_controller.update_comment);

/// users ///
// view all users
router.get('/api/users', user_controller.read_all_users);
// view one user
router.get('/api/users/:id', user_controller.read_user);
// create new user
router.post('/api/users', user_controller.create_user);
// update user
router.put('/api/users/:id', user_controller.update_user);
// delete user
router.delete('/api/users/:id', user_controller.delete_user);


module.exports = router;