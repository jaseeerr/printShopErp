import React, { useState, useEffect,useRef } from "react";
import { Edit, Download, X, Plus, Camera } from 'lucide-react';
import MyAxiosInstance from "../../../utils/axios";
import Modal from "react-modal";
import ProductForm from "./AddProduct";
import QrScanner from "../scanner/Scanner";
import { IMG_CDN } from "../../../urls/urls";
import { QRCodeCanvas } from "qrcode.react";

const ProductPage = () => {
  const axiosInstance = MyAxiosInstance();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
  const qrRef = useRef(null);
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

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      // Define padding size (e.g., 20px)
      const padding = 10;
  
      // Create a new canvas with padding
      const newCanvas = document.createElement("canvas");
      const ctx = newCanvas.getContext("2d");
  
      // Set new canvas size, considering padding
      newCanvas.width = canvas.width + padding * 2;
      newCanvas.height = canvas.height + padding * 2;
  
      // Fill the new canvas with white color (or any color you want)
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
  
      // Draw the QR code from the original canvas onto the new one, with padding
      ctx.drawImage(canvas, padding, padding);
  
      // Get the image URL of the new canvas
      const imageURL = newCanvas.toDataURL("image/png");
  
      // Create a link to download the image
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = `QRCode.png`; // Naming the QR code
      link.click();
    }
  };

  const openAddProductModal = () => setIsAddProductModalOpen(true);
  const closeAddProductModal = () => setIsAddProductModalOpen(false);
  const openQrScannerModal = () => setIsQrScannerModalOpen(true);
  const closeQrScannerModal = () => setIsQrScannerModalOpen(false);

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-black">Product List</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Search products by name"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={openAddProductModal}
            className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            aria-label="Add Product"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </button>
          <button
            onClick={openQrScannerModal}
            className="flex items-center justify-center bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            aria-label="Scan QR Code"
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
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-200"
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <a href={`/view/${product._id}`} className="block mb-2">
                <h2 className="text-2xl font-semibold text-black hover:underline">{product.name}</h2>
              </a>
              <p className="text-gray-600 mb-2">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
              <div className="mb-4">
                <QRCodeCanvas
                ref={qrRef}
                  value={`https://notebook.estateconnect.cloud/view/${product._id}`}
                  className="p-2 bg-white border border-gray-200 rounded"
                  size={100}
                />
              </div>
              <div className="flex justify-between">
                <button
                  className="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors duration-300"
                  aria-label={`Edit ${product.name}`}
                >
                  <Edit size={18} className="mr-2" />
                  Edit
                </button>
                <button
                onClick={downloadQRCode}
                  className="flex items-center justify-center bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                  aria-label={`Download QR Code for ${product.name}`}
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
        isOpen={isAddProductModalOpen}
        onRequestClose={closeAddProductModal}
        contentLabel="Add Product"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={closeAddProductModal}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black">Add Product</h2>
        <ProductForm closeModal={closeAddProductModal} />
      </Modal>

      <Modal
        isOpen={isQrScannerModalOpen}
        onRequestClose={closeQrScannerModal}
        contentLabel="QR Code Scanner"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={closeQrScannerModal}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black">Scan QR Code</h2>
        <QrScanner closeModal={closeQrScannerModal} />
      </Modal>
    </div>
  );
};

export default ProductPage;