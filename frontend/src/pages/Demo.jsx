// import React, { useState, useEffect, useRef } from 'react';
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';

// const companies = [
//     { value: 'firm1', label: 'Firm 1' },
//     { value: 'firm2', label: 'Firm 2' },
//     { value: 'firm3', label: 'Firm 3' },
//     { value: 'firm4', label: 'Firm 4' },
//     { value: 'firm5', label: 'Firm 5' },
//     { value: 'firm6', label: 'Firm 6' },
//     { value: 'firm7', label: 'Firm 7' },
//     { value: 'firm8', label: 'Firm 8' },
// ];

// const threads = [
//   { value: 'color1', label: 'Color 1' },
//   { value: 'color2', label: 'Color 2' },
//   { value: 'color3', label: 'Color 3' },
//   { value: 'color4', label: 'Color 4' },
//   { value: 'color5', label: 'Color 5' },
//   { value: 'color6', label: 'Color 6' },
//   { value: 'color7', label: 'Color 7' },
//   { value: 'color8', label: 'Color 8' },
// ];

// const GenerateInvoice = () => {
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedThread, setSelectedThread] = useState(null);
//     const [quantity, setQuantity] = useState('');
//     const [weight, setWeight] = useState('');
//     const [pricePerKg, setPricePerKg] = useState('');
//     const [total, setTotal] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default date to today's date
//     const [items, setItems] = useState([]);

//     const companyRef = useRef(null);
//     const threadRef = useRef(null);
//     const quantityRef = useRef(null);
//     const weightRef = useRef(null);
//     const priceRef = useRef(null);
//     const dateRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (companyRef.current) {
//             companyRef.current.focus();
//         }
//     }, []);

//     const handleKeyDown = (e, nextRef) => {
//         if (e.key === 'Enter') {
//             if (nextRef.current) {
//                 nextRef.current.focus();
//             }
//         }
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     const handleSaveAndClear = () => {
//         const newItem = {
//             date,
//             company: selectedCompany?.label || '',
//             thread: selectedThread?.label || '',
//             quantity,
//             weight,
//             pricePerKg,
//             total,
//         };
//         const savedData = localStorage.getItem('invoiceData');
//         const invoiceList = savedData ? JSON.parse(savedData) : [];
//         invoiceList.push(newItem);
//         localStorage.setItem('invoiceData', JSON.stringify(invoiceList));

//         // Clear form
//         setSelectedCompany(null);
//         setSelectedThread(null);
//         setQuantity('');
//         setWeight('');
//         setPricePerKg('');
//         setTotal('');
//         setDate(new Date().toISOString().split('T')[0]); // Reset date to today's date

//         // Redirect to SavedInvoice page
//         navigate('/saved');
//     };

//     useEffect(() => {
//         if (quantity && weight && pricePerKg) {
//             setTotal(Number(weight) * Number(pricePerKg));
//         }
//     }, [quantity, weight, pricePerKg]);

//     return (
//         <div className='p-5'>
//             <div className='flex flex-col gap-4'>
//                 <div className='flex gap-2'>
//                     <label>Date:</label>
//                     <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         ref={dateRef}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <h2>Select a Company:</h2>
//                     <Select
//                         value={selectedCompany}
//                         onChange={setSelectedCompany}
//                         options={companies}
//                         placeholder="Type to search company"
//                         ref={companyRef}
//                         onKeyDown={(e) => handleKeyDown(e, threadRef)}
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <h2>Select Thread:</h2>
//                     <Select
//                         value={selectedThread}
//                         onChange={setSelectedThread}
//                         options={threads}
//                         placeholder="Type to search thread"
//                         ref={threadRef}
//                         onKeyDown={(e) => handleKeyDown(e, quantityRef)}
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Quantity:</label>
//                     <input
//                         type="number"
//                         value={quantity}
//                         onChange={(e) => setQuantity(e.target.value)}
//                         ref={quantityRef}
//                         onKeyDown={(e) => handleKeyDown(e, weightRef)}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Weight (Kgs):</label>
//                     <input
//                         type="number"
//                         value={weight}
//                         onChange={(e) => setWeight(e.target.value)}
//                         ref={weightRef}
//                         onKeyDown={(e) => handleKeyDown(e, priceRef)}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Price per Kg:</label>
//                     <input
//                         type="number"
//                         value={pricePerKg}
//                         onChange={(e) => setPricePerKg(e.target.value)}
//                         ref={priceRef}
//                         onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleSaveAndClear();
//                             }
//                         }}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='my-4'>
//                     <table className="min-w-full bg-white border border-gray-200">
//                         <thead>
//                             <tr>
//                                 <th className="border px-4 py-2">Date</th>
//                                 <th className="border px-4 py-2">Thread Type</th>
//                                 <th className="border px-4 py-2">Quantity</th>
//                                 <th className="border px-4 py-2">Weight (Kgs)</th>
//                                 <th className="border px-4 py-2">Price per Kg</th>
//                                 <th className="border px-4 py-2">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedThread && (
//                                 <tr>
//                                     <td className="border px-4 py-2">{date}</td>
//                                     <td className="border px-4 py-2">{selectedThread.label}</td>
//                                     <td className="border px-4 py-2">{quantity}</td>
//                                     <td className="border px-4 py-2">{weight}</td>
//                                     <td className="border px-4 py-2">{pricePerKg}</td>
//                                     <td className="border px-4 py-2">{total}</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className='flex gap-4'>
//                     <button
//                         onClick={handlePrint}
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                     >
//                         Print
//                     </button>
//                     <button
//                         onClick={handleSaveAndClear}
//                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
//                     >
//                         Save & Clear
//                     </button>
//                 </div>

//                 <button
//                     onClick={() => navigate('/')}
//                     className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mt-4"
//                 >
//                     Go to Home
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default GenerateInvoice;














// // ready 
// import React, { useState, useEffect, useRef } from 'react';
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';

// const companies = [
//     { value: 'firm1', label: 'Firm 1' },
//     { value: 'firm2', label: 'Firm 2' },
//     { value: 'firm3', label: 'Firm 3' },
//     { value: 'firm4', label: 'Firm 4' },
//     { value: 'firm5', label: 'Firm 5' },
//     { value: 'firm6', label: 'Firm 6' },
//     { value: 'firm7', label: 'Firm 7' },
//     { value: 'firm8', label: 'Firm 8' },
// ];

// const threads = [
//   { value: 'color1', label: 'Color 1' },
//   { value: 'color2', label: 'Color 2' },
//   { value: 'color3', label: 'Color 3' },
//   { value: 'color4', label: 'Color 4' },
//   { value: 'color5', label: 'Color 5' },
//   { value: 'color6', label: 'Color 6' },
//   { value: 'color7', label: 'Color 7' },
//   { value: 'color8', label: 'Color 8' },
// ];

// const GenerateInvoice = () => {
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedThread, setSelectedThread] = useState(null);
//     const [quantity, setQuantity] = useState('');
//     const [weight, setWeight] = useState('');
//     const [pricePerKg, setPricePerKg] = useState('');
//     const [total, setTotal] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default date to today's date
//     const [items, setItems] = useState([]);

