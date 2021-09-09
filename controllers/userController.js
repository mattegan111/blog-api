const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secrets = require('../secrets');

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
    body('password', 'Password is required, minimum length of 6 characters.').isLength({ min: 6, max: 160 }).escape(),
    body('confirm_password', 'Password must be at least 6 characters.')
    .isLength({min: 6})
    .custom(async (value, { req }) => {
        // Use the custom method w/ a CB func to ensure that both passwords match, return an error if not
        if (value !== req.body.password) throw new Error('Passwords must be the same');
        return true;
    }),
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
            console.log('cow');
            passport.authenticate('sign-up', { session: false }, (err, user) => {
                console.log('frog');
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.json({
                      username: req.body.username,
                      errors: errors.array(),
                    });
                  }
                if (err) { return next(err); }
                if (user === false) { 
                    res.json({
                        log: 'email already in use',
                    });
                } else {
                    res.json({
                        log: 'signed up successfully',
                        user: req.user
                    });
                }
            })(req, res, next);
        }
    }
];

exports.update_user = [
    body('email', 'Email is required').isEmail().normalizeEmail().isLength({ min: 1, max: 160 }).escape(),
    body('password', 'Password is required').isLength({ min: 1, max: 160 }).escape(),
    body('confirm_password', 'Password must be at least 6 characters.')
    .isLength({min: 6})
    .custom(async (value, { req }) => {
        // Use the custom method w/ a CB func to ensure that both passwords match, return an error if not
        if (value !== req.body.password) throw new Error('Passwords must be the same');
        return true;
    }),
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

exports.user_sign_in = (req, res, next) => {
    passport.authenticate('sign-in', { session: false }, (err, user, info) => {
        req.login(user, {session: false}, (err) => {
            if (err) { res.send(err); }
            const body = { _id: user._id, username: user.email };
            const token = jwt.sign({ user: body }, secrets.jwtSecret);
            return res.json({ token });
        });
    })(req, res, next);
};

exports.user_sign_out = (req, res) => {
    req.logout();
    res.redirect('/');
};
