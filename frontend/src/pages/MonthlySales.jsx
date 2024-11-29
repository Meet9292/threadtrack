import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";

const MonthlySales = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchMonthlySales = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/monthly-sales?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setInvoices(data.invoices);
      setTotalSales(data.totalSales);
      toast.success("Sales data fetched successfully!"); 
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
      toast.error("Error fetching sales data. Please try again."); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMonthlySales();
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    const sellerFirmName = "Shree Ganesh Enterprise";

    const sellerAddress = "Factory Address: 169, 170, 171, 1st Floor, Kalathiya Corporation, Part-2, Diamond Nagar, Surat."; // Add your seller's address
    const sellerContactNumber = "+91 98799 82259"; 

    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text(sellerFirmName, doc.internal.pageSize.getWidth() / 2, 20, {
        align: "center",
    });

    const dateRangeText = `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} Sales Report`;
    doc.setFontSize(16);
    doc.setFont("times", "normal"); 
    doc.text(dateRangeText, doc.internal.pageSize.getWidth() / 2, 30, {
        align: "center",
    });

    const totalSales = invoices.reduce((sum, invoice) => {
        return sum + invoice.threads.reduce((threadSum, thread) => threadSum + parseFloat(thread.total), 0);
    }, 0);

    doc.setLineWidth(0.5);
    doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35); // Draw a line

    // Table Column Definitions
    const tableColumn = [
        "Date",
        "Buyer Firm",
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
                invoice.buyerFirm,
                thread.threadType,
                thread.quantity,
                thread.kgs,
                `Rs. ${thread.pricePerKg}`, // Add Rs. symbol for price
                `Rs. ${thread.total}`,
            ];
            tableRows.push(invoiceData);
        });
    });

    // Draw the Table without custom colors (defaults will be used)
    const tableStyles = {
        headStyles: {}, // Default styles
        styles: {}, // Default styles
        alternateRowStyles: {}, // Default styles
    };

    doc.autoTable(tableColumn, tableRows, {
        startY: 45,
        ...tableStyles,
        styles: {
            font: 'times',
            fontSize: 12,
            halign: 'center',
        },
    });

    // Draw a border around the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with some margin

    // Grand Total at bottom-right
    const totalX = pageWidth - 20; // Position from the right edge
    const totalY = doc.autoTable.previous.finalY + 10; // Position below the table
    doc.setFontSize(12);
    doc.setFont("times", "bold"); // Use Times New Roman and set to bold
    doc.text(`Grand Total: Rs. ${totalSales.toFixed(2)}`, totalX, totalY, {
        align: "right",
    });

    // Seller address and contact at the bottom center
    const addressY = pageHeight - 30; // Position near the bottom
    doc.setFontSize(10);
    doc.setFont("times", "normal"); // Reset to normal font
    doc.text(sellerAddress, doc.internal.pageSize.getWidth() / 2, addressY, {
        align: "center",
    });
    doc.text(`Seller Contact: ${sellerContactNumber}`, doc.internal.pageSize.getWidth() / 2, addressY + 5, {
        align: "center",
    });

    // Save the PDF
    doc.save("monthly_sales_report.pdf");
    toast.success("PDF downloaded successfully!"); // Toast for PDF download
};

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-full mx-auto bg-white shadow-2xl rounded-lg p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition shadow-lg self-end md:self-center"
          >
            Fetch Sales
          </button>
        </form>
  
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Total Sales: <span className="text-green-600">Rs.{totalSales.toFixed(2)}</span>
        </h2>
  
        <button
          onClick={downloadPDF}
          className="mb-6 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition shadow-lg"
        >
          Download PDF
        </button>
  
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Buyer Firm</th>
                <th className="py-3 px-4 text-left">Thread Type</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Kgs</th>
                <th className="py-3 px-4 text-left">Price per Kg</th>
                <th className="py-3 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) =>
                  invoice.threads.map((thread, index) => (
                    <tr key={`${invoice._id}-${index}`} className="border-t hover:bg-gray-100">
                      {index === 0 && (
                        <>
                          <td className="py-3 px-4 border-b border-gray-200" rowSpan={invoice.threads.length}>
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200" rowSpan={invoice.threads.length}>
                            {invoice.buyerFirm}
                          </td>
                        </>
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
                  <td colSpan="7" className="py-4 text-center text-gray-500">
                    No sales data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

export default MonthlySales;
