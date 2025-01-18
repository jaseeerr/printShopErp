import React, { useEffect, useState } from "react";
import axios from "axios";
import MyAxiosInstance from '../../../utils/axios';
import { useParams } from 'react-router-dom';

const ViewProduct = () => {
  const axiosInstance = MyAxiosInstance();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [addStockQuantity, setAddStockQuantity] = useState(""); // For adding stock
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Fetch product details from the backend using axios
  const fetchProductDetails = async () => {
    try {
      const response = await axiosInstance.get(`/getProduct/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockOut = async () => {
    if (quantity <= 0 || !invoiceNumber) {
      alert("Please provide valid quantity and invoice number.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/stockout/${id}`, {
        quantity: parseInt(quantity),
        invoiceNumber,
      });
      setProduct(response.data.product);
      setModalOpen(false); // Close modal after successful stock out
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddStock = async () => {
    if (addStockQuantity <= 0) {
      alert("Please provide a valid quantity.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/addStock/${id}`, {
        quantity: parseInt(addStockQuantity),
      });
      setProduct(response.data.product);
      setAddStockModalOpen(false); // Close modal after successful stock add
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-10">
      {product ? (
        <div>
          {/* Product Card */}
          <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-400">
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-full object-cover border border-gray-400"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-xl text-gray-500 mt-2">AED {product.price}</p>
              <p className="text-gray-600 mt-4">{product.stock} in stock</p>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Stock Out
                </button>
                <button
                  onClick={() => setAddStockModalOpen(true)}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Add Stock
                </button>
              </div>
            </div>
          </div>

          {/* History Card with Scrollable List */}
          <div className="mt-6 max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-400">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">Stock History</h3>
              <div className="mt-4 h-64 overflow-y-auto">
                <ul className="list-disc pl-5 text-gray-600">
                  {product.history.map((item, index) => (
                    <li key={index}>
                      {item.quantity} units {item.invoiceNumber ? `sold (Invoice: ${item.invoiceNumber})` : `added`} on {new Date(item.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div>No product found</div>
      )}

      {/* Modal for Stock Out */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Stock Out</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Invoice Number</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleStockOut}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="ml-2 py-2 px-4 rounded bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add Stock */}
      {addStockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Stock</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={addStockQuantity}
                onChange={(e) => setAddStockQuantity(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddStock}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setAddStockModalOpen(false)}
                className="ml-2 py-2 px-4 rounded bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
