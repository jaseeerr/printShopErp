import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [pricePerPiece, setPricePerPiece] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [logs, setLogs] = useState([]);
  const [minPerPiece, setMinPerPiece] = useState(0);
  const [maxPerPiece, setMaxPerPiece] = useState(0);
  const [items, setItems] = useState([]); // State to store added items

  const logsEndRef = useRef(null); // Ref for auto-scrolling
  const tableRef = useRef(null); // Ref for the table to be captured as image

  // Price data for "Normal Card, 350gsm, Digital Print"
  const priceData = {
    'Normal Card, 350gsm, Digital Print': [
      { mq:100,minQty: 1, maxQty: 199, priceRange: [0.7, 0.8] },
      { mq:100,minQty: 200, maxQty: 499, priceRange: [0.6, 0.7] },
      { mq:100,minQty: 500, maxQty: 999, priceRange: [0.4, 0.46] },
      { mq:100,minQty: 1000, maxQty: Infinity, priceRange: [0.29, 0.32] },
    ],
    'Ice Silver B.Card (4 colours, one side)': [
      { mq:100,minQty: 1, maxQty: 199, priceRange: [0.85, 0.85] },
      { mq:100,minQty: 200, maxQty: 499, priceRange: [0.7, 0.7] },
      { mq:100,minQty: 500, maxQty: 999, priceRange: [0.38, 0.38] },
      { mq:100,minQty: 1000, maxQty: Infinity, priceRange: [0.29, 0.29] },
    ],
    'Set B.Card': [
      { mq:1000,minQty: 1, maxQty: Infinity, priceRange: [0.09, 0.12] },
    ],
    'UV B.Card, 350gsm, both side lamination': [
      { mq:1000,minQty: 1000, maxQty: Infinity, priceRange: [0.37, 0.39] },
    ],
    'Frosty B.Card (2 colors, 300 gsm)':[
      {mq:200,minQty:1, maxQty: 499, priceRange:[0.95,1]},
      {mq:200,minQty:500, maxQty: 999, priceRange:[0.54,0.54]},
      {mq:200,minQty:1000, maxQty: Infinity, priceRange:[0.39,0.39]}
    ],
    'Frosty B.Card (2 colors, 500 gsm)':[
      {mq:200,minQty:1, maxQty: 499, priceRange:[1.3,1.3]},
      {mq:200,minQty:500, maxQty: 999, priceRange:[0.72,0.72]},
      {mq:200,minQty:1000, maxQty: Infinity, priceRange:[0.48,0.48]},
    ],
    'Special Texture Card':[
      {mq:100,minQty:1, maxQty: 199, priceRange:[1.2,1.2]},
      {mq:100,minQty:200, maxQty: 499, priceRange:[0.75,0.75]},
      {mq:100,minQty:500, maxQty: 999, priceRange:[0.49,0.49]},
      {mq:100,minQty:1000, maxQty: Infinity, priceRange:[0.36,0.36]},
    ],
    'Special UV Card, 780gsm':[
      {mq:1000,minQty:1, maxQty: Infinity, priceRange:[0.39,0.42]},
    ],
    'PVC Solid Color Screen Printing':[
      {mq:200,minQty:1, maxQty: 499, priceRange:[0.8,0.8]},
      {mq:200,minQty:500, maxQty: 999, priceRange:[0.44,0.44]},
      {mq:200,minQty:1000, maxQty: Infinity, priceRange:[0.28,0.28]},
    ],
    'B.Card with foiling, texture, 2 color':[
      {mq:500,minQty:1, maxQty: 999, priceRange:[0.7,0.7]},
      {mq:500,minQty:1000, maxQty: Infinity, priceRange:[0.475,0.475]},
    ],
    'Both side hard lamination card pouch type':[
      {mq:250,minQty:1, maxQty: Infinity, priceRange:[2.5,2.5]},
    ],
    'Spot UV special card, 350gsm, Digital Printing, Urgent, 2 days':[
      {mq:100,minQty:1, maxQty: 199, priceRange:[2.5,2.5]},
      {mq:100,minQty:200, maxQty: 499, priceRange:[1.625,1.625]},
      {mq:100,minQty:500, maxQty: Infinity, priceRange:[0.78,0.78]},
    ],
    'Spot UV special VIP card, 780gsm, Corner cutting, Velvet Finish, 5-6 days':[
      {mq:500,minQty:1, maxQty: 999, priceRange:[0.78,0.78]},
      {mq:500,minQty:1000, maxQty: Infinity, priceRange:[0.45,0.45]},
    ],
    'PVC card with mat lamination':[
      {mq:100,minQty:1, maxQty: 199, priceRange:[1.6,1.6]},
      {mq:100,minQty:200, maxQty: 499, priceRange:[1.2,1.2]},
      {mq:100,minQty:500, maxQty: 999, priceRange:[0.58,0.58]},
      {mq:100,minQty:1000, maxQty: Infinity, priceRange:[0.38,0.38]},
    ]


  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
    resetValues();
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    setQuantity(qty);
    calculatePriceRange(qty);
  };

  const calculatePriceRange = (qty) => {
    if (selectedItem && qty > 0) {
      const itemPriceData = priceData[selectedItem];
      const range = itemPriceData.find(
        (range) => qty >= range.minQty && qty <= range.maxQty
      );
      if (range) {
        setMinPerPiece(range.priceRange[0]);
        setMaxPerPiece(range.priceRange[1]);
        setPricePerPiece(range.priceRange[1]); // Set minimum as default
        addLog(`Quantity: ${qty} pcs. Price per piece can be between AED ${range.priceRange[0]} - ${range.priceRange[1]}.`);
      } else {
        resetPriceRange();
        addLog(`Quantity: ${qty} pcs. No price range available.`);
      }
    } else {
      resetPriceRange();
    }
  };

  const handlePricePerPieceChange = (e) => {
    const price = parseFloat(e.target.value);
    if (price >= minPerPiece && price <= maxPerPiece) {
      setPricePerPiece(price);
    } else {
      addLog(`Price per piece must be between AED ${minPerPiece} and AED ${maxPerPiece}.`);
    }
  };

  const calculateTotalPrice = (price) => {
    if (price > 0 && quantity > 0) {
      const total = price * quantity;
      setTotalPrice(total.toFixed(2));
      addLog(`Price per piece: AED ${price}, Total Price: AED ${total}`);
    }
  };

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleDownloadImage = () => {
    html2canvas(tableRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'price-table.png';
      link.click();
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = { selectedItem, quantity, pricePerPiece, totalPrice };
    setItems((prevItems) => [...prevItems, newItem]);
    addLog(`Added item: ${selectedItem}, Price per piece: AED ${pricePerPiece}, Quantity: ${quantity}, Total Price: AED ${totalPrice}`);
    resetValues();
  };

  const resetValues = () => {
    setQuantity(100);
    setPricePerPiece(0);
    setTotalPrice(0);
    resetPriceRange();
  };

  const resetPriceRange = () => {
    setMinPerPiece(0);
    setMaxPerPiece(0);
  };

  useEffect(() => {
    if (quantity > 0) {
      calculateTotalPrice(pricePerPiece);
    }
  }, [pricePerPiece, quantity]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Logs Box */}
      <div className="w-full max-w-lg p-6 bg-gray-900 text-white rounded-lg shadow-md mb-6">
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
        </div>
      </div>

      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Price Calculator</h2>
        <form onSubmit={handleAddItem}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Item</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedItem}
              required
              onChange={handleItemChange}
            >
              <option value="">Select Item</option>
              <option value="Normal Card, 350gsm, Digital Print">Normal Card, 350gsm, Digital Print</option>
