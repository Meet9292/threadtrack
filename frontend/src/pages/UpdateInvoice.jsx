// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast, Toaster } from 'react-hot-toast';

// const UpdateInvoice = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [date, setDate] = useState('');
//   const [buyerFirm, setBuyerFirm] = useState(null); // Changed to null for proper Select handling
//   const [threads, setThreads] = useState([]);
//   const [buyerFirmOptions] = useState([
//     { value: 'Firm A', label: 'Firm A' },
//     { value: 'Firm B', label: 'Firm B' },
//     { value: 'Firm C', label: 'Firm C' },
//     { value: 'Firm D', label: 'Firm D' },
//     { value: 'Firm E', label: 'Firm E' },
//     { value: 'Firm F', label: 'Firm F' },
//     { value: 'Firm G', label: 'Firm G' },
//     { value: 'Firm H', label: 'Firm H' },
//     { value: 'Firm I', label: 'Firm I' },
//     { value: 'Firm J', label: 'Firm J' },
//   ]);
//   const [threadTypeOptions] = useState([
//     { value: 'Thread A', label: 'Thread A', price: 200 },
//     { value: 'Thread B', label: 'Thread B', price: 205 },
//     { value: 'Thread C', label: 'Thread C', price: 210 },
//     { value: 'Thread D', label: 'Thread D', price: 215 },
//     { value: 'Thread E', label: 'Thread E', price: 220 },
//     { value: 'Thread F', label: 'Thread F', price: 225 },
//     { value: 'Thread G', label: 'Thread G', price: 230 },
//     { value: 'Thread H', label: 'Thread H', price: 235 },
//     { value: 'Thread I', label: 'Thread I', price: 240 },
//     { value: 'Thread J', label: 'Thread J', price: 245 },
//     { value: 'Thread K', label: 'Thread K', price: 250 },
//     { value: 'Thread L', label: 'Thread L', price: 255 },
//   ]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/invoices/${id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch invoice');
//         }
//         const invoiceData = await response.json();

//         // Set state values based on fetched invoice data
//         setDate(invoiceData.date);
//         setBuyerFirm(buyerFirmOptions.find(option => option.value === invoiceData.buyerFirm) || null); // Set selected option
//         setThreads(invoiceData.threads);
//         calculateTotalAmount(invoiceData.threads);
//       } catch (error) {
//         toast.error('Error fetching invoice: ' + error.message);
//       }
//     };

//     fetchInvoice();
//   }, [id, buyerFirmOptions]);

//   const calculateTotalAmount = (threads) => {
//     const total = threads.reduce((acc, thread) => acc + (thread.total || 0), 0);
//     setTotalAmount(total);
//   };

//   const calculateTotal = (index, quantity, price) => {
//     const calculatedKgs = quantity * 0.25; // Assuming each item weighs 0.25 kg
//     const updatedThreads = [...threads];
//     updatedThreads[index].kgs = calculatedKgs;
//     updatedThreads[index].total = calculatedKgs * price;
//     setThreads(updatedThreads);
//     calculateTotalAmount(updatedThreads);
//   };

//   const handleThreadChange = (index, field, value) => {
//     const updatedThreads = [...threads];
//     if (field === 'threadType') {
//       const selectedThread = threadTypeOptions.find(option => option.value === value);
//       updatedThreads[index].threadType = value;
//       updatedThreads[index].pricePerKg = selectedThread ? selectedThread.price : 0;
//       calculateTotal(index, updatedThreads[index].quantity, updatedThreads[index].pricePerKg);
//     } else {
//       updatedThreads[index][field] = value;
//       if (field === 'quantity') {
//         calculateTotal(index, value, updatedThreads[index].pricePerKg);
//       }
//     }
//     setThreads(updatedThreads);
//   };

//   const handleAddThread = () => {
//     setThreads([...threads, { threadType: '', quantity: 0, kgs: 0, pricePerKg: 0, total: 0 }]);
//   };

//   const handleRemoveThread = (index) => {
//     setThreads(threads.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!buyerFirm || threads.some(t => !t.threadType || t.quantity <= 0)) {
//       toast.error("Please fill in all fields correctly.");
//       return;
//     }

//     setIsLoading(true);
//     const updatedInvoiceData = { date, buyerFirm: buyerFirm.value, threads, totalAmount }; // Use buyerFirm.value

//     try {
//       const response = await fetch(`http://localhost:5000/api/update/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedInvoiceData),
//       });

//       if (response.ok) {
//         toast.success('Invoice updated successfully!');
//         navigate('/saved-invoices');
//       } else {
//         toast.error('Error updating invoice: ' + response.statusText);
//       }
//     } catch (error) {
//       toast.error('Error during submission: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl">
//       <Toaster />
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Invoice</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Date</label>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Buyer's Firm Name</label>
//           <Select
//             options={buyerFirmOptions}
//             onChange={(selected) => setBuyerFirm(selected)} // Set entire selected option
//             value={buyerFirm} // Use the buyerFirm state directly
//             placeholder="Select Firm"
//             className="basic-single"
//             classNamePrefix="select"
//           />
//         </div>

