import React, { useState,useEffect } from 'react';
import MyAxiosInstance from '../../../utils/axios';
import toast from 'react-hot-toast';
import KeychainTable from './keychainTable';

const AddKeychainPriceData = () => {
  const axiosInstance = MyAxiosInstance();
  const [id,setId] = useState()
    const [update,setUpdate] = useState(false)
  const [newEntry, setNewEntry] = useState({
    criterion: 'material',
    type: '',
    ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
  });

  const [priceData, setPriceData] = useState({
    material: {
      metal: { '1-99': [3, 4], '100-499': [2.5, 3.5], '500+': [2, 3] },
      leather: { '1-99': [4, 5], '100-499': [3.5, 4.5], '500+': [3, 4] },
      plastic: { '1-99': [2, 3], '100-499': [1.5, 2.5], '500+': [1, 2] },
      silicon: { '1-99': [2.5, 3.5], '100-499': [2, 3], '500+': [1.5, 2.5] },
      wooden: { '1-99': [3, 4], '100-499': [2.5, 3.5], '500+': [2, 3] },
      acrylic: { '1-99': [3.5, 4.5], '100-499': [3, 4], '500+': [2.5, 3.5] },
      'full custom': { '1-99': [5, 6], '100-499': [4.5, 5.5], '500+': [4, 5] },
      special: { '1-99': [6, 7], '100-499': [5.5, 6.5], '500+': [5, 6] },
    },
    printing: {
      'one side': { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.5, 1] },
      'both side': { '1-99': [2, 2.5], '100-499': [1.5, 2], '500+': [1, 1.5] },
    },
    printType: {
      epoxy: { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.5, 1] },
      'uv print': { '1-99': [2, 2.5], '100-499': [1.8, 2.3], '500+': [1.5, 2] },
      engrave: { '1-99': [3, 3.5], '100-499': [2.5, 3], '500+': [2, 2.5] },
      embossing: { '1-99': [4, 4.5], '100-499': [3.8, 4.2], '500+': [3.5, 4] },
      'without branding': { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
    },
    shape: {
      square: { '1-99': [1, 1.5], '100-499': [0.8, 1.2], '500+': [0.5, 1] },
      rectangle: { '1-99': [2, 2.5], '100-499': [1.5, 2], '500+': [1, 1.5] },
      round: { '1-99': [1.8, 2.2], '100-499': [1.5, 1.8], '500+': [1, 1.2] },
      custom: { '1-99': [3, 4], '100-499': [2.5, 3.5], '500+': [2, 3] },
    },
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

  const addRange = () => {
    setNewEntry({
      ...newEntry,
      ranges: [...newEntry.ranges, { minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    });
  };

  const removeRange = (index) => {
    const newRanges = [...newEntry.ranges];
    newRanges.splice(index, 1);
    setNewEntry({ ...newEntry, ranges: newRanges });
  };

  const handleAddCriterion = () => {
    toast.success('Added to price data.');
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

    // setNewEntry({
    //   criterion: 'material',
    //   type: '',
    //   ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    // });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(priceData)
      
    const handleSubmit = async () => {
        try {
  
          if(update)
          {
            const response = await axiosInstance.post('/updateKeychainRates', {
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
            const response = await axiosInstance.post('/addKeychainRates', {
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
            const response = await axiosInstance.get('/getKeychainRates');
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
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Keychain Price Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Criterion</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
              value={newEntry.criterion}
              onChange={(e) => setNewEntry({ ...newEntry, criterion: e.target.value })}
            >
              <option value="material">Material</option>
              <option value="printing">Printing</option>
              <option value="printType">Print Type</option>
              <option value="shape">Shape</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type</label>
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

          <button
            type="button"
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={addRange}
          >
            Add Range
          </button>

          <button
            type="button"
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
            onClick={handleAddCriterion}
          >
            Add to Price Data
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
          >
            Save Price Data
          </button>
        </form>
      </div>
      <KeychainTable data={priceData}/>
    </div>
  );
};

export default AddKeychainPriceData;