//     const companyRef = useRef(null);
//     const threadRef = useRef(null);
//     const quantityRef = useRef(null);
//     const weightRef = useRef(null);
//     const priceRef = useRef(null);
//     const dateRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (companyRef.current) {
//             companyRef.current.focus();
//         }
//     }, []);

//     const handleKeyDown = (e, nextRef) => {
//         if (e.key === 'Enter') {
//             if (nextRef.current) {
//                 nextRef.current.focus();
//             }
//         }
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     const handleSaveAndClear = () => {
//         const newItem = {
//             date,
//             company: selectedCompany?.label || '',
//             thread: selectedThread?.label || '',
//             quantity,
//             weight,
//             pricePerKg,
//             total,
//         };
//         const savedData = localStorage.getItem('invoiceData');
//         const invoiceList = savedData ? JSON.parse(savedData) : [];
//         invoiceList.push(newItem);
//         localStorage.setItem('invoiceData', JSON.stringify(invoiceList));

//         // Clear form
//         setSelectedCompany(null);
//         setSelectedThread(null);
//         setQuantity('');
//         setWeight('');
//         setPricePerKg('');
//         setTotal('');
//         setDate(new Date().toISOString().split('T')[0]); // Reset date to today's date

//         // Redirect to SavedInvoice page
//         navigate('/saved');
//     };

//     useEffect(() => {
//         if (quantity && weight && pricePerKg) {
//             setTotal(Number(weight) * Number(pricePerKg));
//         }
//     }, [quantity, weight, pricePerKg]);

//     return (
//         <div className='p-5 text-center'>
//             <div className='flex flex-col gap-4'>
//                 <div className='flex gap-2'>
//                     <label>Date:</label>
//                     <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         ref={dateRef}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <h2>Select a Company:</h2>
//                     <Select
//                         value={selectedCompany}
//                         onChange={setSelectedCompany}
//                         options={companies}
//                         placeholder="Type to search company"
//                         ref={companyRef}
//                         onKeyDown={(e) => handleKeyDown(e, threadRef)}
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <h2>Select Thread:</h2>
//                     <Select
//                         value={selectedThread}
//                         onChange={setSelectedThread}
//                         options={threads}
//                         placeholder="Type to search thread"
//                         ref={threadRef}
//                         onKeyDown={(e) => handleKeyDown(e, quantityRef)}
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Quantity:</label>
//                     <input
//                         type="number"
//                         value={quantity}
//                         onChange={(e) => setQuantity(e.target.value)}
//                         ref={quantityRef}
//                         onKeyDown={(e) => handleKeyDown(e, weightRef)}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Weight (Kgs):</label>
//                     <input
//                         type="number"
//                         value={weight}
//                         onChange={(e) => setWeight(e.target.value)}
//                         ref={weightRef}
//                         onKeyDown={(e) => handleKeyDown(e, priceRef)}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Price per Kg:</label>
//                     <input
//                         type="number"
//                         value={pricePerKg}
//                         onChange={(e) => setPricePerKg(e.target.value)}
//                         ref={priceRef}
//                         onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleSaveAndClear();
//                             }
//                         }}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 {/* Billing Details */}
//                 <div className='my-4'>
//                     <h2 className='text-xl font-bold'>Billing Details</h2>
//                     <p>Date: {date}</p>
//                     <p>Company: {selectedCompany?.label}</p>
//                 </div>

//                 {/* Invoice Table */}
//                 <div className='my-4'>
//                     <table className="min-w-full bg-white border border-gray-200">
//                         <thead>
//                             <tr>
//                                 <th className="border px-4 py-2">Thread Type</th>
//                                 <th className="border px-4 py-2">Quantity</th>
//                                 <th className="border px-4 py-2">Weight (Kgs)</th>
//                                 <th className="border px-4 py-2">Price per Kg</th>
//                                 <th className="border px-4 py-2">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedThread && (
//                                 <tr>
//                                     <td className="border px-4 py-2">{selectedThread.label}</td>
//                                     <td className="border px-4 py-2">{quantity}</td>
//                                     <td className="border px-4 py-2">{weight}</td>
//                                     <td className="border px-4 py-2">{pricePerKg}</td>
//                                     <td className="border px-4 py-2">{total}</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Buttons */}
//                 <div className='flex gap-4'>
//                     <button
//                         onClick={handlePrint}
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                     >
//                         Print
//                     </button>
//                     <button
//                         onClick={handleSaveAndClear}
//                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
//                     >
//                         Save & Clear
//                     </button>
//                 </div>

//                 <button
//                     onClick={() => navigate('/')}
//                     className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mt-4"
//                 >
//                     Go to Home
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default GenerateInvoice;















// // ready 2
// import React, { useState, useEffect, useRef } from 'react';
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';
// import '../App.css'

// const companies = [
//     { value: 'firm1', label: 'Firm 1' },
//     { value: 'firm2', label: 'Firm 2' },
//     { value: 'firm3', label: 'Firm 3' },
//     { value: 'firm4', label: 'Firm 4' },
//     { value: 'firm5', label: 'Firm 5' },
//     { value: 'firm6', label: 'Firm 6' },
//     { value: 'firm7', label: 'Firm 7' },
//     { value: 'firm8', label: 'Firm 8' },
// ];

// const threads = [
//   { value: 'color1', label: 'Color 1' },
//   { value: 'color2', label: 'Color 2' },
//   { value: 'color3', label: 'Color 3' },
//   { value: 'color4', label: 'Color 4' },
//   { value: 'color5', label: 'Color 5' },
//   { value: 'color6', label: 'Color 6' },
//   { value: 'color7', label: 'Color 7' },
//   { value: 'color8', label: 'Color 8' },
// ];

// const GenerateInvoice = () => {
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedThread, setSelectedThread] = useState(null);
//     const [quantity, setQuantity] = useState('');
//     const [weight, setWeight] = useState('');
//     const [pricePerKg, setPricePerKg] = useState('');
//     const [total, setTotal] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default date to today's date
//     const [items, setItems] = useState([]);

