const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        body: { type:String, required: true },
        username: { type:String, required: true },
        timestamp: { type: Date, default: Date.now, required: true },
    }
);

commentSchema
.virtual('url')
.get(() => {
    return '/comment/' + this._id;
});

module.exports = mongoose.model('Comment', commentSchema);