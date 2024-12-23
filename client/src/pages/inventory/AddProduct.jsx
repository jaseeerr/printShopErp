import React, { useState } from "react";
import MyAxiosInstance from '../../../utils/axios';
import axios from 'axios'
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

  const uploadSingleImageToCloudinary = async (image) => {
    try {
      // Fetch the image (in case it's a URL)
      const response = await fetch(image);
      const blob = await response.blob();
  
      // Create a unique filename using the current timestamp
      const newFileName = `img_${Date.now()}`;
  
      // Prepare the FormData to send with the image
      const data = new FormData();
      data.append('file', blob, newFileName);
      data.append('upload_preset', 'random'); // Replace with your upload preset
      data.append('cloud_name', 'dqrtxw295'); // Replace with your Cloudinary cloud name
  
      // Make a POST request to Cloudinary's upload API
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dfhcxw70v/auto/upload',
        data
      );
  
      // Handle Cloudinary response (return the public ID of the uploaded image)
      
      setFormData({ ...formData, image: cloudinaryResponse.data.public_id });
      return cloudinaryResponse.data.public_id;
    
    } catch (error) {
      // Log any errors that occur during the upload process
      console.error('Error uploading image to Cloudinary:', error);
      setFormData({ ...formData, image: null });
      return null; // Or you can handle errors based on your use case
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =async (e) => {

    e.preventDefault()
   await uploadSingleImageToCloudinary(imageFile)
    try {
      const response = await axiosInstance.post('/addProduct', formData);
      console.log('Product added successfully:', response.data);
      // Handle success - you can display a success message or update your UI here
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error.message);
      // Handle error - you can display an error message or update your UI here
    }
   
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
