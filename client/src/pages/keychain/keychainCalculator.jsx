import React, { useState, useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';

const KeychainPriceCalculator = () => {
  const axiosInstance = MyAxiosInstance();

  // Hardcoded price data with different ranges
  const [priceData, setPriceData] = useState({
    material: {
      metal: { '1-99': [3, 4], '100-499': [2.5, 3.5], '500+': [2, 3] },
      leather: { '1-99': [4, 5], '100-499': [3.5, 4.5], '500+': [3, 4] },
      plastic: { '1-99': [2, 3], '100-499': [1.5, 2.5], '500+': [1, 2] },
      silicon: { '1-99': [2.5, 3.5], '100-499': [2, 3], '500+': [1.5, 2.5] },
      wooden: { '1-99': [3, 4], '100-499': [2.5, 3.5], '500+': [2, 3] },
      acrylic: { '1-99': [3.5, 4.5], '100-499': [3, 4], '500+': [2.5, 3.5] },
      'full custom': { '1-99': [5, 6], '100-499': [4.5, 5.5], '500+': [4, 5] },
      special: { '1-99': [6, 7], '100-499': [5.5, 6.5], '500+': [5, 6] },
    },
    printing: {
      'one side': { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.5, 1] },
      'both side': { '1-99': [2, 2.5], '100-499': [1.5, 2], '500+': [1, 1.5] },
    },
    printType: {
      epoxy: { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.5, 1] },
      'uv print': { '1-99': [2, 2.5], '100-499': [1.8, 2.3], '500+': [1.5, 2] },
      engrave: { '1-99': [3, 3.5], '100-499': [2.5, 3], '500+': [2, 2.5] },
      embossing: { '1-99': [4, 4.5], '100-499': [3.8, 4.2], '500+': [3.5, 4] },
      'without branding': { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
    },
    shape: {
      square: { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.5, 1] },
      rectangle: { '1-99': [2, 2.5], '100-499': [1.5, 2], '500+': [1, 1.5] },
      round: { '1-99': [1.8, 2.2], '100-499': [1.5, 1.8], '500+': [1, 1.2] },
      custom: { '1-99': [3, 4], '100-499': [2.5, 3.5], '500+': [2, 3] },
    },
  });

  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedPrinting, setSelectedPrinting] = useState('');
  const [selectedPrintType, setSelectedPrintType] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  const getPriceRange = (data) => {
    if (!data) return [0, 0];
  
    // Handle ranges with the "+" suffix (e.g., "500+")
    const key = Object.keys(data).find((range) => {
      if (range.includes('+')) {
        const min = parseInt(range.replace('+', ''), 10);
        return quantity >= min;
      } else {
        const [min, max] = range.split('-').map(Number);
        return quantity >= min && quantity <= max;
      }
    });
  
    return data[key] || [0, 0];
  };
  

  const calculatePrice = () => {
    if (!selectedMaterial || !selectedPrinting || !selectedPrintType || !selectedShape || quantity <= 0) {
      alert('Please select all options and enter a valid quantity.');
      return;
    }

    const materialPrice = getPriceRange(priceData.material[selectedMaterial]);
    const printingPrice = getPriceRange(priceData.printing[selectedPrinting]);
    const printTypePrice = getPriceRange(priceData.printType[selectedPrintType]);
    const shapePrice = getPriceRange(priceData.shape[selectedShape]);

    const pricePerKeychainMin =
      materialPrice[0] + printingPrice[0] + printTypePrice[0] + shapePrice[0];
    const pricePerKeychainMax =
      materialPrice[1] + printingPrice[1] + printTypePrice[1] + shapePrice[1];

    setTotalMinPrice((pricePerKeychainMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerKeychainMax * quantity).toFixed(2));
  };

     // Fetch price data when the component mounts
     useEffect(() => {
        const fetchPriceData = async () => {
          try {
            const response = await axiosInstance.get('/getKeychainRates');
            if (response.data.success) {
              // Assuming the data returned from the server is in the required format
            //   if(response.data.data.length>0)
            //   {
            //     setUpdate(true)
            //   }
    
            //   setId(response.data.data[0]._id)
            console.log(response.data.data[0].data)
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
        <h2 className="text-xl font-bold mb-4">Keychain Price Calculator</h2>

        {/* Material Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Material</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Select Material</option>
            {Object.keys(priceData.material).map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        {/* Printing Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Printing</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedPrinting}
            onChange={(e) => setSelectedPrinting(e.target.value)}
          >
            <option value="">Select Printing</option>
            {Object.keys(priceData.printing).map((printing) => (
              <option key={printing} value={printing}>{printing}</option>
            ))}
          </select>
        </div>

        {/* Print Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Print Type</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedPrintType}
            onChange={(e) => setSelectedPrintType(e.target.value)}
          >
            <option value="">Select Print Type</option>
            {Object.keys(priceData.printType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Shape Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Shape</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
          >
            <option value="">Select Shape</option>
            {Object.keys(priceData.shape).map((shape) => (
              <option key={shape} value={shape}>{shape}</option>
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
            min="1"
            required
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculatePrice}
          className={`mt-4 px-4 py-2 text-white rounded-md w-full ${
            selectedMaterial &&
            selectedPrinting &&
            selectedPrintType &&
            selectedShape &&
            quantity > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={
            !selectedMaterial ||
            !selectedPrinting ||
            !selectedPrintType ||
            !selectedShape ||
            quantity <= 0
          }
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

export default KeychainPriceCalculator;
