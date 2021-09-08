const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const passport = require('passport');

exports.read_all_users = (req, res, next) => {
    User.find()
    .sort([['email', 'ascending']])
    .exec((err, results) => {
        if(err) { return next(err); }
        res.json({ results });
    });
};

exports.read_user = (req, res, next) => {
    User.findById(req.params.id)
    .exec((err, results) => {
        if(err) { return next(err); }
        res.json({ results });
    });
};

exports.create_user = [
    body('email', 'Email is required').isEmail().normalizeEmail().isLength({ min: 1, max: 160 }).escape(),
    body('password', 'Password is required').isLength({ min: 1, max: 160 }).escape(),
    body('first_name', 'First name is required').isLength({ min: 1, max: 160 }).escape(),
    body('last_name', 'Last name is required').isLength({ min: 1, max: 160 }).escape(),
    body('admin', 'Admin is required').isLength({ min: 1, max: 160 }).escape(),

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
            const { email, password, first_name, last_name, admin } = req.body;
            const user = new User({     
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                admin: admin
            });
            user.save((err) => {
                if(err) { return next(err); }
                res.status(200).json('user saved');
            });
        }
    }
];

exports.update_user = [
    body('email', 'Email is required').isEmail().normalizeEmail().isLength({ min: 1, max: 160 }).escape(),
    body('password', 'Password is required').isLength({ min: 1, max: 160 }).escape(),
    body('first_name', 'First name is required').isLength({ min: 1, max: 160 }).escape(),
    body('last_name', 'Last name is required').isLength({ min: 1, max: 160 }).escape(),
    body('admin', 'Admin is required').isLength({ min: 1, max: 160 }).escape(),

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
            const { email, password, first_name, last_name, admin } = req.body;
            const user = await User.findByIdAndUpdate((req.params.id), {
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                admin: admin
            });
            if(!user) { 
                res.status(404).json({ log: 'user not found'}); 
            } else {
                res.status(200).json({ log: "updated successfully" });
            }
        }
    }
];

exports.delete_user = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        res.status(404).json({ log: 'user not found' });
    } else {
        res.status(200).json({ log: 'deleted successfully' });
    }
};

exports.user_sign_in = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
});

exports.user_sign_out = (req, res) => {
    req.logout();
    res.redirect('/sign-in');
};
