import React, { useState,useEffect } from 'react';
import toast from 'react-hot-toast';
import BillBookTable from './billbookTable';
import MyAxiosInstance from '../../../utils/axios';
const BillBookAddPriceForm = () => {
    const axiosInstance = MyAxiosInstance()
    const [id,setId] = useState()
    const [update,setUpdate] = useState(false)
  const [priceData, setPriceData] = useState({
    size: {
      A3: {
        '1-99': [10, 15],
        '100-499': [9, 14],
        '500+': [8, 13],
      },
      A4: {
        '1-99': [7, 12],
        '100-499': [6, 11],
        '500+': [5, 10],
      },
      A5: {
        '1-99': [5, 8],
        '100-499': [4, 7],
        '500+': [3, 6],
      },
    },
    copies: {
      '0': { '1-99': [0, 0], '100-499': [0, 0], '500+': [0, 0] },
      '1': { '1-99': [2, 3], '100-499': [1.8, 2.8], '500+': [1.5, 2.5] },
      '2': { '1-99': [3, 4], '100-499': [2.8, 3.8], '500+': [2.5, 3.5] },
      '3': { '1-99': [4, 5], '100-499': [3.8, 4.8], '500+': [3.5, 4.5] },
      '4': { '1-99': [5, 6], '100-499': [4.8, 5.8], '500+': [4.5, 5.5] },
    },
    color: {
      '1': { '1-99': [1, 1.5], '100-499': [0.8, 1.3], '500+': [0.5, 1.0] },
      '2': { '1-99': [2, 2.5], '100-499': [1.8, 2.3], '500+': [1.5, 2.0] },
      '3': { '1-99': [3, 3.5], '100-499': [2.8, 3.3], '500+': [2.5, 3.0] },
      '4': { '1-99': [4, 4.5], '100-499': [3.8, 4.3], '500+': [3.5, 4.0] },
    },
  });

  const [newEntry, setNewEntry] = useState({
    criterion: 'size',
    type: '',
    ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
  });

  // Handle input changes for new entry type
  const handleTypeChange = (e) => {
    setNewEntry({ ...newEntry, type: e.target.value });
  };

  // Handle changes within ranges
  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...newEntry.ranges];
    updatedRanges[index][field] = value;
    setNewEntry({ ...newEntry, ranges: updatedRanges });
  };

  // Add a new range to the current entry
  const addRange = () => {
    setNewEntry({
      ...newEntry,
      ranges: [...newEntry.ranges, { minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    });
  };

  // Remove a range from the current entry
  const removeRange = (index) => {
    const updatedRanges = [...newEntry.ranges];
    updatedRanges.splice(index, 1);
    setNewEntry({ ...newEntry, ranges: updatedRanges });
  };

  // Add the current entry to the priceData state
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

    // Reset new entry state
    // setNewEntry({
    //   criterion: 'size',
    //   type: '',
    //   ranges: [{ minQty: '', maxQty: '', minPrice: '', maxPrice: '' }],
    // });
  };

  // Submit form and console log final data
 

    // Generate final priceData
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Final Price Data:', priceData);
    
    
        const handleSubmit = async () => {
            try {
      
              if(update)
              {
                const response = await axiosInstance.post('/updateBillBookRates', {
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
                const response = await axiosInstance.post('/addBillBookRates', {
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
            const response = await axiosInstance.get('/getBillBookRates');
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
        <h2 className="text-xl font-bold mb-4 text-center">Add Bill Book Price Data</h2>
        <form onSubmit={handleSubmit}>
          {/* Select Criterion */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Criterion</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
              value={newEntry.criterion}
              onChange={(e) => setNewEntry({ ...newEntry, criterion: e.target.value })}
            >
              <option value="size">Size</option>
              <option value="copies">Copies</option>
              <option value="color">Color</option>
            </select>
          </div>

          {/* Input Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {newEntry.criterion === 'size' ? 'Size (e.g., A3)' : 'Type (e.g., 2 Copies)'}
            </label>
            <input
              type="text"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={newEntry.type}
              onChange={handleTypeChange}
              required
            />
          </div>

          {/* Add Ranges */}
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

        {/* <div className="mt-6">
          <h3 className="text-lg font-semibold">Current Price Data:</h3>
          <pre>{JSON.stringify(priceData, null, 2)}</pre>
        </div> */}
      </div>
      <BillBookTable data={priceData}/>
    </div>
  );
};

export default BillBookAddPriceForm;
