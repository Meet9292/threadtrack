import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [buyerFirm, setBuyerFirm] = useState("");
  const [newBuyerFirm, setNewBuyerFirm] = useState("");
  const [threads, setThreads] = useState([
    { threadType: "", quantity: 0, kgs: 0, pricePerKg: 0, total: 0 },
  ]);
  const [buyerFirmOptions, setBuyerFirmOptions] = useState([]);
  const [threadTypeOptions, setThreadTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch buyer firms and thread types from the database
  useEffect(() => {
    const fetchThreadTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/threads");
        const options = response.data.threadTypes.map((thread) => ({
          value: thread.name,
          label: thread.name,
          price: thread.pricePerKg, // Adjusting based on your structure
        }));
        setThreadTypeOptions(options);
      } catch (error) {
        toast.error("Error fetching thread types: " + error.message);
      }
    };

    const fetchBuyerFirms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/buyers");
        const options = response.data.buyerFirms.map((firm) => ({
          value: firm.name,
          label: firm.name,
        }));
        setBuyerFirmOptions(options);
      } catch (error) {
        toast.error("Error fetching buyer firms: " + error.message);
      }
    };

    fetchBuyerFirms();
    fetchThreadTypes();
  }, []);

  // Calculate total based on quantity and price per kg
  const calculateTotal = (index) => {
    const updatedThreads = [...threads];
    const quantity = updatedThreads[index].quantity;
    const price = updatedThreads[index].pricePerKg;

    const calculatedKgs = quantity * 0.25; // Assuming 1 unit = 0.25 kgs
    updatedThreads[index].kgs = calculatedKgs;
    updatedThreads[index].total = calculatedKgs * price;
    setThreads(updatedThreads);
  };

  const handleThreadChange = (index, field, value) => {
    const updatedThreads = [...threads];

    if (field === "threadType") {
      const selectedThread = threadTypeOptions.find(
        (option) => option.value === value
      );
      updatedThreads[index].threadType = value;
      updatedThreads[index].pricePerKg = selectedThread
        ? selectedThread.price
        : 0;
    } else {
      updatedThreads[index][field] = value;
    }

    calculateTotal(index); // Recalculate total after any field change (including pricePerKg)
    setThreads(updatedThreads);
  };

  const handleAddThread = () => {
    setThreads([
      ...threads,
      { threadType: "", quantity: 0, kgs: 0, pricePerKg: 0, total: 0 },
    ]);
  };

  const handleRemoveThread = (index) => {
    setThreads(threads.filter((_, i) => i !== index));
  };

  // Add new buyer firm to the database
  // const handleAddBuyerFirm = async () => {
  //   if (newBuyerFirm.trim() === "") {
  //     toast.error("Please enter a valid firm name.");
  //     return;
  //   }

  //   const newFirmOption = { value: newBuyerFirm, label: newBuyerFirm };
  //   setBuyerFirmOptions([...buyerFirmOptions, newFirmOption]);
  //   setBuyerFirm(newBuyerFirm);
  //   setNewBuyerFirm("");

  //   try {
  //     await axios.post("http://localhost:5000/api/buyers", {
  //       name: newBuyerFirm,
  //     });
  //     toast.success("New buyer firm added successfully!");
  //   } catch (error) {
  //     toast.error("Error adding new firm: " + error.message);
  //   }
  // };

  const handleAddBuyerFirm = async () => {
    const newFirmName = prompt("Enter firm name:");
    const newOwnerName = prompt("Enter owner name:");
    const newContactInfo = prompt("Enter contact number (10 digits):");
    const newAddress = prompt("Enter address:");

    // Validate required fields
    if (!newFirmName || !newOwnerName || !newContactInfo || !newAddress) {
        toast.error("All fields are required to add a new firm.");
        return;
    }

    // Contact number validation: ensure it's 10 digits and numeric
    const contactNumberPattern = /^[0-9]{10}$/;
    if (!contactNumberPattern.test(newContactInfo)) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
    }

    const newFirmOption = { value: newFirmName, label: newFirmName };
    setBuyerFirmOptions([...buyerFirmOptions, newFirmOption]);
    setBuyerFirm(newFirmName);

    try {
        await axios.post("http://localhost:5000/api/buyers", {
            name: newFirmName,
            ownerName: newOwnerName,
            contactInfo: newContactInfo,
            address: newAddress
        });
        toast.success("New buyer firm added successfully!");
    } catch (error) {
        toast.error("Error adding new firm: " + error.message);
    }
};


  // Add new thread type to the database
  const handleAddThreadType = async () => {
    const newThreadName = prompt("Enter new thread type name:");
    const newThreadPrice = prompt("Enter price per kg:");

    if (newThreadName && newThreadPrice) {
      const newThreadOption = {
        value: newThreadName,
        label: newThreadName,
        price: Number(newThreadPrice),
      };
      setThreadTypeOptions([...threadTypeOptions, newThreadOption]);

      try {
        await axios.post("http://localhost:5000/api/threads", {
          name: newThreadName,
          pricePerKg: Number(newThreadPrice),
        });
        toast.success("New thread type added successfully!");
      } catch (error) {
        toast.error("Error adding new thread type: " + error.message);
      }
    }
  };

  // Submit the invoice data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!buyerFirm || threads.some((t) => !t.threadType || t.quantity <= 0)) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setIsLoading(true);
    const invoiceData = { date, buyerFirm, threads };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/create",
        invoiceData
      );
      // Check for successful status codes
      if (response.status === 200 || response.status === 201) {
        toast.success("Invoice generated successfully!");
        setTimeout(() => {
          navigate("/saved-invoices");
        }, 3000);
      } else {
        // If response is not a success status, show an error
        toast.error("Error creating invoice: " + response.statusText);
      }
    } catch (error) {
      // Show the error message if an error occurs during the request
      toast.error("Error during submission: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  // <div className="flex items-center mt-2">
  //           <input
  //             type="text"
  //             value={newBuyerFirm}
  //             onChange={(e) => setNewBuyerFirm(e.target.value)}
  //             placeholder="Add New Firm Name"
  //             className="border p-2 flex-grow rounded focus:outline-none focus:ring focus:ring-blue-300"
  //           />
  //           <button
  //             type="button"
  //             onClick={handleAddBuyerFirm}
  //             className="ml-2 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300"
  //           >
  //             Add
  //           </button>
  //         </div>

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Input */}
        <div className="flex flex-col mb-4">
          <label className="block text-gray-700 font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>


        

        {/* Buyer's Firm Name */}
        <div className="flex flex-col mb-4 overflow-visible">
          {" "}
          {/* Added overflow-visible class */}
          <label className="block text-gray-700 font-semibold">
            Buyer's Firm Name
          </label>
          <Select
            options={buyerFirmOptions}
            onChange={(selected) =>
              setBuyerFirm(selected ? selected.value : "")
            }
            value={buyerFirmOptions.find(
              (option) => option.value === buyerFirm
            )}
            placeholder="Select Firm"
            menuPortalTarget={document.body} // Using portal for dropdown
            className="basic-single"
            classNamePrefix="select"
          />
          <div className="flex items-center mt-2">
    <button
        type="button"
        onClick={handleAddBuyerFirm}
        className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
    >
        Add Buyer
    </button>
</div>
        </div>

        {/* Table for Thread Details */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-gray-700 font-semibold">
                  Thread Type
                </th>
                <th className="px-4 py-2 text-gray-700 font-semibold">
                  Quantity
                </th>
                <th className="px-4 py-2 text-gray-700 font-semibold">Kgs</th>
                <th className="px-4 py-2 text-gray-700 font-semibold">
                  Price/kg
                </th>
                <th className="px-4 py-2 text-gray-700 font-semibold">Total</th>
                <th className="px-4 py-2 text-gray-700 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {threads.map((thread, index) => (
                <tr key={index} className="bg-gray-50 border-b">
                  <td className="px-4 py-2 overflow-visible">
                    {" "}
                    {/* Added overflow-visible class */}
                    <Select
                      options={threadTypeOptions}
                      onChange={(selected) =>
                        handleThreadChange(
                          index,
                          "threadType",
                          selected ? selected.value : ""
                        )
                      }
                      value={threadTypeOptions.find(
                        (option) => option.value === thread.threadType
                      )}
                      placeholder="Select Thread"
                      menuPortalTarget={document.body} // Using portal for dropdown
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={thread.quantity === 0 ? "" : thread.quantity} // Show empty input if quantity is 0
                      onChange={(e) => {
                        let value = e.target.value;

                        // Remove leading zero
                        if (value.startsWith("0")) {
                          value = value.replace(/^0+/, ""); // Remove leading zeros
                        }

                        // Update the state with the new value, if valid
                        handleThreadChange(
                          index,
                          "quantity",
                          value === "" ? 0 : Number(value)
                        );
                      }}
                      className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter Quantity"
                    />
                  </td>

                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={thread.kgs}
                      readOnly
                      className="border p-3 w-full rounded bg-gray-200 cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={thread.pricePerKg}
                      onChange={(e) =>
                        handleThreadChange(
                          index,
                          "pricePerKg",
                          Number(e.target.value)
                        )
                      }
                      className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter Price Per Kg"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={thread.total}
                      readOnly
                      className="border p-3 w-full rounded bg-gray-200 cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveThread(index)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddThread(index)} // Add entry for another thread of the same type
                      className="ml-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Thread Type Button */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleAddThreadType} // Button to add new thread type in database
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add New Thread Type
          </button>
        </div>

        {/* Generate Invoice Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateInvoice;