<option value="Ice Silver B.Card (4 colours, one side)">Ice Silver B.Card (4 colours, one side)</option>
<option value="Set B.Card">Set B.Card</option>
<option value="UV B.Card, 350gsm, both side lamination">UV B.Card, 350gsm, both side lamination</option>
<option value="Frosty B.Card (2 colors, 300 gsm)">Frosty B.Card (2 colors, 300 gsm)</option>
<option value="Frosty B.Card (2 colors, 500 gsm)">Frosty B.Card (2 colors, 500 gsm)</option>
<option value="Special Texture Card">Special Texture Card</option>
<option value="Special UV Card, 780gsm">Special UV Card, 780gsm</option>
<option value="PVC Solid Color Screen Printing">PVC Solid Color Screen Printing</option>
<option value="B.Card with foiling, texture, 2 color">B.Card with foiling, texture, 2 color</option>
<option value="Both side hard lamination card pouch type">Both side hard lamination card pouch type</option>
<option value="Spot UV special card, 350gsm, Digital Printing, Urgent, 2 days">Spot UV special card, 350gsm, Digital Printing, Urgent, 2 days</option>
<option value="Spot UV special VIP card, 780gsm, Corner cutting, Velvet Finish, 5-6 days">Spot UV special VIP card, 780gsm, Corner cutting, Velvet Finish, 5-6 days</option>
<option value="PVC card with mat lamination">PVC card with mat lamination</option>




            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={quantity}
              required
              onChange={handleQuantityChange}
              min="1"
            />
          </div>

          <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Price per Piece | {`AED ${minPerPiece} - AED ${maxPerPiece}`}
  </label>
  <span className="flex">
    <input
      type="number"
      className="mt-1 block w-1/5 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      value={pricePerPiece}
      required
      readOnly
      onChange={(e) => {
        const value = parseFloat(e.target.value);
        if (value >= minPerPiece && value <= maxPerPiece) {
          setPricePerPiece(value);
        }
      }}
      min={minPerPiece}
      max={maxPerPiece}
      step="0.01"
    />
    <button
    type='button'
      onClick={() => {
        const newValue = parseFloat((pricePerPiece - 0.01).toFixed(2));
        if (newValue >= minPerPiece) {
          setPricePerPiece(newValue);
        }
      }}
      className="bg-blue-500 rounded-md px-5 text-white ml-4"
    >
      -
    </button>
    <button
    type='button'
      onClick={() => {
        const newValue = parseFloat((pricePerPiece + 0.01).toFixed(2));
        if (newValue <= maxPerPiece) {
          setPricePerPiece(newValue);
        }
      }}
      className="bg-blue-500 rounded-md px-5 text-white ml-4"
    >
      +
    </button>
  </span>
</div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Total Price: AED {totalPrice}</h3>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Items Table */}
      <div className="w-3/4 p-6 bg-white rounded-lg shadow-md mb-8" ref={tableRef}>
        <h1 className="text-xl font-bold mb-4 text-center">NOTEBOOK ADVERTISING LLC</h1>
        <h3 className="text-xl font-bold mb-4 text-center">PRICE LIST</h3>
        {items.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Item</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price (AED)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.selectedItem}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.totalPrice}</td>
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
  );
};

export default Home;
