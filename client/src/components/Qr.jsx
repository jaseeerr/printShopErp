// QRCodeGenerator.jsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = () => {
    const url = 'https://transport.syntegrateitsolutions.com/admin'
  if (!url) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded shadow-md">
        <p className="text-gray-500 font-medium">No URL provided</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-300 rounded shadow-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Scan the QR Code</h2>
      <QRCodeCanvas
        value={url}
        className="p-4 bg-white border border-gray-200 rounded"
        size={150}
      />
      <p className="text-gray-500 text-sm mt-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {url}
        </a>
      </p>
    </div>
  );
};

export default QRCodeGenerator;
