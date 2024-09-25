import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import logo from '../assets/notebooklogo.png';
import MyAxiosInstance from '../../utils/axios';


const Home = () => {
  const axiosInstance = MyAxiosInstance();


  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [pricePerPiece, setPricePerPiece] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [logs, setLogs] = useState([]);
  const [minPerPiece, setMinPerPiece] = useState(0);
  const [maxPerPiece, setMaxPerPiece] = useState(0);
  const [minQty, setMinQty] = useState(0);
  const [items, setItems] = useState([]); // State to store added items

  // State to store priceData fetched from the server
  const [priceData, setPriceData] = useState({});

  const logsEndRef = useRef(null); // Ref for auto-scrolling
  const tableRef = useRef(null); // Ref for the table to be captured as image

  // Fetch price data from MongoDB and update the state
  const fetchPriceData = async () => {
    try {
      const response = await axiosInstance.get('/getBusinessCardItems'); // Replace with your API endpoint
      const dataFromDB = response.data.data;
      
      // Transform data from MongoDB to match the expected structure in priceData
      const transformedData = dataFromDB.reduce((acc, item) => {
        const itemData = item.data.map(range => ({
          mq: range.mq,
          minQty: range.minQty,
          maxQty: range.maxQty,
          priceRange: range.priceRange,
        }));
        acc[item.item] = itemData;
        return acc;
      }, {});

      setPriceData(transformedData);
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };

  // UseEffect to fetch data when the component mounts
  useEffect(() => {
    fetchPriceData();
  }, []);

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
      
      setMinQty(itemPriceData[0].mq);
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
    setQuantity(0);
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

  useEffect(() => {
    if (selectedItem) {
      const itemPriceData = priceData[selectedItem];
      setMinQty(itemPriceData ? itemPriceData[0].mq : 0);
    } else {
      setMinQty(0);
    }
  }, [selectedItem, priceData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Logs Box */}
      {/* <div className="w-full max-w-lg p-6 bg-gray-900 text-white rounded-lg shadow-md mb-6">
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
      </div> */}

      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Business Card Price Calculator</h2>
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
              {Object.keys(priceData).map((itemName) => (
                <option key={itemName} value={itemName}>
                  {itemName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity | Minimum Quantity : {minQty}</label>
            <input
              type="number"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={quantity}
              required
              onChange={handleQuantityChange}
              min={minQty}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Piece | {`AED ${minPerPiece} - AED ${maxPerPiece}`}
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
                type="button"
                onClick={() => {
                  const newValue = parseFloat((pricePerPiece - 0.01).toFixed(2));
                  if (newValue >= minPerPiece) {
                    setPricePerPiece(newValue);
                  }
                }}
                className="bg-blue-500 rounded-md px-3 font-extrabold text-lg text-white ml-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(255,255,255,1)">
                  <path d="M5 11V13H19V11H5Z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  const newValue = parseFloat((pricePerPiece + 0.01).toFixed(2));
                  if (newValue <= maxPerPiece) {
                    setPricePerPiece(newValue);
                  }
                }}
                className="bg-blue-500 rounded-md px-3 font-extrabold text-lg text-white ml-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(255,255,255,1)">
                  <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
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
        <img src={logo} className='mx-auto w-48'  alt="" />
        <h3 className="text-xl font-bold mb-4 text-center mt-3">PRICE LIST</h3>
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
        Download Price List
      </button>
    </div>
  );
};

export default Home;
