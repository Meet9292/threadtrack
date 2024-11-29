const express = require("express");
const pdf = require("html-pdf");
const router = express.Router();
const Invoice = require("./models/invoice"); // Ensure this path is correct
const BuyerFirm = require('./models/buyer.model');   
const ThreadType = require('./models/thread.model');     

// Create a new invoice
router.post("/create", async (req, res) => {
  try {
    const { date, buyerFirm, threads } = req.body;

    // Calculate total amount for the invoice
    const totalAmount = threads.reduce((sum, thread) => sum + thread.total, 0);

    const newInvoice = new Invoice({
      date,
      buyerFirm,
      threads,
      totalAmount, // Include the total amount
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).send("Error creating invoice");
  }
});

// Get all invoices, sorted from newest to oldest
router.get("/invoices", async (req, res) => {
  try {
    // Fetch and sort invoices by date in descending order
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).send("Error fetching invoices");
  }
});

// Fetch an invoice by ID
router.get("/invoices/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`Fetching invoice with ID: ${id}`); // Debug log

  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error); // Log error
    res.status(500).json({ message: "Error fetching invoice", error: error.message });
  }
});


// Update an invoice
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { date, buyerFirm, threads, totalAmount } = req.body;

  console.log(`Updating invoice with ID: ${id}`); // Debug log
  console.log(`Request Body:`, req.body); // Log request body

  try {
    if (!date || !buyerFirm || !Array.isArray(threads) || totalAmount === undefined) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { date, buyerFirm, threads, totalAmount },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error); // Log error
    res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
});


// Delete an invoice
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).send("Invoice not found");
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).send("Error deleting invoice");
  }
});

// Monthly sales
router.get("/monthly-sales", async (req, res) => {
  const { startDate, endDate } = req.query; // Expecting startDate and endDate as query parameters
  try {
    // Ensure dates are parsed correctly
    const invoices = await Invoice.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    // Calculate total sales
    const totalSales = invoices.reduce(
      (total, invoice) => total + invoice.totalAmount,
      0
    );

    res.json({ invoices, totalSales });
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    res.status(500).json({ error: "Failed to fetch sales data." });
  }
});


router.get("/firm-invoices", async (req, res) => {
  try {
    const { firm, startDate, endDate } = req.query;

    // Ensure required query parameters are present
    if (!firm || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Firm, start date, and end date are required.",
      });
    }

    // Parse the start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure the end date includes the full day

    // Query the database
    const invoices = await Invoice.find({
      "buyerFirm": firm,
      "date": { $gte: start, $lte: end },
    });

    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No invoices found for the selected firm and date range.",
      });
    }

        // Calculate total sales
    const totalSales = invoices.reduce(
          (total, invoice) => total + invoice.totalAmount,
          0
        );

    return res.status(200).json({
      success: true,
      invoices,
      totalSales
    });
  } catch (error) {
    console.error("Error fetching firm invoices:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching invoices.",
    });
  }
});







router.get('/firms', async (req, res) => {
  try {
      const firms = await Invoice.distinct('buyerFirm'); // Get unique firm names
      res.json(firms);
  } catch (error) {
      console.error('Error fetching firms:', error);
      res.status(500).json({ message: 'Server error while fetching firm names.' });
  }
});

// Route to get invoices by firm name
router.get('/firm/:firmName', async (req, res) => {
  const firmName = req.params.firmName; 

  try {
      const invoices = await Invoice.find({ buyerFirm: firmName }, 'date buyerFirm totalAmount threads'); 
      if (invoices.length === 0) {
          return res.status(404).json({ message: 'No invoices found for the selected firm.' });
      }
      res.json(invoices);
  } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ message: 'Server error while fetching invoices.' });
  }
});


// Create a new thread type
router.post('/threads', async (req, res) => {
  try {
      const { name, pricePerKg } = req.body;

      // Validate request body
      if (!name || pricePerKg === undefined) {
          return res.status(400).json({ success: false, message: 'Name and price are required' });
      }

      const threadType = new ThreadType({
          name,
          pricePerKg,
      });

      await threadType.save();
      res.status(201).json({ success: true, threadType });
  } catch (error) {
      console.error('Error saving thread type:', error);
      res.status(500).json({ success: false, message: 'Error saving thread type', error: error.message });
  }
});

// Get all thread types
router.get('/threads', async (req, res) => {
  try {
      const threadTypes = await ThreadType.find();
      res.json({ success: true, threadTypes });
  } catch (error) {
      console.error('Error fetching thread types:', error);
      res.status(500).json({ success: false, message: 'Error fetching thread types' });
  }
});


// Create a new buyer firm
router.post('/buyers', async (req, res) => {
  try {
      const { name, ownerName, contactInfo, address } = req.body;

      // Validate request body
      if (!name || !ownerName || !contactInfo || !address) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const buyerFirm = new BuyerFirm({
          name,
          ownerName,
          contactInfo,
          address
      });

      await buyerFirm.save();
      res.status(201).json({ success: true, buyerFirm });
  } catch (error) {
      console.error('Error saving buyer firm:', error);
      res.status(500).json({ success: false, message: 'Error saving buyer firm', error: error.message });
  }
});

// Get buyer firm by name
router.get('/buyers/:name', async (req, res) => {
  try {
    const buyerFirm = await BuyerFirm.findOne({ name: req.params.name });
    if (!buyerFirm) {
      return res.status(404).json({ success: false, message: 'Buyer firm not found' });
    }
    res.json({ success: true, buyerFirm });
  } catch (error) {
    console.error('Error fetching buyer firm:', error);
    res.status(500).json({ success: false, message: 'Error fetching buyer firm' });
  }
});

// Get all buyer firms with full details
router.get('/buyers', async (req, res) => {
  try {
      const buyerFirms = await BuyerFirm.find({}, 'name ownerName contactInfo address'); // Specify fields to retrieve
      res.json({ success: true, buyerFirms });
  } catch (error) {
      console.error('Error fetching buyer firms:', error);
      res.status(500).json({ success: false, message: 'Error fetching buyer firms', error: error.message });
  }
});

module.exports = router;
