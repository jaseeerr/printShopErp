import React, { useState, useEffect } from 'react';
import PriceDisplay from '../../components/BusinessCardPriceTable';
import toast from 'react-hot-toast';
import MyAxiosInstance from '../../../utils/axios';

const AddPriceRanges = () => {
  const axiosInstance = MyAxiosInstance();
  
  // State to store the price data
  const [priceData, setPriceData] = useState({
    gsm: {},
    lamination: {},
    cutting: {},
    color: {},
    printType: {},
    material: {} // New Material Criterion
  });
  
  const [id, setId] = useState();
  const [update, setUpdate] = useState(false);

  const [newEntry, setNewEntry] = useState({
    criterion: 'gsm',
    type: '',
    ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }]
  });

  const handleTypeChange = (e) => {
    setNewEntry({ ...newEntry, type: e.target.value });
  };

  const handleRangeChange = (index, field, value) => {
    const newRanges = [...newEntry.ranges];
    newRanges[index][field] = value;
    setNewEntry({ ...newEntry, ranges: newRanges });
  };

  const addRange = () => {
    setNewEntry({
      ...newEntry,
      ranges: [...newEntry.ranges, { minQty: '', maxQty: '', minPrice: '', maxPrice: '' }]
    });
  };

  const removeRange = (index) => {
    const newRanges = [...newEntry.ranges];
    newRanges.splice(index, 1);
    setNewEntry({ ...newEntry, ranges: newRanges });
  };

  const handleAddCriterion = () => {
    toast.success('Added to price list');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Final priceData:', priceData);

    try {
      if (update) {
        const response = await axiosInstance.post('/updateBusinessCardRates', {
          data: priceData,
          id,
        });

        if (response.data.success) {
          toast.success('Updated successfully');
          setTimeout(() => location.reload(), 750);
        } else {
          toast.error('Update failed');
        }
      } else {
        const response = await axiosInstance.post('/addBusinessCardRates', {
          data: priceData,
        });

        if (response.data.success) {
          toast.success('Added successfully');
          setTimeout(() => location.reload(), 750);
        } else {
          toast.error('Submission failed');
        }
      }
    } catch (error) {
      console.error('Error submitting price data:', error);
    }
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axiosInstance.get('/getBusinessCardRates');
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
              <option value="material">Material</option> {/* New Material Option */}
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

          <h3 className="text-lg font-semibold mb-2">Add Price Ranges</h3>
          {newEntry.ranges.map((range, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min Quantity"
                  className="mt-1 block w-full py-2 px-3 border rounded-md"
                  value={range.minQty}
                  onChange={(e) => handleRangeChange(index, 'minQty', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Max Quantity"
                  className="mt-1 block w-full py-2 px-3 border rounded-md"
                  value={range.maxQty}
                  onChange={(e) => handleRangeChange(index, 'maxQty', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Min Price"
                  className="mt-1 block w-full py-2 px-3 border rounded-md"
                  value={range.minPrice}
                  onChange={(e) => handleRangeChange(index, 'minPrice', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="mt-1 block w-full py-2 px-3 border rounded-md"
                  value={range.maxPrice}
                  onChange={(e) => handleRangeChange(index, 'maxPrice', e.target.value)}
                  required
                />
              </div>
              {newEntry.ranges.length > 1 && (
                <button type="button" onClick={() => removeRange(index)}>
                  Remove Range
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addRange} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            Add Range
          </button>
          <button type="button" onClick={handleAddCriterion} className="mb-4 w-full bg-green-600 text-white">
            Add to Price Data
          </button>
          <button type="submit" className="w-full bg-blue-600 text-white">
            Save Price List
          </button>
        </form>
      </div>
      <PriceDisplay priceData={priceData} />
    </div>
  );
};

export default AddPriceRanges;
