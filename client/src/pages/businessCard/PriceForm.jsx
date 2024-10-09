import React, { useState } from 'react';
import PriceDisplay from '../../components/BusinessCardPriceTable';

const AddPriceRanges = () => {
  // State to store the price data
  const [priceData, setPriceData] = useState({
    gsm: {},
    lamination: {},
    cutting: {},
    color: {},
    printType: {},
  });

  // State to handle dynamic input for each criterion
  const [newEntry, setNewEntry] = useState({
    criterion: 'gsm',
    type: '',
    ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }]
  });

  // Handle input changes for criterion types and ranges
  const handleTypeChange = (e) => {
    setNewEntry({ ...newEntry, type: e.target.value });
  };

  const handleRangeChange = (index, field, value) => {
    const newRanges = [...newEntry.ranges];
    newRanges[index][field] = value;
    setNewEntry({ ...newEntry, ranges: newRanges });
  };

  // Add a new range to the ranges array
  const addRange = () => {
    setNewEntry({
      ...newEntry,
      ranges: [...newEntry.ranges, { minQty: '', maxQty: '', minPrice: '', maxPrice: '' }]
    });
  };

  // Remove a range from the ranges array
  const removeRange = (index) => {
    const newRanges = [...newEntry.ranges];
    newRanges.splice(index, 1);
    setNewEntry({ ...newEntry, ranges: newRanges });
  };

  // Add the current criterion entry to the priceData
  const handleAddCriterion = () => {
    setPriceData({
      ...priceData,
      [newEntry.criterion]: {
        ...priceData[newEntry.criterion],
        [newEntry.type]: newEntry.ranges.reduce((acc, range) => {
          const key = `${range.minQty}-${range.maxQty}`;
          acc[key] = [parseFloat(range.minPrice), parseFloat(range.maxPrice)];
          return acc;
        }, {}),
      },
    });

    // Reset new entry state
    // setNewEntry({
    //   criterion: 'gsm',
    //   type: '',
    //   ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }]
    // });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final priceData:', priceData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">Add Price Ranges</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Criterion</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
              value={newEntry.criterion}
              onChange={(e) => setNewEntry({ ...newEntry, criterion: e.target.value })}
            >
              <option value="gsm">GSM</option>
              <option value="lamination">Lamination</option>
              <option value="cutting">Cutting</option>
              <option value="color">Color</option>
              <option value="printType">Print Type</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {newEntry.criterion === 'gsm' ? 'GSM Type' : 'Type'} (e.g., 300 GSM, Glossy Lamination)
            </label>
            <input
              type="text"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={newEntry.type}
              onChange={handleTypeChange}
              required
            />
          </div>

          {/* Dynamic Quantity and Price Ranges */}
          <h3 className="text-lg font-semibold mb-2">Add Price Ranges</h3>
          {newEntry.ranges.map((range, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Quantity</label>
                  <input
                    type="number"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.minQty}
                    onChange={(e) => handleRangeChange(index, 'minQty', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Quantity</label>
                  <input
                    type="number"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.maxQty}
                    onChange={(e) => handleRangeChange(index, 'maxQty', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.minPrice}
                    onChange={(e) => handleRangeChange(index, 'minPrice', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.maxPrice}
                    onChange={(e) => handleRangeChange(index, 'maxPrice', e.target.value)}
                    required
                  />
                </div>
              </div>

              {newEntry.ranges.length > 1 && (
                <button
                  type="button"
                  className="mt-4 text-red-600 hover:text-red-800"
                  onClick={() => removeRange(index)}
                >
                  Remove Range
                </button>
              )}
            </div>
          ))}

          {/* Add Range Button */}
          <button
            type="button"
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={addRange}
          >
            Add Range
          </button>

          {/* Add Criterion Button */}
          <button
            type="button"
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
            onClick={handleAddCriterion}
          >
            Add Criterion to Price Data
          </button>

          {/* Submit Form Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
          >
            Generate Price Data
          </button>
        </form>
      </div>
      <PriceDisplay priceData={priceData}/>
    </div>
  );
};

export default AddPriceRanges;
