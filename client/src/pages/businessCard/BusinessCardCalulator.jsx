import React, { useState,useEffect } from 'react';
import axios from 'axios';
const BusinessCardCalculator = () => {
  // Updated price data with ranges for different options and quantities
  const [priceData,setPriceData] = useState({
    gsm: {
      '300': { '1-199': [0.3, 0.5], '200-499': [0.28, 0.45], '500-999': [0.25, 0.40], '1000+': [0.20, 0.35] },
      '350': { '1-199': [0.35, 0.55], '200-499': [0.32, 0.48], '500-999': [0.30, 0.42], '1000+': [0.25, 0.38] },
      '400': { '1-199': [0.40, 0.60], '200-499': [0.38, 0.55], '500-999': [0.35, 0.50], '1000+': [0.30, 0.45] },
      // Add other GSM options...
    },
    lamination: {
      'glossy': { '1-199': [0.05, 0.07], '200-499': [0.04, 0.06], '500-999': [0.03, 0.05], '1000+': [0.02, 0.04] },
      'matte': { '1-199': [0.07, 0.09], '200-499': [0.06, 0.08], '500-999': [0.05, 0.07], '1000+': [0.04, 0.06] },
      'velvet': { '1-199': [0.09, 0.12], '200-499': [0.08, 0.11], '500-999': [0.07, 0.10], '1000+': [0.06, 0.09] },
      'without-lamination': { '1-199': [0.00, 0.00], '200-499': [0.00, 0.00], '500-999': [0.00, 0.00], '1000+': [0.00, 0.00] },
    },
    cutting: {
      'straight-cutting': { '1-199': [0.01, 0.03], '200-499': [0.01, 0.02], '500-999': [0.01, 0.02], '1000+': [0.01, 0.02] },
      'corner-cutting': { '1-199': [0.02, 0.04], '200-499': [0.02, 0.03], '500-999': [0.02, 0.03], '1000+': [0.02, 0.03] },
      'shape-cutting': { '1-199': [0.03, 0.05], '200-499': [0.03, 0.04], '500-999': [0.03, 0.04], '1000+': [0.03, 0.04] },
    },
    color: {
      '1': { '1-199': [0.05, 0.08], '200-499': [0.04, 0.07], '500-999': [0.03, 0.06], '1000+': [0.02, 0.05] },
      '2': { '1-199': [0.07, 0.10], '200-499': [0.06, 0.09], '500-999': [0.05, 0.08], '1000+': [0.04, 0.07] },
      '3': { '1-199': [0.09, 0.12], '200-499': [0.08, 0.11], '500-999': [0.07, 0.10], '1000+': [0.06, 0.09] },
      '4': { '1-199': [0.12, 0.15], '200-499': [0.10, 0.13], '500-999': [0.08, 0.11], '1000+': [0.07, 0.10] },
    },
    printType: {
      'offset': { '1-199': [0.10, 0.15], '200-499': [0.09, 0.14], '500-999': [0.08, 0.12], '1000+': [0.07, 0.11] },
      'digital': { '1-199': [0.08, 0.12], '200-499': [0.07, 0.11], '500-999': [0.06, 0.10], '1000+': [0.05, 0.09] },
      'screen': { '1-199': [0.12, 0.18], '200-499': [0.10, 0.15], '500-999': [0.09, 0.13], '1000+': [0.08, 0.12] },
      'uv': { '1-199': [0.15, 0.22], '200-499': [0.12, 0.18], '500-999': [0.10, 0.15], '1000+': [0.08, 0.12] },
      'fully-custom': { '1-199': [0.20, 0.30], '200-499': [0.18, 0.25], '500-999': [0.16, 0.22], '1000+': [0.14, 0.20] },
    },
  }) 

  const [selectedGsm, setSelectedGsm] = useState('');
  const [selectedLamination, setSelectedLamination] = useState('');
  const [selectedCutting, setSelectedCutting] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPrintType, setSelectedPrintType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  // Calculate total price based on selected options
  const calculatePrice = () => {
    const gsmPrice = priceData.gsm[selectedGsm];
    let basePriceRange = [0, 0];

    // Determine base price range based on quantity
    if (quantity <= 199) {
      basePriceRange = gsmPrice['1-199'];
    } else if (quantity <= 499) {
      basePriceRange = gsmPrice['200-499'];
    } else if (quantity <= 999) {
      basePriceRange = gsmPrice['500-999'];
    } else {
      basePriceRange = gsmPrice['1000+'];
    }

    // Add other modifiers
    const laminationRange = priceData.lamination[selectedLamination][quantity <= 199 ? '1-199' : quantity <= 499 ? '200-499' : quantity <= 999 ? '500-999' : '1000+'];
    const cuttingRange = priceData.cutting[selectedCutting][quantity <= 199 ? '1-199' : quantity <= 499 ? '200-499' : quantity <= 999 ? '500-999' : '1000+'];
    const colorRange = priceData.color[selectedColor][quantity <= 199 ? '1-199' : quantity <= 499 ? '200-499' : quantity <= 999 ? '500-999' : '1000+'];
    const printTypeRange = priceData.printType[selectedPrintType][quantity <= 199 ? '1-199' : quantity <= 499 ? '200-499' : quantity <= 999 ? '500-999' : '1000+'];

    // Calculate total price range per card
    const pricePerCardMin =
      basePriceRange[0] +
      laminationRange[0] +
      cuttingRange[0] +
      colorRange[0] +
      printTypeRange[0];

    const pricePerCardMax =
      basePriceRange[1] +
      laminationRange[1] +
      cuttingRange[1] +
      colorRange[1] +
      printTypeRange[1];

    // Calculate total price range for the quantity
    setTotalMinPrice((pricePerCardMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerCardMax * quantity).toFixed(2));
  };

  // Fetch price data when the component mounts
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getBusinessCardRates');
        if (response.data.success) {
          // Assuming the data returned from the server is in the required format
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
          <h3 className="text-lg font-semibold">Total Price: AED {totalMinPrice} - AED {totalMaxPrice}</h3>
        </div>
      )}
    </div>
  </div>
  );
};

export default BusinessCardCalculator;
