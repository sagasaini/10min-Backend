const mongoose = require('mongoose');

const modalSchema = mongoose.Schema({
    cover: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    }
});

modalSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

modalSchema.set('toJSON', {
    virtuals: true
});

exports.Modal = mongoose.model('Driver', modalSchema);
exports.modalSchema = modalSchema;
