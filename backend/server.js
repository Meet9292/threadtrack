const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const invoiceRoutes = require('./invoiceRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', invoiceRoutes);

const mongoURI = 'mongodb://localhost:27017/invoicesDB';
mongoose.connect(mongoURI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection error:", error));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
