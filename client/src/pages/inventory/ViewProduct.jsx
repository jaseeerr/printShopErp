import React, { useEffect, useState } from "react";
import axios from "axios";
import { PackageIcon,ArrowUpIcon,ArrowDownIcon,ShoppingCartIcon } from "lucide-react"
import toast from "react-hot-toast";
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

  const addToCart = async(product) => {
    try {
      const response = await axiosInstance.post('/addToCart', {
        pid: product._id,
        code:product.code,
        
      });
  
      if (response.status === 200) {
        toast.success('Product added to cart successfully!');
        return response.data;
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      toast.error(`Error adding product to cart: ${error.response?.data?.message || error.message}`);
      return null;
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
    if(!localStorage.getItem('userToken'))
      {
        localStorage.removeItem('userToken')
        localStorage.removeItem('superUser')
        location.href='/login'
      }

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
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 lg:w-1/3 relative">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover"
            layout="responsive"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-gray-600 font-semibold">{product.category}</div>
            <h2 className="text-xl font-semibold text-gray-900 mt-2">{product.name}</h2>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Code:</span> {product.code}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Cartoons:</span> {product.cartoons}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Area:</span> {product.storageArea}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Dimensions:</span> {product.dimensions}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Weight:</span> {product.weight}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Damaged Stock:</span> {product.damagedStock}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Stock Alert Quantity:</span> {product.minStock}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-gray-600">
                <span className="font-medium">Packing:</span> {product.packingDetails}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p className="text-3xl font-bold text-gray-900">AED {product.price.toFixed(2)}</p>
            <div className={`mt-2 sm:mt-0 flex items-center  ${Number(product.stock) <=5 ? 'text-red-700' : 'text-green-600' }`}>
              <PackageIcon className="h-5 w-5 mr-2" />
              <span>{product.stock} in stock</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Stock Out
            </button>
            <button
              onClick={() => setAddStockModalOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Add Stock
            </button>
            <button
              onClick={() => addToCart(product)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

          {/* History Card with Scrollable List */}
          <div className="mt-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Stock History</h3>
        <div className="mt-4 h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...product.history].reverse().map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.invoiceNumber ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.invoiceNumber ? (
                        <>
                          <ArrowDownIcon className="mr-1 h-3 w-3" />
                          Sold
                        </>
                      ) : (
                        <>
                          <ArrowUpIcon className="mr-1 h-3 w-3" />
                          Added
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.invoiceNumber || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
