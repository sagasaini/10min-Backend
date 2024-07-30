const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressType: {
        type: String,
        enum: ['Home', 'Work', 'Hotel', 'Other'],
        required: true
    },
    flatNumber: {
        type: String,
        required: true
    },
    floor: {
        type: String
    },
    locality: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    }
});

addressSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

addressSchema.set('toJSON', {
    virtuals: true
});

exports.Address = mongoose.model('Address', addressSchema);
exports.addressSchema = addressSchema;
