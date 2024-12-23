import React, { useState } from "react";
import MyAxiosInstance from '../../../utils/axios';
import axios from 'axios'
import toast from "react-hot-toast";
const ProductForm = () => {
  const axiosInstance = MyAxiosInstance()

  const [formData, setFormData] = useState({
   
    name: "",
    price: "",
    stock: "",
    image:''
  });

  const [imageFile, setImageFile] = useState(null);

  // State for the uploaded image URL (to show the image preview)
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Display image preview before upload
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result); // Set the image preview URL
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Uploading Image');
  
    if (!imageFile) {
      toast.error('No image selected');
      return;
    }
  
    try {
      // Prepare the FormData to send with the image
      const data = new FormData();
      data.append('file', imageFile); // Use the image file directly
      data.append('upload_preset', 'random'); // Replace with your Cloudinary upload preset
      data.append('cloud_name', 'dqrtxw295'); // Replace with your Cloudinary cloud name
  
      // Make a POST request to Cloudinary's upload API
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dqrtxw295/auto/upload',
        data
      );
  
      console.log(cloudinaryResponse);
  
      // Set the image URL in formData
      const updatedFormData = { ...formData, image: cloudinaryResponse.data.secure_url };
  
      toast.dismiss();
      toast.loading('Adding Product');
  
      // Add the product using the formData with the image URL
      const response = await axiosInstance.post('/addProduct', updatedFormData);
  
      toast.dismiss();
      toast.success('Product added successfully');
      console.log('Product added successfully:', response.data);
  
    } catch (error) {
      toast.dismiss();
      toast.error('Error Uploading Image or Adding Product');
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };





  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-16"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Add Product
      </h2>

     

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-600 font-medium mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-gray-600 font-medium mb-1"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="stock"
          className="block text-gray-600 font-medium mb-1"
        >
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

   
      <div className="mb-4">
    <label
      htmlFor="image"
      className="block text-gray-600 font-medium mb-1"
    >
      Product Image
    </label>
    <input
      type="file"
      id="image"
      name="image"
      onChange={handleImageChange}
      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      accept="image/*" // Only accept image files
    />
  </div>

  {imageUrl && (
        <div className="mb-4 border-2 border-gray-500 rounded-3xl p-2">
          <h3 className="text-gray-600 font-medium text-center">Image Preview</h3>
          <img
            src={imageUrl}
            alt="Image Preview"
            className="w-80 h-80 mt-2 rounded-lg mx-auto"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
