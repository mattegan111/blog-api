const async = require('async');
const User = require('../models/user');

exports.read_all_users = (req, res, next) => {
    User.find()
    .sort([['email', 'ascending']])
    .exec((err, results) => {
        if(err) { return next(err); }
        res.json({ results })
    });
};

exports.read_user = (req, res, next) => {
    User.findById(req.params.id)
    .exec((err, results) => {
        if(err) { return next(err); }
        res.json({ results })
    });
};

exports.create_user = (req, res, next) => {
    const { email, password, first_name, last_name, admin } = req.body;
    const user = new User({     
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
        admin: true
    });
    user.save((err) => {
        if(err) { return next(err); }
        res.status(200).json('user saved');
    });
};

exports.update_user = async (req, res, next) => {
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
};

exports.delete_user = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        res.status(404).json({ log: 'user not found' });
    } else {
        res.status(200).json({ log: 'deleted successfully'})
    }
};
