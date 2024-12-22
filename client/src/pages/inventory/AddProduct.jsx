import React, { useState } from "react";

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    pid: "",
    name: "",
    price: "",
    stock: "",
    invoiceNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      pid: "",
      name: "",
      price: "",
      stock: "",
      invoiceNumber: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Add Product
      </h2>

      <div className="mb-4">
        <label
          htmlFor="pid"
          className="block text-gray-600 font-medium mb-1"
        >
          Product ID
        </label>
        <input
          type="text"
          id="pid"
          name="pid"
          value={formData.pid}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

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
          type="text"
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
          type="text"
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
          htmlFor="invoiceNumber"
          className="block text-gray-600 font-medium mb-1"
        >
          Invoice Number
        </label>
        <input
          type="text"
          id="invoiceNumber"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

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
