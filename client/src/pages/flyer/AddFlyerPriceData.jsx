import React, { useState,useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';
import toast from 'react-hot-toast';
import FlyerTable from './FlyerTable';

const FlyerPriceDataForm = () => {
  const axiosInstance = MyAxiosInstance();
  const [id,setId] = useState()
  const [update,setUpdate] = useState(false)

  const [priceData, setPriceData] = useState({
    size: {
      A6: { '1-99': [0.5, 1], '100-499': [0.4, 0.8], '500+': [0.3, 0.7] },
      A5: { '1-99': [0.6, 1.2], '100-499': [0.5, 1], '500+': [0.4, 0.9] },
      A4: { '1-99': [0.8, 1.5], '100-499': [0.6, 1.2], '500+': [0.5, 1] },
      A3: { '1-99': [1, 2], '100-499': [0.8, 1.5], '500+': [0.7, 1.3] },
    },
    gsm: {
      '60': { '1-99': [0.2, 0.4], '100-499': [0.15, 0.35], '500+': [0.1, 0.3] },
      '80': { '1-99': [0.25, 0.45], '100-499': [0.2, 0.4], '500+': [0.15, 0.35] },
      '100': { '1-99': [0.3, 0.5], '100-499': [0.25, 0.45], '500+': [0.2, 0.4] },
      '120': { '1-99': [0.35, 0.55], '100-499': [0.3, 0.5], '500+': [0.25, 0.45] },
      '170': { '1-99': [0.4, 0.6], '100-499': [0.35, 0.55], '500+': [0.3, 0.5] },
      '300': { '1-99': [0.5, 0.8], '100-499': [0.45, 0.75], '500+': [0.4, 0.7] },
    },
    lamination: {
      glossy: { '1-99': [0.1, 0.2], '100-499': [0.08, 0.18], '500+': [0.06, 0.15] },
      matte: { '1-99': [0.12, 0.22], '100-499': [0.1, 0.2], '500+': [0.08, 0.18] },
      velvet: { '1-99': [0.15, 0.25], '100-499': [0.12, 0.22], '500+': [0.1, 0.2] },
    },
  });

  const [newEntry, setNewEntry] = useState({
    criterion: 'size',
    type: '',
    ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
  });

  const handleTypeChange = (e) => {
    setNewEntry({ ...newEntry, type: e.target.value });
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
        [newEntry.type]: newEntry.ranges.reduce((acc, range) => {
          const key = `${range.minQty}-${range.maxQty}`;
          acc[key] = [parseFloat(range.minPrice), parseFloat(range.maxPrice)];
          return acc;
        }, {}),
      },
    };

    setPriceData(updatedData);
    toast.success('Added to price data!');
    setNewEntry({
      criterion: 'size',
      type: '',
      ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    });
  };

  const handleSavePriceData = async () => {
    const handleSubmit = async () => {
        try {
  
          if(update)
          {
            const response = await axiosInstance.post('/updateFlyerRates', {
              data: priceData,
              id
            });
  
            toast.dismiss()
            if(response.data.success)
            {
              toast.success('Done')
            //   setTimeout(()=>{
            //        location.reload()
            //   },750)
            }
            else
            {
              toast.error("error")
            }
            
          }
          else
          {
            const response = await axiosInstance.post('/addFlyerRates', {
              data: priceData
            });
            if(response.data.success)
            {
              toast.success('Done')
              setTimeout(()=>{
                   location.reload()
              },750)
            }
            else
            {
              toast.error("error")
            }
            console.log('Price data submitted successfully:', response.data);
          }
         
        } catch (error) {
          console.error('Error submitting price data:', error);
        }
      };
     
      handleSubmit()
  };

     // Fetch price data when the component mounts
     useEffect(() => {
        const fetchPriceData = async () => {
          try {
            const response = await axiosInstance.get('/getFlyerRates');
            if (response.data.success) {
              // Assuming the data returned from the server is in the required format
              if(response.data.data.length>0)
              {
                setUpdate(true)
              }
    
              setId(response.data.data[0]._id)
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
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Flyer Price Data</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Criterion</label>
            <select
              value={newEntry.criterion}
              onChange={(e) => setNewEntry({ ...newEntry, criterion: e.target.value })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
            >
              <option value="size">Size</option>
              <option value="gsm">GSM</option>
              <option value="lamination">Lamination</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type (e.g., A6, 80 GSM, Matte)
            </label>
            <input
              type="text"
              value={newEntry.type}
              onChange={handleTypeChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">Add Price Ranges</h3>
          {newEntry.ranges.map((range, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Quantity</label>
                  <input
                    type="number"
                    value={range.minQty}
                    onChange={(e) => handleRangeChange(index, 'minQty', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Quantity</label>
                  <input
                    type="number"
                    value={range.maxQty}
                    onChange={(e) => handleRangeChange(index, 'maxQty', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={range.minPrice}
                    onChange={(e) => handleRangeChange(index, 'minPrice', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={range.maxPrice}
                    onChange={(e) => handleRangeChange(index, 'maxPrice', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              </div>

              {newEntry.ranges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRange(index)}
                  className="mt-4 text-red-600 hover:text-red-800"
                >
                  Remove Range
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addRange}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Range
          </button>

          <button
            type="button"
            onClick={handleAddCriterion}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
          >
            Add to Price Data
          </button>

          <button
            type="button"
            onClick={handleSavePriceData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full"
          >
            Save Price Data
          </button>
        </form>

       

        {/* <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Current Price Data</h3>
          <pre className="p-4 bg-gray-200 rounded">{JSON.stringify(priceData, null, 2)}</pre>
        </div> */}
      </div>
      <FlyerTable data={priceData}/>
    </div>
  );
};

export default FlyerPriceDataForm;
