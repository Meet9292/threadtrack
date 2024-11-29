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
          price: thread.pricePerKg, 
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

  const calculateTotal = (index) => {
    const updatedThreads = [...threads];
    const quantity = updatedThreads[index].quantity;
    const price = updatedThreads[index].pricePerKg;

    const calculatedKgs = quantity * 0.25; 
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

    calculateTotal(index); 
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
      if (response.status === 200 || response.status === 201) {
        toast.success("Invoice generated successfully!");
        setTimeout(() => {
          navigate("/saved-invoices");
        }, 3000);
      } else {
        toast.error("Error creating invoice: " + response.statusText);
      }
    } catch (error) {
      toast.error("Error during submission: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col mb-4">
          <label className="block text-gray-700 font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col mb-4 overflow-visible">
          {" "}
        
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
            menuPortalTarget={document.body} 
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
                      menuPortalTarget={document.body} 
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={thread.quantity === 0 ? "" : thread.quantity} 
                      onChange={(e) => {
                        let value = e.target.value;

                        
                        if (value.startsWith("0")) {
                          value = value.replace(/^0+/, ""); 
                        }

                        
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
                      onClick={() => handleAddThread(index)} 
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

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleAddThreadType} 
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add New Thread Type
          </button>
        </div>

     
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