//         {threads.map((thread, index) => (
//           <div key={index} className="space-y-2">
//             <div>
//               <label className="block text-gray-700">Thread Type</label>
//               <Select
//                 options={threadTypeOptions}
//                 onChange={(selected) => handleThreadChange(index, 'threadType', selected ? selected.value : '')}
//                 value={threadTypeOptions.find(option => option.value === thread.threadType) || null} // Ensure value is set
//                 placeholder="Select Thread"
//                 className="basic-single"
//                 classNamePrefix="select"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Quantity</label>
//               <input
//                 type="number"
//                 value={thread.quantity}
//                 onChange={(e) => handleThreadChange(index, 'quantity', Number(e.target.value))}
//                 className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Kgs</label>
//               <input
//                 type="text"
//                 value={thread.kgs}
//                 readOnly
//                 className="border p-3 w-full bg-gray-100 rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Price/kg</label>
//               <input
//                 type="number"
//                 value={thread.pricePerKg}
//                 readOnly
//                 className="border p-3 w-full bg-gray-100 rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Total</label>
//               <input
//                 type="text"
//                 value={thread.total}
//                 readOnly
//                 className="border p-3 w-full bg-gray-100 rounded"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={() => handleRemoveThread(index)}
//               className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300"
//             >
//               Remove Thread
//             </button>
//           </div>
//         ))}
//         <button type="button" onClick={handleAddThread} className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300">
//           Add Another Thread
//         </button>
//         <div className="flex justify-between">
//           <label className="block text-gray-700">Total Amount</label>
//           <input
//             type="text"
//             value={totalAmount}
//             readOnly
//             className="border p-3 w-1/2 bg-gray-100 rounded"
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300" disabled={isLoading}>
//           {isLoading ? 'Updating...' : 'Update Invoice'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateInvoice;

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios"; // Make sure to import axios

const UpdateInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [date, setDate] = useState("");
  const [buyerFirm, setBuyerFirm] = useState(null);
  const [threads, setThreads] = useState([]);
  const [threadTypeOptions, setThreadTypeOptions] = useState([]); // State for thread options
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/invoices/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoice");
        }
        const invoiceData = await response.json();

        // Assuming the invoiceData.date is in 'DD-MMM-YY' format, convert it to 'YYYY-MM-DD'
        const dateParts = invoiceData.date.split("-"); // Split the date string
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearranging to 'YYYY-MM-DD'

        // Set the date and other state values
        setDate(formattedDate); // Set formatted date
        setBuyerFirm({
          value: invoiceData.buyerFirm,
          label: invoiceData.buyerFirm,
        });
        setThreads(invoiceData.threads);
        calculateTotalAmount(invoiceData.threads);
      } catch (error) {
        toast.error("Error fetching invoice: " + error.message);
      }
    };

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

    fetchInvoice();
    fetchThreadTypes();
  }, [id]);

  const calculateTotalAmount = (threads) => {
    const total = threads.reduce((acc, thread) => acc + (thread.total || 0), 0);
    setTotalAmount(total);
  };

  const calculateTotal = (index) => {
    const updatedThreads = [...threads];
    const { quantity, pricePerKg } = updatedThreads[index];
    const calculatedKgs = quantity * 0.25; // Assuming each item weighs 0.25 kg
    updatedThreads[index].kgs = calculatedKgs;
    updatedThreads[index].total = calculatedKgs * pricePerKg;
    setThreads(updatedThreads);
    calculateTotalAmount(updatedThreads);
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
    const updatedThreads = threads.filter((_, i) => i !== index);
    setThreads(updatedThreads);
    calculateTotalAmount(updatedThreads); // Ensure total amount is updated after removal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!buyerFirm || threads.some((t) => !t.threadType || t.quantity <= 0)) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setIsLoading(true);
    const updatedInvoiceData = {
      date,
      buyerFirm: buyerFirm.value,
      threads,
      totalAmount,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInvoiceData),
      });

      if (response.ok) {
        toast.success("Invoice updated successfully!");
        navigate("/saved-invoices");
      } else {
        toast.error("Error updating invoice: " + response.statusText);
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Update Invoice
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Input */}
        <div className="flex flex-col mb-4">
          <label className="block text-gray-700 font-semibold">Date</label>
          <input
            type="date"
            value={date} // This should now be in 'YYYY-MM-DD' format
            onChange={(e) => setDate(e.target.value)}
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Buyer's Firm Name */}
        <div className="flex flex-col mb-4 overflow-visible">
          <label className="block text-gray-700 font-semibold">Buyer's Firm Name</label>
          <Select
            options={[buyerFirm]} // Only one option now
            value={buyerFirm} // Use the buyerFirm state directly
            isDisabled // Make the dropdown read-only
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {/* Table for Thread Details */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-gray-700 font-semibold">Thread Type</th>
                <th className="px-4 py-2 text-gray-700 font-semibold">Quantity</th>
                <th className="px-4 py-2 text-gray-700 font-semibold">Kgs</th>
                <th className="px-4 py-2 text-gray-700 font-semibold">Price/kg</th>
                <th className="px-4 py-2 text-gray-700 font-semibold">Total</th>
                <th className="px-4 py-2 text-gray-700 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {threads.map((thread, index) => (
                <tr key={index} className="bg-gray-50 border-b">
                  <td className="px-4 py-2 overflow-visible">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Thread Button */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleAddThread}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Add Another Thread
          </button>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between mt-4">
          <label className="block text-gray-700 font-semibold">Total Amount</label>
          <input
            type="text"
            value={totalAmount}
            readOnly
            className="border p-3 w-1/2 bg-gray-200 rounded cursor-not-allowed"
          />
        </div>

        {/* Update Invoice Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Invoice"}
          </button>
        </div>
      </form>
    </div>
  );



};

export default UpdateInvoice;
