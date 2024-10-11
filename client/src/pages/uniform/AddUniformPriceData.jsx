import React, { useState,useEffect } from 'react';
import PricingDisplay from './uniformPriceTable';
import toast from 'react-hot-toast'
import MyAxiosInstance from '../../../utils/axios';
const AddUniformPriceData = () => {
    const axiosInstance = MyAxiosInstance()

//   const [priceData, setPriceData] = useState({
//     size: {},
//     material: {},
//     printArea: {},
//     printMethod: {},
//   });


const [priceData,setPriceData] = useState({
    "size": {
        "S": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "M": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "L": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "XL": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "XXL": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ]
    },
    "material": {
        "Cotton": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "Poly": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "mesh": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "honeycomb": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "jersey": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ]
    },
    "printArea": {
        "Back": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "Front": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "Slevee": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ]
    },
    "printMethod": {
        "embroidery": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "screen": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "DTE": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "sublimation": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ],
        "full sublimation": [
            {
                "minQty": "1",
                "maxQty": "199",
                "minPrice": "4",
                "maxPrice": "5"
            },
            {
                "minQty": "200",
                "maxQty": "499",
                "minPrice": "3.8",
                "maxPrice": "4"
            },
            {
                "minQty": "500",
                "maxQty": "999",
                "minPrice": "3.5",
                "maxPrice": "3.8"
            },
            {
                "minQty": "1000",
                "maxQty": "1000000",
                "minPrice": "3",
                "maxPrice": "3.5"
            }
        ]
    }
})


  const [id,setId] = useState()
  const [update,setUpdate] = useState(false)

  const [currentCategory, setCurrentCategory] = useState('');
  const [currentOption, setCurrentOption] = useState('');
  const [quantityRanges, setQuantityRanges] = useState([{ minQty: 0, maxQty: 0, minPrice: 0, maxPrice: 0 }]);

  // Handle adding new quantity range
  const handleAddRange = () => {
    setQuantityRanges([...quantityRanges, { minQty: 0, maxQty: 0, minPrice: 0, maxPrice: 0 }]);
  };

  // Handle removing quantity range
  const handleRemoveRange = (index) => {
    const newRanges = [...quantityRanges];
    newRanges.splice(index, 1);
    setQuantityRanges(newRanges);
  };

  // Handle changes in the quantity range fields
  const handleRangeChange = (index, field, value) => {
    const newRanges = [...quantityRanges];
    newRanges[index][field] = value;
    setQuantityRanges(newRanges);
  };

  // Handle adding new price data to the selected category (size, material, etc.)
  const handleAddPriceData = () => {
    if (!currentCategory || !currentOption) return;

    const updatedPriceData = {
      ...priceData,
      [currentCategory]: {
        ...priceData[currentCategory],
        [currentOption]: [...quantityRanges],
      },
    };
    setPriceData(updatedPriceData);
    console.log('Current Price Data:', updatedPriceData);

    // Reset form fields after submission
    // setCurrentOption('');
    // setQuantityRanges([{ minQty: 0, maxQty: 0, minPrice: 0, maxPrice: 0 }]);
    toast.success('Done')
  };

  // Generate final priceData
  const handleGeneratePriceData = () => {
    console.log('Final Price Data:', priceData);


    const handleSubmit = async () => {
        try {
  
          if(update)
          {
            const response = await axiosInstance.post('/updateUniformRates', {
              data: priceData,
              id
            });
  
            toast.dismiss()
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
            
          }
          else
          {
            const response = await axiosInstance.post('/addUniformRates', {
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
        const response = await axiosInstance.get('/getUniformRates');
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
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Add Uniform Price Data</h2>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Category</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="size">Size</option>
            <option value="material">Material</option>
            <option value="printArea">Print Area</option>
            <option value="printMethod">Print Method</option>
          </select>
        </div>

        {/* Option Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Option Name (e.g., S, M, L for Size)</label>
          <input
            type="text"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="Enter option name"
            value={currentOption}
            onChange={(e) => setCurrentOption(e.target.value)}
            required
          />
        </div>

        {/* Quantity Ranges & Price Data */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Quantity Ranges & Price Data</h3>
          {quantityRanges.map((range, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Quantity</label>
                  <input
                    type="number"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.minQty}
                    required
                    onChange={(e) => handleRangeChange(index, 'minQty', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Quantity</label>
                  <input
                    type="number"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.maxQty}
                    required
                    onChange={(e) => handleRangeChange(index, 'maxQty', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.minPrice}
                    required
                    onChange={(e) => handleRangeChange(index, 'minPrice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={range.maxPrice}
                    required
                    onChange={(e) => handleRangeChange(index, 'maxPrice', e.target.value)}
                  />
                </div>
              </div>
              {quantityRanges.length > 1 && (
                <button
                  type="button"
                  className="mt-4 text-red-600 hover:text-red-800"
                  onClick={() => handleRemoveRange(index)}
                >
                  Remove Range
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleAddRange}
          >
            Add Range
          </button>
        </div>

        <button
          type="button"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
          onClick={handleAddPriceData}
        >
          Add Price Data
        </button>

        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
          onClick={handleGeneratePriceData}
        >
          Save Price Data
        </button>
      </div>


      <PricingDisplay pricingData={priceData}/>
    </div>
  );
};

export default AddUniformPriceData;
