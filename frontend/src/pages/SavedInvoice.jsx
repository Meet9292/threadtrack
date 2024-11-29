import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";
import axios from "axios";

const SavedInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/invoices");
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        } else {
          console.error("Failed to fetch invoices:", response.statusText);
          toast.error("Failed to fetch invoices.", { duration: 3000 });
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Error fetching invoices.", { duration: 3000 });
      }
    };

    fetchInvoices();
  }, []);

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

  const deleteInvoice = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setInvoices(invoices.filter((invoice) => invoice._id !== id));
          toast.success("Invoice deleted successfully!", { duration: 3000 });
        } else {
          console.error("Failed to delete invoice:", response.statusText);
          toast.error("Failed to delete invoice.", { duration: 3000 });
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Error deleting invoice.", { duration: 3000 });
      }
    }
  };

  const downloadInvoice = async (invoice) => {
    const doc = new jsPDF();
    const total = invoice.threads
      .reduce((sum, thread) => sum + parseFloat(thread.total), 0)
      .toFixed(2);

    const sellerFirmName = "Shree Ganesh Enterprise";
    const sellerAddress =
      "Factory Address: 169, 170, 171, 1st Floor, Kalathiya Corporation, Part-2, Diamond Nagar, Surat."; // Add your seller's address
    const sellerContactNumber = "+91 98799 82259"; 

    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.text(sellerFirmName, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    doc.setLineWidth(0.5);
    doc.line(10, 25, doc.internal.pageSize.getWidth() - 10, 25);

    doc.setFontSize(12);

    let buyerInfo;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/buyers/${invoice.buyerFirm}`
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

    doc.setFont("times", "normal"); 
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice._id}`, 10, 90);
    doc.text(
      `Invoice Date: ${new Date(invoice.date).toLocaleDateString()}`,
      10,
      100
    );

    doc.setLineWidth(0.5);
    doc.line(10, 110, 200, 110);

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

    const tableData = Object.values(groupedThreads).map((thread) => [
      thread.threadType,
      thread.quantity,
      thread.kgs,
      `Rs. ${thread.pricePerKg}`,
      `Rs. ${thread.total.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [["Thread Type", "Quantity", "Kgs", "Price/kg", "Total"]],
      body: tableData,
      startY: 115,
      styles: {
        font: "times",
        fontSize: 12,
        halign: "center",
      },
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    const totalX = pageWidth - 30;
    const totalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("times", "bold"); 
    doc.text(`Grand Total: Rs. ${total}`, totalX, totalY, { align: "right" });

    const contactY = totalY + 10;
    doc.setFontSize(10);
    doc.setFont("times", "normal"); 
    doc.text(sellerAddress, pageWidth / 2, pageHeight - 25, {
      align: "center",
    });
    doc.text(
      `Seller Contact: ${sellerContactNumber}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );

    doc.save(`Invoice_${invoice._id}.pdf`);
    toast.success("Invoice downloaded as PDF!", { duration: 3000 });
  };

  return (
    <div className="p-4">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Date
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Buyer’s Firm
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Thread Type
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Quantity
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Kgs
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Price per Kg
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Total
            </th>
            <th className="py-2 px-4 border-b text-center border border-gray-300">
              Actions
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
                        className="py-2 px-4 border-b text-center border border-gray-300"
                        rowSpan={groupedThreads.length}
                      >
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td
                        className="py-2 px-4 border-b text-center border border-gray-300"
                        rowSpan={groupedThreads.length}
                      >
                        {invoice.buyerFirm}
                      </td>
                    </>
                  )}
                  <td className="py-2 px-4 border-b text-center border border-gray-300">
                    {thread.threadType}
                  </td>
                  <td className="py-2 px-4 border-b text-center border border-gray-300">
                    {thread.quantity}
                  </td>
                  <td className="py-2 px-4 border-b text-center border border-gray-300">
                    {thread.kgs}
                  </td>
                  <td className="py-2 px-4 border-b text-center border border-gray-300">
                    ₹ {thread.pricePerKg}
                  </td>
                  <td className="py-2 px-4 border-b text-center border border-gray-300">
                    ₹ {thread.total}
                  </td>

                  {index === 0 && (
                    <td
                      className="py-2 px-4 border-b text-center border border-gray-300"
                      rowSpan={groupedThreads.length}
                    >
                      <button
                        onClick={() =>
                          navigate(`/update-invoice/${invoice._id}`)
                        }
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteInvoice(invoice._id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => downloadInvoice(invoice)}
                        className="text-green-500 hover:underline ml-2"
                      >
                        Download
                      </button>
                    </td>
                  )}
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
  );
};

export default SavedInvoice;
