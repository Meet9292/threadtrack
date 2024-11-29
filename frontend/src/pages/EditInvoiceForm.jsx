import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const EditInvoiceForm = ({ invoice, onClose, onUpdate }) => {
  const [date, setDate] = useState(invoice.date.substr(0, 10));
  const [buyerFirm, setBuyerFirm] = useState(invoice.buyerFirm);
  const [threadType, setThreadType] = useState(invoice.threadType);
  const [quantity, setQuantity] = useState(invoice.quantity);
  const [kgs, setKgs] = useState(invoice.kgs);
  const [pricePerKg, setPricePerKg] = useState(invoice.pricePerKg);
  const [total, setTotal] = useState(invoice.total);
  const [buyerFirmOptions, setBuyerFirmOptions] = useState([]);
  const [threadTypeOptions, setThreadTypeOptions] = useState([]);

  useEffect(() => {
    // Replace with your API calls or static data
    setBuyerFirmOptions([
      { value: 'Firm A', label: 'Firm A' },
      { value: 'Firm B', label: 'Firm B' },
    ]);
    setThreadTypeOptions([
      { value: 'Thread A', label: 'Thread A', price: 100 },
      { value: 'Thread B', label: 'Thread B', price: 150 },
    ]);
  }, []);

  useEffect(() => {
    const selectedThread = threadTypeOptions.find(option => option.value === threadType);
    if (selectedThread) {
      setPricePerKg(selectedThread.price);
      calculateTotal(quantity, selectedThread.price);
    }
  }, [threadType, quantity]);

  const calculateTotal = (quantity, price) => {
    const calculatedKgs = quantity * 0.25; // Assuming each item is 250g
    setKgs(calculatedKgs);
    setTotal(calculatedKgs * price);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedInvoice = {
      date,
      buyerFirm,
      threadType,
      quantity,
      kgs,
      pricePerKg,
      total,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInvoice),
      });

      if (response.ok) {
        onUpdate(); // Refresh the invoice list after update
      } else {
        console.error('Failed to update invoice:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Edit Invoice</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Buyer's Firm Name</label>
            <Select
              options={buyerFirmOptions}
              onChange={(selected) => setBuyerFirm(selected ? selected.value : '')}
              value={buyerFirmOptions.find(option => option.value === buyerFirm)}
              placeholder="Select Firm"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="block text-gray-700">Thread Type</label>
            <Select
              options={threadTypeOptions}
              onChange={(selected) => {
                setThreadType(selected ? selected.value : '');
                setPricePerKg(selected ? selected.price : 0);
              }}
              value={threadTypeOptions.find(option => option.value === threadType)}
              placeholder="Select Thread"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                calculateTotal(e.target.value, pricePerKg);
              }}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Kgs</label>
            <input
              type="text"
              value={kgs}
              readOnly
              className="border p-2 w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price/kg</label>
            <input
              type="number"
              value={pricePerKg}
              onChange={(e) => {
                setPricePerKg(e.target.value);
                calculateTotal(quantity, e.target.value);
              }}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Total</label>
            <input
              type="text"
              value={total}
              readOnly
              className="border p-2 w-full bg-gray-100"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Update Invoice
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded ml-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceForm;
