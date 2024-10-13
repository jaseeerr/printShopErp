import React, { useState, useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';

const FlyerPriceCalculator = () => {
  const axiosInstance = MyAxiosInstance();

  const [priceData, setPriceData] = useState(null); // Initialize with null
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedGsm, setSelectedGsm] = useState('');
  const [selectedLamination, setSelectedLamination] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  const getPriceRange = (data) => {
    if (!data) return [0, 0]; // Default range
  
    const key = Object.keys(data).find((range) => {
      const [min, max] = range.includes('+')
        ? [parseInt(range), Infinity]
        : range.split('-').map(Number);
      return quantity >= min && quantity <= max;
    });
  
    return data[key] || [0, 0]; // Return the found range or [0, 0] if not found
  };

  const calculatePrice = () => {
    if (!selectedSize || !selectedGsm || !selectedLamination || quantity <= 0) {
      alert('Please select all options and enter a valid quantity.');
      return;
    }

    const sizePrice = getPriceRange(priceData?.size[selectedSize]);
    const gsmPrice = getPriceRange(priceData?.gsm[selectedGsm]);
    const laminationPrice = getPriceRange(priceData?.lamination[selectedLamination]);

    const pricePerFlyerMin = sizePrice[0] + gsmPrice[0] + laminationPrice[0];
    const pricePerFlyerMax = sizePrice[1] + gsmPrice[1] + laminationPrice[1];

    setTotalMinPrice((pricePerFlyerMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerFlyerMax * quantity).toFixed(2));
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axiosInstance.get('/getFlyerRates');
        if (response.data.success) {
          setPriceData(response.data.data[0].data);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData();
  }, []);

  if (!priceData) return <div>Loading...</div>; // Show loading state if data is not yet fetched

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Flyer Price Calculator</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Size</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Select Size</option>
            {Object.keys(priceData.size).map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select GSM</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedGsm}
            onChange={(e) => setSelectedGsm(e.target.value)}
          >
            <option value="">Select GSM</option>
            {Object.keys(priceData.gsm).map((gsm) => (
              <option key={gsm} value={gsm}>{gsm} GSM</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Lamination</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedLamination}
            onChange={(e) => setSelectedLamination(e.target.value)}
          >
            <option value="">Select Lamination</option>
            {Object.keys(priceData.lamination).map((lamination) => (
              <option key={lamination} value={lamination}>{lamination}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min="1"
          />
        </div>

        <button
          onClick={calculatePrice}
          className={`mt-4 px-4 py-2 text-white rounded-md w-full ${
            selectedSize && selectedGsm && selectedLamination && quantity > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedSize || !selectedGsm || !selectedLamination || quantity <= 0}
        >
          Calculate Price
        </button>

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

export default FlyerPriceCalculator;
