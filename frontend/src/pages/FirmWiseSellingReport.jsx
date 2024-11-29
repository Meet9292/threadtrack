import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const FirmWiseSellingReport = () => {
  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 
  useEffect(() => {
    const fetchFirmNames = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/buyers");
        const data = await response.json();
        setFirms(data.buyerFirms);
      } catch (error) {
        console.error("Error fetching firm names:", error);
      }
    };
    fetchFirmNames();
  }, []);

  const fetchFirmInvoices = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/firm-invoices?firm=${selectedFirm}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
        setTotalSales(data.totalSales);
        toast.success("Invoices fetched successfully!");
      } else {
        setInvoices([]);
        toast.error("No invoices found for the selected firm and date range.");
      }
    } catch (error) {
      console.error("Error fetching firm invoices:", error);
      toast.error("Error fetching invoices. Please try again later.");
    }
  };

  const groupAndSumThreads = (invoice) => {
    const groupedThreads = {};
    invoice.threads.forEach((thread) => {
      if (groupedThreads[thread.threadType]) {
        groupedThreads[thread.threadType].quantity += thread.quantity;
        groupedThreads[thread.threadType].kgs += thread.kgs;
        groupedThreads[thread.threadType].total += thread.total;
      } else {
        groupedThreads[thread.threadType] = { ...thread };
      }
    });
    return Object.values(groupedThreads);
  };

  const handleFetchData = (e) => {
    e.preventDefault();
    fetchFirmInvoices();
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();
    const sellerFirmName = "Shree Ganesh Enterprise";
    const sellerAddress =
      "Factory Address: 169, 170, 171, 1st Floor, Kalathiya Corporation, Part-2, Diamond Nagar, Surat.";
    const sellerContact = "Seller Contact: +91 98799 82259"; 
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    const firmNameY = 20;
    doc.text(sellerFirmName, doc.internal.pageSize.getWidth() / 2, firmNameY, {
      align: "center",
    });

    
    const lineY = firmNameY + 5; 
    doc.setLineWidth(1);
    doc.line(10, lineY, doc.internal.pageSize.getWidth() - 10, lineY);
    let buyerInfo;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/buyers/${selectedFirm}`
      );

      if (response.data.success) {
        buyerInfo = response.data.buyerFirm;
        console.log(buyerInfo);
      } else {
        throw new Error("Failed to fetch buyer information");
      }
    } catch (error) {
      console.error(
        "Error fetching buyer information:",
        error.response ? error.response.data : error.message
      );
      toast.error("Could not fetch buyer information.");
      return;
    }

    
    doc.setFontSize(16);
    doc.setFont("times", "bold"); 
    doc.text(`Buyer Firm: ${buyerInfo.name}`, 10, 40);

    doc.setFont("times", "normal"); 
    doc.setFontSize(12);
    doc.text(`Owner: ${buyerInfo.ownerName}`, 10, 50);
    doc.text(`Contact Number: ${buyerInfo.contactInfo}`, 10, 60);
    doc.text(`Address: ${buyerInfo.address}`, 10, 70);

    const totalSales = invoices.reduce((sum, invoice) => {
      return (
        sum +
        invoice.threads.reduce(
          (threadSum, thread) => threadSum + parseFloat(thread.total),
          0
        )
      );
    }, 0);

  
    doc.setLineWidth(0.5);
    doc.line(10, 75, doc.internal.pageSize.getWidth() - 10, 75); 

    
    const tableColumn = [
      "Date",
      "Thread Type",
      "Quantity",
      "Kgs",
      "Price per Kg",
      "Total",
    ];
    const tableRows = [];


invoices.forEach((invoice) => {
  const groupedThreads = {};

  invoice.threads.forEach((thread) => {
    if (groupedThreads[thread.threadType]) {
      groupedThreads[thread.threadType].quantity += thread.quantity;
      groupedThreads[thread.threadType].kgs += thread.kgs;
      groupedThreads[thread.threadType].total += thread.total;
    } else {
      groupedThreads[thread.threadType] = { ...thread };
    }
  });

  Object.values(groupedThreads).forEach((thread) => {
    const invoiceData = [
      new Date(invoice.date).toLocaleDateString(),
      thread.threadType,
      thread.quantity,
      thread.kgs,
      `Rs. ${thread.pricePerKg}`,
      `Rs. ${thread.total.toFixed(2)}`,
    ];
    tableRows.push(invoiceData);
  });
});
    doc.autoTable(tableColumn, tableRows, { startY: 80 });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    const totalX = pageWidth - 20;
    const totalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text(`Grand Total: Rs. ${totalSales.toFixed(2)}`, totalX, totalY, {
      align: "right",
    });

    const addressY = pageHeight - 40; 
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(sellerAddress, pageWidth / 2, addressY, { align: "center" });
    doc.text(sellerContact, pageWidth / 2, addressY + 5, { align: "center" });

    doc.save("firm_sales_report.pdf");
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-full mx-auto bg-white shadow-2xl rounded-lg p-8">
        <form
          onSubmit={handleFetchData}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Select Firm:
            </label>
            <select
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Select a firm
              </option>
              {firms.map((firm, index) => (
                <option key={index} value={firm.name}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">End Date:</label>
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
            className="self-end bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-lg col-span-full md:col-span-3"
          >
            Fetch Data
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Total Sales:{" "}
            <span className="text-green-600">Rs.{totalSales.toFixed(2)}</span>
          </h2>
        </form>
       
        <button
          onClick={downloadPDF}
          className="mb-6 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition shadow-lg"
        >
          Download PDF
        </button>

       
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                  Date
                </th>
                <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                  Thread Type
                </th>
                <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                  Quantity
                </th>
                <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                  Kgs
                </th>
                <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                  Price per Kg
                </th>
                <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => {
                  const groupedThreads = groupAndSumThreads(invoice); 

                  return groupedThreads.map((thread, index) => (
                    <tr key={`${invoice._id}-${index}`}>
                      {index === 0 && (
                        <>
                          <td
                            className="py-3 px-4 border-b text-center border border-gray-300"
                            rowSpan={groupedThreads.length}
                          >
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                        </>
                      )}
                      <td className="py-3 px-4 border-b text-center border border-gray-300">
                        {thread.threadType}
                      </td>
                      <td className="py-3 px-4 border-b text-center border border-gray-300">
                        {thread.quantity}
                      </td>
                      <td className="py-3 px-4 border-b text-center border border-gray-300">
                        {thread.kgs}
                      </td>
                      <td className="py-3 px-4 border-b text-center border border-gray-300">
                        ₹ {thread.pricePerKg}
                      </td>
                      <td className="py-3 px-4 border-b text-center border border-gray-300">
                        ₹ {thread.total.toFixed(2)}
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-2 text-center border border-gray-300"
                  >
                    No invoices found
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

export default FirmWiseSellingReport;
