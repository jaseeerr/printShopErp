import React, { useState,useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';

const BillBookCalculator = () => {
    const axiosInstance = MyAxiosInstance()
    // const priceData = {
    //     size: {
    //       A3: {
    //         '1-99': [10, 15],
    //         '100-499': [9, 14],
    //         '500+': [8, 13],
    //       },
    //       A4: {
    //         '1-99': [7, 12],
    //         '100-499': [6, 11],
    //         '500+': [5, 10],
    //       },
    //       A5: {
    //         '1-99': [5, 8],
    //         '100-499': [4, 7],
    //         '500+': [3, 6],
    //       },
    //       A5: {
    //         '1-99': [5, 8],
    //         '100-499': [4, 7],
    //         '500+': [3, 6],
    //       },
    //     },
    //     copies: {
    //       '0': { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
    //       '1': { '1-99': [2, 3], '100-499': [1.8, 2.8], '500+': [1.5, 2.5] },
    //       '2': { '1-99': [3, 4], '100-499': [2.8, 3.8], '500+': [2.5, 3.5] },
    //       '3': { '1-99': [4, 5], '100-499': [3.8, 4.8], '500+': [3.5, 4.5] },
    //       '4': { '1-99': [5, 6], '100-499': [4.8, 5.8], '500+': [4.5, 5.5] },
    //     },
    //     color: {
    //       '1': { '1-99': [1, 1.5], '100-499': [0.8, 1.3], '500+': [0.5, 1.0] },
    //       '2': { '1-99': [2, 2.5], '100-499': [1.8, 2.3], '500+': [1.5, 2.0] },
    //       '3': { '1-99': [3, 3.5], '100-499': [2.8, 3.3], '500+': [2.5, 3.0] },
    //       '4': { '1-99': [4, 4.5], '100-499': [3.8, 4.3], '500+': [3.5, 4.0] },
    //     },
    //   };
      const [priceData,setPriceData] = useState({
        size: {
          A3: {
            '1-99': [10, 15],
            '100-499': [9, 14],
            '500+': [8, 13],
          },
          A4: {
            '1-99': [7, 12],
            '100-499': [6, 11],
            '500+': [5, 10],
          },
          A5: {
            '1-99': [5, 8],
            '100-499': [4, 7],
            '500+': [3, 6],
          },
          A5: {
            '1-99': [5, 8],
            '100-499': [4, 7],
            '500+': [3, 6],
          },
        },
        copies: {
          '0': { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
          '1': { '1-99': [2, 3], '100-499': [1.8, 2.8], '500+': [1.5, 2.5] },
          '2': { '1-99': [3, 4], '100-499': [2.8, 3.8], '500+': [2.5, 3.5] },
          '3': { '1-99': [4, 5], '100-499': [3.8, 4.8], '500+': [3.5, 4.5] },
          '4': { '1-99': [5, 6], '100-499': [4.8, 5.8], '500+': [4.5, 5.5] },
        },
        color: {
          '1': { '1-99': [1, 1.5], '100-499': [0.8, 1.3], '500+': [0.5, 1.0] },
          '2': { '1-99': [2, 2.5], '100-499': [1.8, 2.3], '500+': [1.5, 2.0] },
          '3': { '1-99': [3, 3.5], '100-499': [2.8, 3.3], '500+': [2.5, 3.0] },
          '4': { '1-99': [4, 4.5], '100-499': [3.8, 4.3], '500+': [3.5, 4.0] },
        },
      })
      
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCopies, setSelectedCopies] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  const getPriceRange = (data) => {
    if (!data) {
      console.error('Data is undefined in getPriceRange');
      return [0, 0]; // Default to [0, 0] if data is undefined
    }
  
    const key = Object.keys(data).find((range) => {
      const [min, max] = range.split('-').map((v) => (v === '+' ? Infinity : parseInt(v, 10)));
  
      // Handle ranges like '500+'
      if (range.includes('+')) {
        return quantity >= min;
      }
      return quantity >= min && quantity <= max;
    });
  
    return data[key] || [0, 0]; // Return the found range or [0, 0] if not found
  };
  

  const calculatePrice = () => {
    if (!selectedSize || !selectedCopies || !selectedColor || quantity <= 0) {
      alert('Please select all options and enter a valid quantity.');
      return;
    }

    const sizePrice = getPriceRange(priceData.size[selectedSize]);
    const copiesPrice = getPriceRange(priceData.copies[selectedCopies]);
    const colorPrice = getPriceRange(priceData.color[selectedColor]);

    const pricePerBookMin = sizePrice[0] + copiesPrice[0] + colorPrice[0];
    const pricePerBookMax = sizePrice[1] + copiesPrice[1] + colorPrice[1];

    setTotalMinPrice((pricePerBookMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerBookMax * quantity).toFixed(2));
  };

      // Fetch price data when the component mounts
      useEffect(() => {
        const fetchPriceData = async () => {
          try {
            const response = await axiosInstance.get('/getBillBookRates');
            if (response.data.success) {
              // Assuming the data returned from the server is in the required format
            //   if(response.data.data.length>0)
            //   {
            //     setUpdate(true)
            //   }
    
            //   setId(response.data.data[0]._id)
              setPriceData(response.data.data[0].data);  // For simplicity, assuming the first document contains the required data
            }
          } catch (error) {
            console.error('Error fetching price data:', error);
          }
        };
    
        fetchPriceData();
      }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Bill Book Price Calculator</h2>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Size</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            required
          >
            <option value="">Select Size</option>
            {Object.keys(priceData.size).map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Copies Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Number of Copies</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedCopies}
            onChange={(e) => setSelectedCopies(e.target.value)}
            required
          >
            <option value="">Select Copies</option>
            {Object.keys(priceData.copies).map((copies) => (
              <option key={copies} value={copies}>{copies} Copies</option>
            ))}
          </select>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Color</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            required
          >
            <option value="">Select Color</option>
            {Object.keys(priceData.color).map((color) => (
              <option key={color} value={color}>{color} Color</option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            required
            min="1"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculatePrice}
          className={`mt-4 px-4 py-2 text-white rounded-md w-full ${
            selectedSize && selectedCopies && selectedColor && quantity > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedSize || !selectedCopies || !selectedColor || quantity <= 0}
        >
          Calculate Price
        </button>

        {/* Total Price Display */}
        {totalMinPrice > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              Total Price: AED {totalMinPrice} - AED {totalMaxPrice}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillBookCalculator;