//     const companyRef = useRef(null);
//     const threadRef = useRef(null);
//     const quantityRef = useRef(null);
//     const weightRef = useRef(null);
//     const priceRef = useRef(null);
//     const dateRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (companyRef.current) {
//             companyRef.current.focus();
//         }
//     }, []);

//     const handleKeyDown = (e, nextRef) => {
//         if (e.key === 'Enter') {
//             if (nextRef.current) {
//                 nextRef.current.focus();
//             }
//         }
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     const handleSaveAndClear = () => {
//         const newItem = {
//             date,
//             company: selectedCompany?.label || '',
//             thread: selectedThread?.label || '',
//             quantity,
//             weight,
//             pricePerKg,
//             total,
//         };
//         const savedData = localStorage.getItem('invoiceData');
//         const invoiceList = savedData ? JSON.parse(savedData) : [];
//         invoiceList.push(newItem);
//         localStorage.setItem('invoiceData', JSON.stringify(invoiceList));

//         // Clear form
//         setSelectedCompany(null);
//         setSelectedThread(null);
//         setQuantity('');
//         setWeight('');
//         setPricePerKg('');
//         setTotal('');
//         setDate(new Date().toISOString().split('T')[0]); // Reset date to today's date

//         // Redirect to SavedInvoice page
//         navigate('/saved');
//     };

//     useEffect(() => {
//         if (quantity && weight && pricePerKg) {
//             setTotal(Number(weight) * Number(pricePerKg));
//         }
//     }, [quantity, weight, pricePerKg]);

//     return (
//         <div className='p-5'>
//             <div className='flex flex-col gap-4'>
//                 <div className='flex gap-2'>
//                     <label>Date:</label>
//                     <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         ref={dateRef}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <h2>Select a Company:</h2>
//                     <Select
//                         value={selectedCompany}
//                         onChange={setSelectedCompany}
//                         options={companies}
//                         placeholder="Type to search company"
//                         ref={companyRef}
//                         onKeyDown={(e) => handleKeyDown(e, threadRef)}
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <h2>Select Thread:</h2>
//                     <Select
//                         value={selectedThread}
//                         onChange={setSelectedThread}
//                         options={threads}
//                         placeholder="Type to search thread"
//                         ref={threadRef}
//                         onKeyDown={(e) => handleKeyDown(e, quantityRef)}
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Quantity:</label>
//                     <input
//                         type="number"
//                         value={quantity}
//                         onChange={(e) => setQuantity(e.target.value)}
//                         ref={quantityRef}
//                         onKeyDown={(e) => handleKeyDown(e, weightRef)}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Weight (Kgs):</label>
//                     <input
//                         type="number"
//                         value={weight}
//                         onChange={(e) => setWeight(e.target.value)}
//                         ref={weightRef}
//                         onKeyDown={(e) => handleKeyDown(e, priceRef)}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className='flex gap-2'>
//                     <label>Price per Kg:</label>
//                     <input
//                         type="number"
//                         value={pricePerKg}
//                         onChange={(e) => setPricePerKg(e.target.value)}
//                         ref={priceRef}
//                         onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleSaveAndClear();
//                             }
//                         }}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 {/* Billing Details */}
//                 <div className='my-4'>
//                     <h2 className='text-xl font-bold'>Billing Details</h2>
//                     <p>Date: {date}</p>
//                     <p>Company: {selectedCompany?.label}</p>
//                 </div>

//                 {/* Invoice Table */}
//                 <div className='my-4'>
//                     <table className="min-w-full bg-white border border-gray-200">
//                         <thead>
//                             <tr>
//                                 <th className="border px-4 py-2">Thread Type</th>
//                                 <th className="border px-4 py-2">Quantity</th>
//                                 <th className="border px-4 py-2">Weight (Kgs)</th>
//                                 <th className="border px-4 py-2">Price per Kg</th>
//                                 <th className="border px-4 py-2">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedThread && (
//                                 <tr>
//                                     <td className="border px-4 py-2">{selectedThread.label}</td>
//                                     <td className="border px-4 py-2">{quantity}</td>
//                                     <td className="border px-4 py-2">{weight}</td>
//                                     <td className="border px-4 py-2">{pricePerKg}</td>
//                                     <td className="border px-4 py-2">{total}</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Buttons */}
//                 <div className='flex gap-4'>
//                     <button
//                         onClick={handlePrint}
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 no-print"
//                         style={{ display: 'inline-block' }}
//                     >
//                         Print
//                     </button>
//                     <button
//                         onClick={handleSaveAndClear}
//                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 no-print"
//                         style={{ display: 'inline-block' }}
//                     >
//                         Save & Clear
//                     </button>
//                 </div>

//                 <button
//                     onClick={() => navigate('/')}
//                     className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mt-4 no-print"
//                     style={{ display: 'inline-block' }}
//                 >
//                     Go to Home
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default GenerateInvoice;

