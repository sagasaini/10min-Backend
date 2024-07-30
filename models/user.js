const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    orders: {
        type: Array,
        default: []
    },
    address: {
        type: String,
        default: ''
    },
    reviews: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
