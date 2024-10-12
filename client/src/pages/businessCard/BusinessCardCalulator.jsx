import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyAxiosInstance from '../../../utils/axios';

const BusinessCardCalculator = () => {
  const axiosInstance = MyAxiosInstance();

  const [priceData, setPriceData] = useState({
    gsm: {},
    lamination: {},
    cutting: {},
    color: {},
    printType: {},
    material: {}, // New material field added
  });

  const [selectedGsm, setSelectedGsm] = useState('');
  const [selectedLamination, setSelectedLamination] = useState('');
  const [selectedCutting, setSelectedCutting] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPrintType, setSelectedPrintType] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  // Calculate total price based on selected options
  const calculatePrice = () => {
    const gsmPrice = priceData.gsm[selectedGsm] || {};
    const materialPrice = priceData.material[selectedMaterial] || {};

    let basePriceRange = [0, 0];

    // Determine base price range based on quantity
    const getPriceRange = (criterion) => {
      return criterion[
        Object.keys(criterion).find((key) => {
          const [min, max] = key.split('-').map(Number);
          return quantity >= min && (max === Infinity || quantity <= max);
        }) || '1-199'
      ] || [0, 0];
    };

    basePriceRange = getPriceRange(gsmPrice);

    const laminationRange = getPriceRange(priceData.lamination[selectedLamination] || {});
    const cuttingRange = getPriceRange(priceData.cutting[selectedCutting] || {});
    const colorRange = getPriceRange(priceData.color[selectedColor] || {});
    const printTypeRange = getPriceRange(priceData.printType[selectedPrintType] || {});
    const materialRange = getPriceRange(materialPrice);

    // Calculate total price range per card
    const pricePerCardMin =
      basePriceRange[0] +
      laminationRange[0] +
      cuttingRange[0] +
      colorRange[0] +
      printTypeRange[0] +
      materialRange[0];

    const pricePerCardMax =
      basePriceRange[1] +
      laminationRange[1] +
      cuttingRange[1] +
      colorRange[1] +
      printTypeRange[1] +
      materialRange[1];

    // Calculate total price range for the quantity
    setTotalMinPrice((pricePerCardMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerCardMax * quantity).toFixed(2));
  };

  // Fetch price data from the database when the component mounts
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axiosInstance.get('/getBusinessCardRates');
        if (response.data.success) {
          setPriceData(response.data.data[0].data); // Assuming the first document contains the required data
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
        <h2 className="text-xl font-bold mb-4">Business Card Price Calculator</h2>

        {/* GSM Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select GSM</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedGsm}
            onChange={(e) => setSelectedGsm(e.target.value)}
            required
          >
            <option value="">Select GSM</option>
            {Object.keys(priceData.gsm).map((gsm) => (
              <option key={gsm} value={gsm}>
                {gsm} GSM
              </option>
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
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>

        {/* Lamination Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Lamination</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedLamination}
            onChange={(e) => setSelectedLamination(e.target.value)}
            required
          >
            <option value="">Select Lamination</option>
            {Object.keys(priceData.lamination).map((lamination) => (
              <option key={lamination} value={lamination}>
                {lamination}
              </option>
            ))}
          </select>
        </div>

        {/* Cutting Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Cutting</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedCutting}
            onChange={(e) => setSelectedCutting(e.target.value)}
            required
          >
            <option value="">Select Cutting</option>
            {Object.keys(priceData.cutting).map((cutting) => (
              <option key={cutting} value={cutting}>
                {cutting}
              </option>
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
              <option key={color} value={color}>
                {color} Color
              </option>
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
            required
          >
            <option value="">Select Print Type</option>
            {Object.keys(priceData.printType).map((printType) => (
              <option key={printType} value={printType}>
                {printType}
              </option>
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
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

export default BusinessCardCalculator;
