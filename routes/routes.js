const express = require('express');
const router = express.Router();

/// HOME ///
// view home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/// API HOME ///
// view home with all posts
router.get('/api', (req, res) => {
  res.send('get /api');
});

/// POSTS ///
// view all posts
router.get('/api/posts', (req, res) => {
  res.send('get /api');
});
// view one post
router.get('/api/posts/:id', (req, res, next) => {
  res.send('get /api/posts/:id');
});
// create new post
router.post('/api/posts/', (req, res, next) => {
  res.send('post /api/posts/');
});
// update post
router.put('/api/posts/:id', (req, res, next) => {
  res.send('put /api/posts/:id');
});
// delete post
router.delete('/api/posts/:id', (req, res, next) => {
  res.send('delete /api/posts/:id');
});

/// COMMENTS ///
// view one posts comments
router.get('/api/posts/:id/comments', (req, res, next) => {
  res.send('get /api/posts/:id/comments');
});
// create new comment
router.post('/api/posts/_id/comments/_id', (req, res, next) => {
  res.send('post /api/posts/_id/comments/_id');
});
// update post
router.put('/api/posts/:id', (req, res, next) => {
  res.send('put /api/posts/:id');
});
// delete post
router.delete('/api/posts/:id', (req, res, next) => {
  res.send('delete /api/posts/:id');
});

/// users ///
// view all users
router.get('/api/users', (req, res, next) => {
  res.send('get /api/users');
});
// view one user
router.get('/api/users/:id', (req, res, next) => {
  res.send('get /api/users/:id');
});
// create new user
router.post('/api/users', (req, res, next) => {
  res.send('post /api/users');
});
// update user
router.put('/api/users/_id', (req, res, next) => {
  res.send('put /api/users/_id');
});
// delete user
router.delete('/api/users/_id', (req, res, next) => {
  res.send('delete /api/users/_id');
});


module.exports = router;