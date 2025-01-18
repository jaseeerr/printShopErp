import React, { useState } from "react";
import MyAxiosInstance from '../../../utils/axios';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Upload, X } from 'lucide-react';

const ProductForm = ({ closeModal }) => {
  const axiosInstance = MyAxiosInstance();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Uploading Image', { duration: 2000 });
  
    if (!imageFile) {
      toast.error('No image selected');
      return;
    }
  
    try {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'random');
      data.append('cloud_name', 'dqrtxw295');
  
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dqrtxw295/auto/upload',
        data
      );
  
      const updatedFormData = { ...formData, image: cloudinaryResponse.data.secure_url };
  
      toast.loading('Adding Product', { duration: 2000 });
  
      const response = await axiosInstance.post('/addProduct', updatedFormData);
  
      toast.success('Product added successfully');
      console.log('Product added successfully:', response.data);
      closeModal();
  
    } catch (error) {
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
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      {/* <h2 className="text-2xl font-bold mb-6 text-black text-center">
        Add Product
      </h2> */}

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-medium mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-gray-700 font-medium mb-1"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="stock"
          className="block text-gray-700 font-medium mb-1"
        >
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-gray-700 font-medium mb-1"
        >
          Product Image
        </label>
        <div className="relative">
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <label
            htmlFor="image"
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <Upload size={18} className="mr-2" />
            {imageFile ? 'Change Image' : 'Upload Image'}
          </label>
        </div>
      </div>

      {imageUrl && (
        <div className="mb-4 border-2 border-gray-300 rounded-lg p-2">
          <h3 className="text-gray-700 font-medium text-center mb-2">Image Preview</h3>
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Product Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImageUrl(null);
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
              aria-label="Remove image"
            >
              <X size={16} className="text-black" />
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-300"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;