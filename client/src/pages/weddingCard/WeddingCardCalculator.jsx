import React, { useState, useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';

const WeddingCardCalculator = () => {
  const axiosInstance = MyAxiosInstance();

  const [priceData, setPriceData] = useState({
    type: {},
    size: {},
    envelope: {},
    printSide: {},
    custom: {},
    lamination: {},
  });

  const [selectedType, setSelectedType] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedEnvelope, setSelectedEnvelope] = useState('');
  const [selectedPrintSide, setSelectedPrintSide] = useState('');
  const [selectedCustom, setSelectedCustom] = useState('');
  const [selectedLamination, setSelectedLamination] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalMinPrice, setTotalMinPrice] = useState(0);
  const [totalMaxPrice, setTotalMaxPrice] = useState(0);

  const getPriceRange = (data) => {
    if (!data) return [0, 0];
    const key = Object.keys(data).find((range) => {
      const [min, max] = range.includes('+')
        ? [parseInt(range), Infinity]
        : range.split('-').map(Number);
      return quantity >= min && quantity <= max;
    });
    return data[key] || [0, 0];
  };

  const calculatePrice = () => {
    if (
      !selectedType ||
      !selectedSize ||
      !selectedEnvelope ||
      !selectedPrintSide ||
      !selectedLamination ||
      quantity <= 0
    ) {
      alert('Please select all options and enter a valid quantity.');
      return;
    }

    const typePrice = getPriceRange(priceData.type[selectedType]);
    const sizePrice = getPriceRange(priceData.size[selectedSize]);
    const envelopePrice = getPriceRange(priceData.envelope[selectedEnvelope]);
    const printSidePrice = getPriceRange(priceData.printSide[selectedPrintSide]);
    const customPrice = selectedCustom ? getPriceRange(priceData.custom[selectedCustom]) : [0, 0];
    const laminationPrice = getPriceRange(priceData.lamination[selectedLamination]);

    const pricePerCardMin =
      typePrice[0] +
      sizePrice[0] +
      envelopePrice[0] +
      printSidePrice[0] +
      customPrice[0] +
      laminationPrice[0];

    const pricePerCardMax =
      typePrice[1] +
      sizePrice[1] +
      envelopePrice[1] +
      printSidePrice[1] +
      customPrice[1] +
      laminationPrice[1];

    setTotalMinPrice((pricePerCardMin * quantity).toFixed(2));
    setTotalMaxPrice((pricePerCardMax * quantity).toFixed(2));
  };

  // Fetch price data from API or backend when the component mounts
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axiosInstance.get('/getWeddingCardRates');
        if (response.data.success) {
          setPriceData(response.data.data[0].data); // Assuming the first document contains the data
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };
    fetchPriceData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Wedding Card Price Calculator</h2>

        {/* Dropdown Rendering Helper */}
        {Object.entries({
          Type: [priceData.type, selectedType, setSelectedType],
          Size: [priceData.size, selectedSize, setSelectedSize],
          Envelope: [priceData.envelope, selectedEnvelope, setSelectedEnvelope],
          'Print Side': [priceData.printSide, selectedPrintSide, setSelectedPrintSide],
          Custom: [priceData.custom, selectedCustom, setSelectedCustom],
          Lamination: [priceData.lamination, selectedLamination, setSelectedLamination],
        }).map(([label, [options, value, setter]]) => (
          <div className="mb-4" key={label}>
            <label className="block text-sm font-medium mb-2">Select {label}</label>
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select {label}</option>
              {Object.keys(options).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min="1"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculatePrice}
          className={`mt-4 px-4 py-2 text-white rounded-md w-full ${
            selectedType &&
            selectedSize &&
            selectedEnvelope &&
            selectedPrintSide &&
            selectedLamination &&
            quantity > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={
            !selectedType ||
            !selectedSize ||
            !selectedEnvelope ||
            !selectedPrintSide ||
            !selectedLamination ||
            quantity <= 0
          }
        >
          Calculate Price
        </button>

        {/* Total Price Display */}
        {totalMinPrice > 0 && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">
              Total Price: AED {totalMinPrice} - AED {totalMaxPrice}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingCardCalculator;
