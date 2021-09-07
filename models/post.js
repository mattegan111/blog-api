const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        published: { type:Boolean, required: true },
        header: { type:String, required: true, minLength: 1, maxLength: 160 },
        body: { type:String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, default: Date.now, required: true },
    }
);

postSchema
.virtual('url')
.get(() => {
    return '/post/' + this._id;
});

module.exports = mongoose.model('Post', postSchema);