import React, { useState,useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';
const UniformPriceCalculator = () => {
    const axiosInstance = MyAxiosInstance()
//   const priceData = {
//     sizes: {
//       S: { '1-99': [10, 15], '100-499': [9, 14], '500+': [8, 12] },
//       M: { '1-99': [12, 18], '100-499': [11, 16], '500+': [10, 14] },
//       L: { '1-99': [14, 20], '100-499': [13, 18], '500+': [12, 16] },
//       XL: { '1-99': [16, 22], '100-499': [15, 20], '500+': [14, 18] },
//       XXL: { '1-99': [18, 25], '100-499': [17, 22], '500+': [16, 20] },
//     },
//     material: {
//       honeycomb: { '1-99': [5, 7], '100-499': [4.5, 6.5], '500+': [4, 6] },
//       mesh: { '1-99': [6, 8], '100-499': [5.5, 7.5], '500+': [5, 7] },
//       'fully custom': { '1-99': [10, 12], '100-499': [9, 11], '500+': [8, 10] },
//       polyester: { '1-99': [4, 6], '100-499': [3.5, 5.5], '500+': [3, 5] },
//       jersey: { '1-99': [3, 5], '100-499': [2.5, 4.5], '500+': [2, 4] },
//     },
//     printArea: {
//       back: { '1-99': [3, 5], '100-499': [2.5, 4.5], '500+': [2, 4] },
//       front: { '1-99': [2, 4], '100-499': [1.8, 3.8], '500+': [1.5, 3.5] },
//       sleeve: { '1-99': [1, 3], '100-499': [0.8, 2.8], '500+': [0.5, 2.5] },
//       plain: { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
//     },
//     printMethod: {
//       embroidery: { '1-99': [5, 8], '100-499': [4.5, 7], '500+': [4, 6] },
//       screen: { '1-99': [4, 6], '100-499': [3.5, 5.5], '500+': [3, 5] },
//       dte: { '1-99': [6, 9], '100-499': [5.5, 8], '500+': [5, 7] },
//       sublimation: { '1-99': [8, 10], '100-499': [7, 9], '500+': [6, 8] },
//       'full sublimation': { '1-99': [10, 12], '100-499': [9, 11], '500+': [8, 10] },
//     },
//     printLength: {
//       min: 7,
//       pricePerCm: 0.25,
//     },
//   };

const [priceData,setPriceData] = useState()
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedPrintArea, setSelectedPrintArea] = useState('');
  const [selectedPrintMethod, setSelectedPrintMethod] = useState('');
  const [printLength, setPrintLength] = useState(7); // Default to min print length
  const [quantity, setQuantity] = useState(1);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  const calculatePrice = () => {
    // Check if all selections are made
    if (
      !selectedSize ||
      !selectedMaterial ||
      !selectedPrintArea ||
      !selectedPrintMethod ||
      !quantity ||
      quantity <= 0
    ) {
      alert('Please select all options and enter a valid quantity.');
      return;
    }

    const getPriceRange = (data) => {
      if (!data) {
        console.error('Data is undefined in getPriceRange');
        return [0, 0]; // Default to [0, 0] if data is undefined
      }
      if (quantity <= 99) return data['1-99'];
      if (quantity <= 499) return data['100-499'];
      return data['500+'];
    };

    const sizeData = priceData.sizes[selectedSize];
    const materialData = priceData.material[selectedMaterial];
    const printAreaData = priceData.printArea[selectedPrintArea];
    const printMethodData = priceData.printMethod[selectedPrintMethod];

    const sizePrice = getPriceRange(sizeData);
    const materialPrice = getPriceRange(materialData);
    const printAreaPrice = getPriceRange(printAreaData);
    const printMethodPrice = getPriceRange(printMethodData);

    // Calculate print length cost only if printArea is not "plain"
    const extraPrintLength = selectedPrintArea === 'plain' ? 0 : Math.max(0, printLength - priceData.printLength.min);
    const printLengthCost = extraPrintLength * priceData.printLength.pricePerCm;

    const pricePerUniformMin =
      sizePrice[0] +
      materialPrice[0] +
      printAreaPrice[0] +
      printMethodPrice[0] +
      printLengthCost;
    const pricePerUniformMax =
      sizePrice[1] +
      materialPrice[1] +
      printAreaPrice[1] +
      printMethodPrice[1] +
      printLengthCost;

    setTotalMinPrice((pricePerUniformMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerUniformMax * quantity).toFixed(2));
  };

  // Handle setting print length to 0 and read-only if printArea is "plain"
  const handlePrintAreaChange = (e) => {
    const selectedArea = e.target.value;
    setSelectedPrintArea(selectedArea);

    if (selectedArea === 'plain') {
      setPrintLength(0); // Set to 0 when plain
    } else {
      setPrintLength(7); // Default to 7cm when not plain
    }
  };


     // Fetch price data when the component mounts
     useEffect(() => {
        const fetchPriceData = async () => {
          try {
            const response = await axiosInstance.get('/getUniformRates');
            if (response.data.success) {
              // Assuming the data returned from the server is in the required format
            
    
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
        <h2 className="text-xl font-bold mb-4">Uniform Price Calculator</h2>

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
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
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
            <option value="honeycomb">Honeycomb</option>
            <option value="mesh">Mesh</option>
            <option value="fully custom">Fully Custom</option>
            <option value="polyester">Polyester</option>
            <option value="jersey">Jersey</option>
          </select>
        </div>

        {/* Print Area Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Print Area</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedPrintArea}
            onChange={handlePrintAreaChange} // Handle change in print area
            required
          >
            <option value="">Select Print Area</option>
            <option value="back">Back</option>
            <option value="front">Front</option>
            <option value="sleeve">Sleeve</option>
            <option value="plain">Plain</option>
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
            <option value="embroidery">Embroidery</option>
            <option value="screen">Screen</option>
            <option value="dte">DTE</option>
            <option value="sublimation">Sublimation</option>
            <option value="full sublimation">Full Sublimation</option>
          </select>
        </div>

        {/* Print Length Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Print Length (cm)</label>
          <input
            type="number"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            value={printLength}
            onChange={(e) => setPrintLength(parseInt(e.target.value, 10))}
            required
            min="7"
            readOnly={selectedPrintArea === 'plain'} // Set read-only if plain
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
            quantity
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={
            !selectedSize ||
            !selectedMaterial ||
            !selectedPrintArea ||
            !selectedPrintMethod ||
            !quantity
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

export default UniformPriceCalculator;
