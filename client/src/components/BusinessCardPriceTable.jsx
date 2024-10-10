import React from 'react';

// Price data
// const priceData = {
//     "gsm": {
//         "300": {
//             "1-199": [0.7, 0.7]
//         },
//         "600": {
//             "1-199": [0.7, 0.7]
//         }
//     },
//     "lamination": {
//         "matte": {
//             "1-199": [0.3, 0.3],
//             "200-499": [0.2, 0.2]
//         }
//     },
//     "cutting": {},
//     "color": {},
//     "printType": {}
// };

// Single component to display the price data
const PriceDisplay = ({priceData}) => {
    const renderPriceData = (data) => {
        return Object.entries(data).map(([category, options]) => (
            <div key={category} className="mb-4 border-2">
                <h2 className="text-xl font-bold">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <ul className="list-disc ml-6">
                    {Object.entries(options).length === 0 ? (
                        <li>No data available</li>
                    ) : (
                        Object.entries(options).map(([option, ranges]) => (
                            <li key={option} className="mt-2">
                                <span className="font-semibold">{option}:</span>
                                <ul className="list-disc ml-6">
                                    {Object.entries(ranges).map(([range, prices]) => (
                                        <li key={range}>
                                            {range}: AED {prices.join(' / AED ')}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        ));
    };

    return (
        <div className="container mx-auto p-4 flex border">
            <h1 className="text-2xl font-bold mb-4">Price Data</h1>
            {renderPriceData(priceData)}
        </div>
    );
};

export default PriceDisplay;
