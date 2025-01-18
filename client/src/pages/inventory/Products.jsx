import React, { useState, useEffect } from "react";
import { Edit, Download, X, Plus, Camera } from 'lucide-react';  // Ensure you import Plus and Camera icons
import MyAxiosInstance from "../../../utils/axios";
import Modal from "react-modal";
import ProductForm from "./AddProduct"; // Import the ProductForm component
import QrScanner from "../scanner/Scanner"; // Import the QrScanner component
import { IMG_CDN } from "../../../urls/urls";
import { QRCodeCanvas } from "qrcode.react"; 

const ProductPage = () => {
  const axiosInstance = MyAxiosInstance();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
  
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/getAllProducts");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const openQrScannerModal = () => {
    setIsQrScannerModalOpen(true);
  };

  const closeQrScannerModal = () => {
    setIsQrScannerModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Product List</h1>

      {/* Bar with buttons */}
      <div className="flex justify-between mb-6">
        <div>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search products by name"
          />
        </div>
        <div className="flex space-x-4">
          {/* Add Product Button */}
          <button
            onClick={openAddProductModal}
            className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </button>
          {/* QR Scanner Button */}
          <button
            onClick={openQrScannerModal}
            className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            <Camera size={18} className="mr-2" />
            Scan QR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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
              <a href={`/view/${product._id}`}>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{product.name}</h2>
              </a>
              <p className="text-gray-600 mb-2">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
              <QRCodeCanvas
                value={`https://notebook.estateconnect.cloud/view/${product._id}`}
                // value={`http://localhost:5173/view/${product._id}`}
                className="p-4 bg-white border border-gray-200 rounded"
                size={75}
              />
              <div className="flex justify-between">
                <button
                  className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <Edit size={18} className="mr-2" />
                  Edit
                </button>
                <button
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

      {/* Modal for adding product */}
      <Modal
        isOpen={isAddProductModalOpen}
        onRequestClose={closeAddProductModal}
        contentLabel="Add Product"
        className="bg-white p-1 rounded-lg shadow-xl max-w-md mx-auto mt-2 h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <ProductForm closeModal={closeAddProductModal} />
        <button
        type="button"
        onClick={closeAddProductModal}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Close
      </button>
      </Modal>

      {/* Modal for QR scanner */}
      <Modal
        isOpen={isQrScannerModalOpen}
        onRequestClose={closeQrScannerModal}
        contentLabel="QR Code Scanner"
        className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <QrScanner closeModal={closeQrScannerModal} />
        <button
        type="button"
        onClick={closeQrScannerModal}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Close
      </button>
      </Modal>
    </div>
  );
};

export default ProductPage;
