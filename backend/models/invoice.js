const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  threadType: { type: String, required: true },
  quantity: { type: Number, required: true },
  kgs: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  buyerFirm: { type: String, required: true },
  threads: { type: [threadSchema], required: true }, // Array of thread entries
  totalAmount: { type: Number, required: true }, // New field for total amount
}, { timestamps: true });



module.exports = mongoose.model('Invoice', invoiceSchema);

