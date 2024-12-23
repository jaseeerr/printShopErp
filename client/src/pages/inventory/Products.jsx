import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Edit, Download, X } from 'lucide-react'

import MyAxiosInstance from "../../../utils/axios";
import { IMG_CDN } from "../../../urls/urls";
// Modal component to edit product details
import Modal from "react-modal";
import { QRCodeCanvas } from "qrcode.react"; // QRCodeCanvas for rendering QR codes

// TailwindCSS Styling
const ProductPage = () => {
  const axiosInstance = MyAxiosInstance();

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null); // For storing uploaded image

  const qrRef = useRef(null); // Ref to capture the QR code canvas for downloading

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/getAllProducts"); // Adjust to your endpoint
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Open modal to edit product
  const openModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock: "", image: "" });
    setImageFile(null); // Reset image file input
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image file change (image upload)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Upload image to Cloudinary (or similar service)
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "random"); // Replace with your upload preset
    formData.append("cloud_name", "dqrtxw295"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqrtxw295/auto/upload",
        formData
      );
      return response.data.secure_url; // Return the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submission to edit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newImageUrl = formData.image; // Default to current image URL if no new image uploaded
    if (imageFile) {
      // Upload the new image and get the new URL
      newImageUrl = await uploadImage(imageFile);
    }

    try {
      const response = await axiosInstance.put(`/editProduct/${editingProduct._id}`, {
        ...formData,
        image: newImageUrl, // Update image URL if new image is uploaded
      });

      console.log("Product updated:", response.data);

      // Update the product in the state
      const updatedProducts = products.map((product) =>
        product._id === editingProduct._id
          ? { ...product, ...formData, image: newImageUrl }
          : product
      );
      setProducts(updatedProducts);

      // Close modal
      closeModal();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  // Function to download QR code as an image
  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const imageURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = `QRCode.png`; // Naming the QR code with the product name
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Product List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mb-2">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
              <QRCodeCanvas
              ref={qrRef} // Reference for downloading the canvas
              value={`http://localhost:5173/view/${product._id}`}
              className="p-4 bg-white border border-gray-200 rounded"
              size={75}
            />
              <div className="flex justify-between">
                <button
                  onClick={() => openModal(product)}
                  className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <Edit size={18} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(product)
                    downloadQRCode()
                  }}
                  className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  <Download size={18} className="mr-2" />
                  QR Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Product"
        className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Edit Product</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-gray-700 font-medium mb-2">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <div className="hidden">
        <QRCodeCanvas
          ref={qrRef}
          value={editingProduct ? `http://localhost:5173/view/${editingProduct._id}` : ''}
          size={150}
        />
      </div>
    </div>
  );
};

export default ProductPage;
