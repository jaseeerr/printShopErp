import React, { useState, useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';
import toast from 'react-hot-toast';
import WeddingCardTable from './WeddingCardPriceTable';

const WeddingCardPriceDataForm = () => {
  const axiosInstance = MyAxiosInstance();
  const [id, setId] = useState();
  const [update, setUpdate] = useState(false);

  const [priceData, setPriceData] = useState({
    type: {
      readymade: { '1-99': [2, 3], '100-499': [1.8, 2.8], '500+': [1.5, 2.5] },
      'semi ready made': { '1-99': [3, 4], '100-499': [2.8, 3.8], '500+': [2.5, 3.5] },
      'full custom': { '1-99': [5, 6], '100-499': [4.5, 5.5], '500+': [4, 5] },
      acrylic: { '1-99': [7, 8], '100-499': [6.5, 7.5], '500+': [6, 7] },
      frosty: { '1-99': [4, 5], '100-499': [3.8, 4.8], '500+': [3.5, 4.5] },
      'ice silver': { '1-99': [5, 6], '100-499': [4.5, 5.5], '500+': [4, 5] },
      'ice gold': { '1-99': [6, 7], '100-499': [5.5, 6.5], '500+': [5, 6] },
      '350gsm': { '1-99': [3, 4], '100-499': [2.8, 3.8], '500+': [2.5, 3.5] },
      'texture paper': { '1-99': [5, 6], '100-499': [4.5, 5.5], '500+': [4, 5] },
    },
    size: {
      A4: { '1-99': [1, 2], '100-499': [0.8, 1.5], '500+': [0.7, 1.3] },
      A5: { '1-99': [0.8, 1.5], '100-499': [0.6, 1.2], '500+': [0.5, 1] },
      A6: { '1-99': [0.6, 1.2], '100-499': [0.5, 1], '500+': [0.4, 0.9] },
    },
    envelope: {
      'without envelope': { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
      'with envelope': { '1-99': [1, 1.5], '100-499': [0.8, 1.3], '500+': [0.5, 1] },
    },
    printSide: {
      'one side': { '1-99': [0.5, 1], '100-499': [0.4, 0.8], '500+': [0.3, 0.7] },
      '2 side': { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.6, 1] },
    },
    custom: {
      'special customization': { '1-99': [2, 3], '100-499': [1.8, 2.8], '500+': [1.5, 2.5] },
    },
    lamination: {
      glossy: { '1-99': [0.5, 0.8], '100-499': [0.4, 0.7], '500+': [0.3, 0.6] },
      velvet: { '1-99': [0.6, 1], '100-499': [0.5, 0.9], '500+': [0.4, 0.8] },
    },
  });

  const [newEntry, setNewEntry] = useState({
    criterion: 'type',
    option: '',
    ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
  });

  const categories = ['type', 'size', 'envelope', 'printSide', 'custom', 'lamination'];

  const handleOptionChange = (e) => {
    setNewEntry({ ...newEntry, option: e.target.value });
  };

  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...newEntry.ranges];
    updatedRanges[index][field] = value;
    setNewEntry({ ...newEntry, ranges: updatedRanges });
  };

  const addRange = () => {
    setNewEntry({
      ...newEntry,
      ranges: [...newEntry.ranges, { minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    });
  };

  const removeRange = (index) => {
    const updatedRanges = [...newEntry.ranges];
    updatedRanges.splice(index, 1);
    setNewEntry({ ...newEntry, ranges: updatedRanges });
  };

  const handleAddCriterion = () => {
    const updatedData = {
      ...priceData,
      [newEntry.criterion]: {
        ...priceData[newEntry.criterion],
        [newEntry.option]: newEntry.ranges.reduce((acc, range) => {
          const key = `${range.minQty}-${range.maxQty}`;
          acc[key] = [parseFloat(range.minPrice), parseFloat(range.maxPrice)];
          return acc;
        }, {}),
      },
    };

    setPriceData(updatedData);
    toast.success('Added to price data!');
    setNewEntry({
      criterion: 'type',
      option: '',
      ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    });
  };

  const handleSavePriceData = async () => {
    try {
      if (update) {
        const response = await axiosInstance.post('/updateWeddingCardRates', {
          data: priceData,
          id,
        });
        if (response.data.success) {
          toast.success('Data updated successfully!');
        } else {
          toast.error('Update failed!');
        }
      } else {
        const response = await axiosInstance.post('/addWeddingCardRates', {
          data: priceData,
        });
        if (response.data.success) {
          toast.success('Data saved successfully!');
          setTimeout(() => {
            location.reload();
          }, 750);
        } else {
          toast.error('Save failed!');
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axiosInstance.get('/getWeddingCardRates');
        if (response.data.success && response.data.data.length > 0) {
          setUpdate(true);
          setId(response.data.data[0]._id);
          setPriceData(response.data.data[0].data);
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Wedding Card Price Data Form</h2>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Criterion</label>
            <select
              value={newEntry.criterion}
              onChange={(e) => setNewEntry({ ...newEntry, criterion: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Option (e.g., Readymade, A4)</label>
            <input
              type="text"
              value={newEntry.option}
              onChange={handleOptionChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">Add Price Ranges</h3>
          {newEntry.ranges.map((range, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Quantity</label>
                  <input
                    type="number"
                    value={range.minQty}
                    onChange={(e) => handleRangeChange(index, 'minQty', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Quantity</label>
                  <input
                    type="number"
                    value={range.maxQty}
                    onChange={(e) => handleRangeChange(index, 'maxQty', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={range.minPrice}
                    onChange={(e) => handleRangeChange(index, 'minPrice', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={range.maxPrice}
                    onChange={(e) => handleRangeChange(index, 'maxPrice', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              {newEntry.ranges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRange(index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove Range
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addRange}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-2"
          >
            Add Range
          </button>

          <button
            type="button"
            onClick={handleAddCriterion}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4"
          >
            Add to Price Data
          </button>

          <button
            type="button"
            onClick={handleSavePriceData}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md mt-4"
          >
            Save Price Data
          </button>
        </form>
      </div>
      <WeddingCardTable data={priceData}/>
    </div>
  );
};

export default WeddingCardPriceDataForm;
