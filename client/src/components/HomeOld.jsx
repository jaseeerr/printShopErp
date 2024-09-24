import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import logo from '../assets/notebooklogo1.png'
const Home = () => {
  const [printType, setPrintType] = useState('');
  const [colorType, setColorType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [logs, setLogs] = useState([]); // State to keep track of logs
  const [items, setItems] = useState([]); // State to store added items

  const logsEndRef = useRef(null); // Ref for auto-scrolling
  const tableRef = useRef(null); // Ref for the table to be captured as image

  const prices = {
    UV: {
      '2': { 100: 300, 500: 650, 800: 1200 },
      '3': { 100: 350, 500: 690, 800: 1250 },
      '4': { 100: 310, 500: 750, 800: 1600 },
    },
    Engraved: {
      '2': { 100: 350, 500: 750, 800: 1300 },
      '3': { 100: 350, 500: 750, 800: 1300 },
      '4': { 100: 350, 500: 750, 800: 1300 },
    },
    Transparent: {
      '2': { 100: 450, 500: 850, 800: 1500 },
      '3': { 100: 450, 500: 850, 800: 1500 },
      '4': { 100: 450, 500: 850, 800: 1500 },
    },
  };

  const basePrices = {
    UV: { '2': 0, '3': 1, '4': 2 },
    Engraved: { '2': 4, '3': 5, '4': 6 },
    Transparent: { '2': 7, '3': 8, '4': 9 },
  };

  useEffect(() => {
    handlePriceCalculation();
  }, [printType, colorType, quantity]); // Call this whenever any state changes

  useEffect(() => {
    scrollToBottom(); // Auto-scroll when logs update
  }, [logs]);

  const handlePriceCalculation = () => {
    setLogs([]); // Clear logs for each calculation
    if (printType && colorType && quantity > 0) {
      const selectedPrices = prices[printType][colorType];
      const quantityKey = String(quantity); // Convert quantity to string
      const additionalPrice = basePrices[printType][colorType];

      addLog(`Print Type: ${printType}, Color Type: ${colorType}, Quantity: ${quantity}`);
      addLog(`Quantity Key: ${quantityKey}`);

      if (selectedPrices.hasOwnProperty(quantityKey)) { // Check if key exists
        addLog(`Exact match found for quantity: ${quantityKey}`);
        setPrice(selectedPrices[quantityKey]);
      } else if (quantity <= 100) {
        addLog(`Quantity less than or equal to 100. Calculating price as ${5 + additionalPrice} per piece.`);
        setPrice(quantity * (5 + additionalPrice));
      } else if (quantity > 100 && quantity <= 600) {
        addLog(`Quantity between 101 and 600. Calculating price as ${3.5 + additionalPrice} per piece.`);
        setPrice(quantity * (3.5 + additionalPrice));
      } else {
        addLog(`Quantity above 600. Calculating price as ${2 + additionalPrice} per piece.`);
        setPrice(quantity * (2 + additionalPrice));
      }
    } else {
      addLog('Invalid input. Setting price to 0.');
      setPrice(0);
    }
  };

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10); // Ensure quantity is an integer
    setQuantity(qty);
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddItem = () => {
    if (printType && colorType && quantity > 0 && price > 0) {
      const newItem = { printType, colorType, quantity, price };
      setItems([...items, newItem]);
      addLog(`Added item: ${printType}, ${colorType} Colors, Quantity: ${quantity}, Price: AED ${price}`);
    }
  };

  const handleDownloadImage = () => {
    html2canvas(tableRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'price-table.png';
      link.click();
    });
  };


    // Function to calculate custom prices for all prices table
    const calculatePricePerPiece = (printType, colorType, quantity) => {
      const additionalPrice = basePrices[printType][colorType];
      if (quantity <= 100) {
        return 5 + additionalPrice; // Price per piece for quantities <= 100
      } else if (quantity > 100 && quantity <= 600) {
        return 3.5 + additionalPrice; // Price per piece for quantities between 101 and 600
      } else {
        return 2 + additionalPrice; // Price per piece for quantities > 600
      }
    };

  return (
    <>
    <div className="flex justify-center  items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Price List</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Print Type</th>
              <th className="border px-4 py-2">Color Type</th>
              <th className="border px-4 py-2">100 pcs (AED)</th>
              <th className="border px-4 py-2">500 pcs (AED)</th>
              <th className="border px-4 py-2">800 pcs (AED)</th>
              <th className="border px-4 py-2">Price per piece (1-100 pcs)</th>
              <th className="border px-4 py-2">Price per piece (101-600 pcs)</th>
              <th className="border px-4 py-2">Price per piece (600+ pcs)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(prices).map((printType) =>
              Object.keys(prices[printType]).map((colorType) => (
                <tr key={`${printType}-${colorType}`}>
                  <td className="border px-4 py-2">{printType}</td>
                  <td className="border px-4 py-2">{colorType} Colors</td>
                  {Object.keys(prices[printType][colorType]).map((quantity) => (
                    <td key={quantity} className="border px-4 py-2">
                      {prices[printType][colorType][quantity]}
                    </td>
                  ))}
                  {/* Custom Price Per Piece Calculations */}
                  <td className="border px-4 py-2">
                    {calculatePricePerPiece(printType, colorType, 100)} AED/piece
                  </td>
                  <td className="border px-4 py-2">
                    {calculatePricePerPiece(printType, colorType, 500)} AED/piece
                  </td>
                  <td className="border px-4 py-2">
                    {calculatePricePerPiece(printType, colorType, 800)} AED/piece
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    
    <div className="flex flex-col justify-center flex-wrap items-center mt-8">
      {/* Price Calculator and Logs Section */}
      <div className="flex justify-evenly w-full mb-8">
        {/* Price Calculator Box */}
        <div className="w-1/4 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Price Calculator</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Print Type</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
            >
              <option value="">Select Print Type</option>
              <option value="UV">UV Printing</option>
              <option value="Engraved">Engraved</option>
              <option value="Transparent">Transparent</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Color Type</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={colorType}
              onChange={(e) => setColorType(e.target.value)}
            >
              <option value="">Select Color Type</option>
              <option value="2">2 Colors</option>
              <option value="3">3 Colors</option>
              <option value="4">4 Colors</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={quantity}
              onChange={handleQuantityChange}
              min="0"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Price: AED {price}</h3>
          </div>

          <button
            onClick={handleAddItem}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>

        {/* Logs Box */}
        <div className="w-1/3 p-6 bg-gray-900 text-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Logs</h2>
          <div className="overflow-y-auto h-64">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-2">
                  <span className="text-green-400">Log {index + 1}: </span>
                  {log}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No logs to display</p>
            )}
            {/* Scroll anchor */}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="w-3/4 p-6 bg-white rounded-lg shadow-md mb-8" ref={tableRef} style={{"backgroundColor":"white"}}>
        
        {/* <img src={logo} className='mx-auto w-30' alt="" /> */}
        <h1 className="text-xl font-bold mb-4 text-center">NOTEBOOK ADVERTISING LLC</h1>
        <h3 className="text-xl font-bold mb-4 text-center">PRICE LIST</h3>
        {items.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Print Type</th>
                <th className="border px-4 py-2">Color Type</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price (AED)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.printType}</td>
                  <td className="border px-4 py-2">{item.colorType} Colors</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No items added yet.</p>
        )}
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadImage}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Download Table as Image
      </button>
    </div>
    </>
  );
};

export default Home;
