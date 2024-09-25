import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../urls/urls';
import MyAxiosInstance from '../../utils/axios';

const BusinessCardPriceData = () => {
  const axiosInstance = MyAxiosInstance();

  const [update,setUpdate] = useState(false)

  // States for storing data and selections
  const [itemList, setItemList] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  
  // States for form data
  const [itemId,setItemId] = useState('')
  const [itemName, setItemName] = useState('');
  const [mq, setMq] = useState(0);
  const [quantityRanges, setQuantityRanges] = useState([{ minQty: 0, maxQty: 0, minPrice: 0, maxPrice: 0 }]);

  // Fetch data on component mount
  useEffect(() => {
    const getData = async () => {
      const res = await axiosInstance.get('/getBusinessCardItems');
      if (res.data.success) {
        setItemList(res.data.data.map(item => item.item));
        setAllItems(res.data.data); // Store all items in state
      }
    };
    getData();
  }, []);

  // Handle item change from dropdown
  const handleItemChange = (e) => {
    const selected = e.target.value;
    setSelectedItem(selected);

    // Filter data for the selected item
    const selectedData = allItems.find(item => item.item === selected);

    if (selectedData) {
      setUpdate(true)
      console.log('si ',selectedData)
      // Populate form fields with selected item data
      setItemName(selectedData.item);
      setMq(selectedData.data[0].mq); // Assuming all mq are the same for all ranges
      setQuantityRanges(selectedData.data.map(range => ({
        minQty: range.minQty,
        maxQty: range.maxQty, // Convert back 'Infinity'
        minPrice: range.priceRange[0],
        maxPrice: range.priceRange[1]
      })));
    } else {
      setUpdate(false)
      // If new item, reset fields
      setItemName('');
      setMq(0);
      setQuantityRanges([{ minQty: 0, maxQty: 0, minPrice: 0, maxPrice: 0 }]);
    }
  };

  // Handle adding a new quantity range
  const handleAddRange = () => {
    setQuantityRanges([...quantityRanges, { minQty: 0, maxQty: 0, minPrice: 0, maxPrice: 0 }]);
  };

  // Handle removing a quantity range
  const handleRemoveRange = (index) => {
    const newRanges = [...quantityRanges];
    newRanges.splice(index, 1);
    setQuantityRanges(newRanges);
  };

  // Handle changes in each quantity range input
  const handleRangeChange = (index, field, value) => {
    const newRanges = [...quantityRanges];
    newRanges[index][field] = value;
    setQuantityRanges(newRanges);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItemData = {
      data: quantityRanges.map((range) => ({
        item: itemName,
        mq: parseInt(mq),
        minQty: parseInt(range.minQty),
        maxQty:  parseInt(range.maxQty),
        priceRange: [parseFloat(range.minPrice), parseFloat(range.maxPrice)],
      })),
    };

    console.log('New Price Data:', newItemData);

    if(update)
    {
      try {
      const res = await axios.post(`${SERVER_URL}/editBusinessCardItem/${itemId}`, {newItemData,itemId});
      console.log(res.data);
      alert('Price data Edited successfully!');
    } catch (error) {
      console.error('Error Editing price data:', error);
      alert('Failed to Edit price data. Please try again.');
    }
    }
    else
    {
 try {
      const res = await axios.post(`${SERVER_URL}/addBusinessCard`, newItemData);
      console.log(res.data);
      alert('Price data added successfully!');
    } catch (error) {
      console.error('Error adding price data:', error);
      alert('Failed to add price data. Please try again.');
    }
    }

   
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-center">Select Item</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedItem}
            required
            onChange={handleItemChange}
          >
            <option value="">New Item</option>
            {itemList.length > 0 &&
              itemList.map((x, index) => (
                <option key={index} value={x}>
                  {x}
                </option>
              ))}
          </select>
        </div>

        {/* Form for Updating or Adding New Price Data */}
        <h2 className="text-2xl font-bold mb-6 text-center">Business Card Price Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={itemName}
                required
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Quantity to Display (mq)</label>
              <input
                type="number"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={mq}
                required
                onChange={(e) => setMq(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Quantity Ranges & Price Data</h3>
            {quantityRanges.map((range, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Quantity</label>
                    <input
                      type="number"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={range.minQty}
                      required
                      onChange={(e) => handleRangeChange(index, 'minQty', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Quantity</label>
                    <input
                      type="text"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={range.maxQty}
                      required
                      onChange={(e) => handleRangeChange(index, 'maxQty', e.target.value)}
                      placeholder='Enter "Infinity" for unlimited max quantity'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Price per Piece</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={range.minPrice}
                      required
                      onChange={(e) => handleRangeChange(index, 'minPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Price per Piece</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full md:w-auto"
          >
            {update? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessCardPriceData;
