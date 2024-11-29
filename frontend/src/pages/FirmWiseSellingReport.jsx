import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios'

const FirmWiseSellingReport = () => {
  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState(''); // If needed for date range
  const [endDate, setEndDate] = useState(''); // If needed for date range

  useEffect(() => {
    const fetchFirmNames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/buyers');
        const data = await response.json();
        setFirms(data.buyerFirms);
      } catch (error) {
        console.error('Error fetching firm names:', error);
      }
    };
    fetchFirmNames();
  }, []);

  const fetchFirmInvoices = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/firm-invoices?firm=${selectedFirm}`);
        const data = await response.json();

        if (data.success) {
            setInvoices(data.invoices);
            toast.success("Invoices fetched successfully!"); // Success toast
        } else {
            setInvoices([]);
            toast.error("No invoices found for the selected firm."); // Error toast
        }
    } catch (error) {
        console.error('Error fetching firm invoices:', error);
        toast.error("Error fetching invoices. Please try again later."); // Catch error toast
    }
};

  const handleFetchData = (e) => {
    e.preventDefault();
    fetchFirmInvoices();
  };



  const downloadPDF = async () => {
    const doc = new jsPDF();
    const sellerFirmName = "Shree Ganesh Enterprise";
    const sellerAddress = "Factory Address: 169, 170, 171, 1st Floor, Kalathiya Corporation, Part-2, Diamond Nagar, Surat."; // Add your seller's address
    const sellerContact = "Seller Contact: +91 98799 82259"; // Add your seller's contact information

    // Seller Firm Name (Center Aligned, Bold)
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    const firmNameY = 20; // Y position for the firm name
    doc.text(sellerFirmName, doc.internal.pageSize.getWidth() / 2, firmNameY, {
        align: "center",
    });

    // Draw a line below the firm name
    const lineY = firmNameY + 5; // Y position for the line (5 units below the firm name)
    doc.setLineWidth(1);
    doc.line(10, lineY, doc.internal.pageSize.getWidth() - 10, lineY); // Line across the page

    // Fetch Buyer Information based on firm name
    let buyerInfo;

    try {
        const response = await axios.get(`http://localhost:5000/api/buyers/${selectedFirm}`);

        if (response.data.success) {
            buyerInfo = response.data.buyerFirm; // Extracting buyerFirm object from the response
            console.log(buyerInfo);
        } else {
            throw new Error("Failed to fetch buyer information");
        }
    } catch (error) {
        console.error("Error fetching buyer information:", error.response ? error.response.data : error.message);
        toast.error("Could not fetch buyer information.");
        return;
    }

    // Buyer Firm Information
    doc.setFontSize(16);
    doc.setFont("times", "bold"); // Set font to Times Bold
    doc.text(`Buyer Firm: ${buyerInfo.name}`, 10, 40);

    // Buyer Contact Information
    doc.setFont("times", "normal"); // Set font to Times Normal
    doc.setFontSize(12);
    doc.text(`Owner: ${buyerInfo.ownerName}`, 10, 50);
    doc.text(`Contact Number: ${buyerInfo.contactInfo}`, 10, 60);
    doc.text(`Address: ${buyerInfo.address}`, 10, 70);

    // Total Sales Calculation
    const totalSales = invoices.reduce((sum, invoice) => {
        return (
            sum +
            invoice.threads.reduce(
                (threadSum, thread) => threadSum + parseFloat(thread.total),
                0
            )
        );
    }, 0);

    // Draw a line separating the header from the body
    doc.setLineWidth(0.5);
    doc.line(10, 75, doc.internal.pageSize.getWidth() - 10, 75); // Adjusted to match the new layout

    // Table Column Definitions
    const tableColumn = [
        "Date",
        "Thread Type",
        "Quantity",
        "Kgs",
        "Price per Kg",
        "Total",
    ];
    const tableRows = [];

    // Collecting Table Rows
    invoices.forEach((invoice) => {
        invoice.threads.forEach((thread) => {
            const invoiceData = [
                new Date(invoice.date).toLocaleDateString(),
                thread.threadType,
                thread.quantity,
                thread.kgs,
                `Rs. ${thread.pricePerKg}`,
                `Rs. ${thread.total}`,
            ];
            tableRows.push(invoiceData);
        });
    });

    // Draw the Table
    doc.autoTable(tableColumn, tableRows, { startY: 80 });

    // Draw a border around the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Grand Total at bottom-right
    const totalX = pageWidth - 20;
    const totalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text(`Grand Total: Rs. ${totalSales.toFixed(2)}`, totalX, totalY, {
        align: "right",
    });

    // Seller Address and Contact at the bottom center
    const addressY = pageHeight - 40; // Y position for the address
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(sellerAddress, pageWidth / 2, addressY, { align: "center" });
    doc.text(sellerContact, pageWidth / 2, addressY + 5, { align: "center" });

    // Save the PDF
    doc.save("firm_sales_report.pdf");
    toast.success("PDF downloaded successfully!");
};



  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-full mx-auto bg-white shadow-2xl rounded-lg p-8">
        {/* Form for selecting firm */}
        <form onSubmit={handleFetchData} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Select Firm:</label>
            <select
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>Select a firm</option>
              {firms.map((firm, index) => (
                <option key={index} value={firm.name}>{firm.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="self-end bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Fetch Data
          </button>
        </form>
  
        {/* Button to download PDF */}
        <button
          onClick={downloadPDF}
          className="mb-6 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition shadow-lg"
        >
          Download PDF
        </button>
  
        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Thread Type</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Quantity</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Kgs</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Price per Kg</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) =>
                  invoice.threads.map((thread, index) => (
                    <tr key={`${invoice._id}-${index}`} className="hover:bg-gray-50">
                      {index === 0 && (
                        <td className="py-3 px-4 border-b border-gray-200" rowSpan={invoice.threads.length}>
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                      )}
                      <td className="py-3 px-4 border-b border-gray-200">{thread.threadType}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{thread.quantity}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{thread.kgs}</td>
                      <td className="py-3 px-4 border-b border-gray-200">₹ {thread.pricePerKg}</td>
                      <td className="py-3 px-4 border-b border-gray-200">₹ {thread.total}</td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">No sales data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  };

export default FirmWiseSellingReport;
