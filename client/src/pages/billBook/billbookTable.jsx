import React from 'react';

// Helper function to transform nested data into an array format
const transformData = (section) => {
  const transformed = [];

  Object.keys(section).forEach((size) => {
    Object.entries(section[size]).forEach(([range, values]) => {
      const [minPrice, maxPrice] = values;
      const [minQty, maxQty] = range.includes('+') 
        ? [range.replace('+', ''), '∞'] 
        : range.split('-').map((val) => val.trim());

      transformed.push({
        size,
        minQty,
        maxQty,
        minPrice,
        maxPrice,
      });
    });
  });

  return transformed;
};

// Reusable Table component for rendering each section
const PricingTable = ({ title, items,unit }) => (
  <div className="my-6 mx-2">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">{unit}</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Min Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Max Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Min Price</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Max Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="border border-gray-300 px-4 py-2">{item.size}</td>
              <td className="border border-gray-300 px-4 py-2">{item.minQty}</td>
              <td className="border border-gray-300 px-4 py-2">{item.maxQty}</td>
              <td className="border border-gray-300 px-4 py-2">{item.minPrice}</td>
              <td className="border border-gray-300 px-4 py-2">{item.maxPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Main component to render the entire data overview
const BillBookTable = ({ data }) => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Data Overview</h1>
      <div className="w-full flex flex-wrap">
        <PricingTable title="Size Pricing" unit='Size' items={transformData(data.size || {})} />
        <PricingTable title="Copies Pricing" unit='Copies' items={transformData(data.copies || {})} />
        <PricingTable title="Color Pricing" unit='Color' items={transformData(data.color || {})} />
      </div>
    </div>
  );
};

export default BillBookTable;
