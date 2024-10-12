import React, { useState, useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';

const UniformPriceCalculator = () => {
  const axiosInstance = MyAxiosInstance();

  const [priceData, setPriceData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedPrintArea, setSelectedPrintArea] = useState('');
  const [selectedPrintMethod, setSelectedPrintMethod] = useState('');
  const [printLength, setPrintLength] = useState(7); // Default to min print length
  const [quantity, setQuantity] = useState(1);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  // Hardcoded value for print length rate
  const PRINT_LENGTH_RATE = 0.25;

  const getPriceRange = (data) => {
    if (!data) return [0, 0]; // Default to [0, 0] if data is undefined
    const range = data.find(
      (r) => quantity >= parseInt(r.minQty) && quantity <= parseInt(r.maxQty)
    );
    return range ? [parseFloat(range.minPrice), parseFloat(range.maxPrice)] : [0, 0];
  };

  const calculatePrice = () => {
    if (!selectedSize || !selectedMaterial || !selectedPrintArea || !selectedPrintMethod || quantity <= 0) {
      alert('Please select all options and enter a valid quantity.');
      return;
    }

    const sizeData = priceData?.size[selectedSize] || [];
    const materialData = priceData?.material[selectedMaterial] || [];
    const printAreaData = priceData?.printArea[selectedPrintArea] || [];
    const printMethodData = priceData?.printMethod[selectedPrintMethod] || [];

    const sizePrice = getPriceRange(sizeData);
    const materialPrice = getPriceRange(materialData);
    const printAreaPrice = getPriceRange(printAreaData);
    const printMethodPrice = getPriceRange(printMethodData);

    const extraPrintLength = selectedPrintArea === 'plain' ? 0 : Math.max(0, printLength - 7);
    const printLengthCost = extraPrintLength * PRINT_LENGTH_RATE;

    const pricePerUniformMin =
      sizePrice[0] + materialPrice[0] + printAreaPrice[0] + printMethodPrice[0] + printLengthCost;
    const pricePerUniformMax =
      sizePrice[1] + materialPrice[1] + printAreaPrice[1] + printMethodPrice[1] + printLengthCost;

    setTotalMinPrice((pricePerUniformMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerUniformMax * quantity).toFixed(2));
  };

  const handlePrintAreaChange = (e) => {
    const selectedArea = e.target.value;
    setSelectedPrintArea(selectedArea);
    setPrintLength(selectedArea === 'plain' ? 0 : 7);
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axiosInstance.get('/getUniformRates');
        if (response.data.success) {
          setPriceData(response.data.data[0].data);
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
        <h2 className="text-xl font-bold mb-4">Uniform Price Calculator</h2>

        {priceData && (
          <>
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

            {/* Material Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Material</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                required
              >
                <option value="">Select Material</option>
                {Object.keys(priceData.material).map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            {/* Print Area Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Print Area</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
                value={selectedPrintArea}
                onChange={handlePrintAreaChange}
                required
              >
                <option value="">Select Print Area</option>
                {Object.keys(priceData.printArea).map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Print Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Print Method</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
                value={selectedPrintMethod}
                onChange={(e) => setSelectedPrintMethod(e.target.value)}
                required
              >
                <option value="">Select Print Method</option>
                {Object.keys(priceData.printMethod).map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Print Length Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Print Length (cm) (Min: 7 cm)
              </label>
              <input
                type="number"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                value={printLength}
                onChange={(e) => setPrintLength(parseInt(e.target.value, 10))}
                required
                min="7"
                readOnly={selectedPrintArea === 'plain'}
              />
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
                selectedSize &&
                selectedMaterial &&
                selectedPrintArea &&
                selectedPrintMethod &&
                quantity > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={
                !selectedSize ||
                !selectedMaterial ||
                !selectedPrintArea ||
                !selectedPrintMethod ||
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
          </>
        )}
      </div>
    </div>
  );
};

export default UniformPriceCalculator;
