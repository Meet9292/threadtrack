const mongoose = require('mongoose');

const threadTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure thread types are unique
    },
    pricePerKg: {
        type: Number,
        required: true, // Ensure a price is always set
    },
});

const ThreadType = mongoose.model('ThreadType', threadTypeSchema);

module.exports = ThreadType;
