// const mongoose = require('mongoose');

// const buyerFirmSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true, // Ensure firm names are unique
//     },
//     // Additional fields can be added as necessary, like contact info, address, etc.
// });

// const BuyerFirm = mongoose.model('BuyerFirm', buyerFirmSchema);

// module.exports = BuyerFirm;


const mongoose = require('mongoose');

const buyerFirmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure firm names are unique
    },
    ownerName: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const BuyerFirm = mongoose.model('BuyerFirm', buyerFirmSchema);

module.exports = BuyerFirm;
