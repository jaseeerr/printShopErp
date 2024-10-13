import React from 'react';

// Helper function to transform nested data into an array format
const transformData = (section) => {
  const transformed = [];

  Object.keys(section).forEach((category) => {
    Object.entries(section[category]).forEach(([range, values]) => {
      const [minPrice, maxPrice] = values;
      const [minQty, maxQty] = range.includes('+')
        ? [range.replace('+', ''), '∞']
        : range.split('-').map((val) => val.trim());

      transformed.push({
        category,
        minQty,
        maxQty,
        minPrice,
        maxPrice,
      });
    });
  });

  return transformed;
};

// Reusable Table component to display each section's data
const PricingTable = ({ title, items }) => (
  <div className="my-6 mx-2">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Min Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Max Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Min Price</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Max Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
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

// Main component to display all sections' data for wedding cards
const WeddingCardTable = ({ data }) => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Wedding Card Pricing Overview</h1>
      <div className="w-full flex flex-wrap">
        <PricingTable title="Type" items={transformData(data.type || {})} />
        <PricingTable title="Size" items={transformData(data.size || {})} />
        <PricingTable title="Envelope" items={transformData(data.envelope || {})} />
        <PricingTable title="Print Side" items={transformData(data.printSide || {})} />
        <PricingTable title="Custom" items={transformData(data.custom || {})} />
        <PricingTable title="Lamination" items={transformData(data.lamination || {})} />

      </div>
    </div>
  );
};

export default WeddingCardTable;
