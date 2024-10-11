import React from 'react';

// Dynamic PricingTable component to display each table
const PricingTable = ({ title, items }) => (
    <div className="mb-8 mx-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
        <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
                <tr>
                    <th className="border border-gray-300 p-2 text-left">Min Qty</th>
                    <th className="border border-gray-300 p-2 text-left">Max Qty</th>
                    <th className="border border-gray-300 p-2 text-left">Min Price</th>
                    <th className="border border-gray-300 p-2 text-left">Max Price</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={index} className="bg-white">
                        <td className="border border-gray-300 p-2">{item.minQty}</td>
                        <td className="border border-gray-300 p-2">{item.maxQty}</td>
                        <td className="border border-gray-300 p-2">{item.minPrice}</td>
                        <td className="border border-gray-300 p-2">{item.maxPrice}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Main component that accepts dynamic data and generates tables
const PricingDisplay = ({ pricingData }) => {
    return (
        <div className="p-8 ">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Pricing Information</h1>
            {/* Dynamically loop through pricingData to generate tables for each category */}
          <div className='w-full flex flex-wrap'> 
          {Object.keys(pricingData).map((category) => (
                <div key={category}>
                    {Object.keys(pricingData[category]).map((subCategory) => (
                        <PricingTable
                            key={subCategory}
                            title={`${category.charAt(0).toUpperCase() + category.slice(1)}: ${subCategory}`}
                            items={pricingData[category][subCategory]}
                        />
                    ))}
                </div>
            ))}
          </div>
        </div>
    );
};

 export default PricingDisplay