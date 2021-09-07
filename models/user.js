const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: { type:String, required: true, minLength: 1, maxLength: 100, required: true },
        password: { type:String, required: true},
        first_name: { type:String, required: true, minLength: 1, maxLength: 100, required: true },
        last_name: { type:String, required: true, minLength: 1, maxLength: 100, required: true },
        admin: { type:Boolean, required: true }
    }
);

userSchema
.virtual('url')
.get(function () {
    return '/user/' + this._id;
});

module.exports = mongoose.model('User', userSchema);