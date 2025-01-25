import React, { useEffect, useRef, useState } from "react"
import { Phone, Mail, Globe, Calendar, FileText } from "lucide-react"
import ReactToPrint from "react-to-print"

// const products = [
//   { name: "Product 1", quantity: 2, unitPrice: 50, netPrice: 100 },
//   { name: "Product 2", quantity: 3, unitPrice: 30, netPrice: 90 },
//   { name: "Product 3", quantity: 1, unitPrice: 150, netPrice: 150 },
// ]

const InvoiceQuotation = ({data}) => {
    const [products,setProducts] = useState([])
    const [invoice,setInvoice] = useState('#')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    

  const invoiceRef = useRef();
  useEffect(()=>{
 console.log(data)
 if(data.length > 0)
 {
    setProducts(data)
    setInvoice(generateInvoiceNumber())
 }
//  setProducts(data)
  },[data])

  function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Last 2 digits of the year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // 2-digit day
    
    // Generate a 3-digit random number
    const randomNumber = Math.floor(100 + Math.random() * 900); 
  
    return `NB${year}${month}${day}${randomNumber}`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Define month names in short format
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const day = date.getDate(); // Get day without leading zero
    const month = monthNames[date.getMonth()]; // Get short month name
    const year = date.getFullYear(); // Get year
    
    return `${day} ${month} ${year}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice Details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            onChange={(e)=>setDate(e.target.value)}
            value={date}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoice}
            onChange={(e)=>setInvoice(e.target.value)}
            placeholder="Enter invoice number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>
      </div>
    </div>


      <div
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
        ref={invoiceRef}
      >
        {/* Header Section */}
        <div className="px-6 py-8 sm:px-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <img
                src="https://www.notebookprint.com/uploads/site/webp/logo1679634133.webp"
                alt="Company Logo"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notebook Advertising LLC</h1>
                <p className="text-sm text-gray-600">Opp. london Hotel,Sabka Bus Station</p>
                <p className="text-sm text-gray-600">Deira,Dubai, U.A.E.</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-1" />
                  <span><a href="mailto:sales@notebookprint.com">sales@notebookprint.com</a></span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-1" />
                  <span><a href="https://www.notebookprint.com">www.notebookprint.com</a></span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-1" />
                  <span><a href="tel:+971553020717">+971553020717</a></span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-gray-800">Quotation Invoice</h2>
              <div className="flex items-center justify-end mt-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(date)}</span>
              </div>
              <div className="flex items-center justify-end mt-1 text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-1" />
                <span>Invoice: {invoice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="px-6 py-8 sm:px-8">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
              <th className="pb-3 font-semibold text-gray-700">Code</th>
                <th className="pb-3 font-semibold text-gray-700">Product</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Quantity</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Unit Price</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Net Price</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 && products?.map((product, index) => (
                <tr key={index} className="border-b border-gray-200 last:border-b-0">
                      <td className="py-4 text-gray-800">{product?.code}</td>
                  <td className="py-4 text-gray-800">{product?.name}</td>
                  <td className="py-4 text-center text-gray-800">{product?.quantity}</td>
                  <td className="py-4 text-center text-gray-800">AED {Number(product?.price).toFixed(2)}</td>
                  <td className="py-4 text-center text-gray-800">AED {(Number(product?.quantity)*Number(product?.price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="px-6 py-4 sm:px-8 bg-gray-50">
  <div className="flex flex-col sm:flex-row justify-between items-center">
    <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
      <span className="text-xl font-semibold text-gray-800">Subtotal</span>
      <span className="text-xl font-bold text-gray-900 ml-4">
        AED {products?.reduce((acc, product) => acc + (Number(product?.quantity) * Number(product?.price)), 0).toFixed(2)}
      </span>
    </div>
    <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
      <span className="text-sm text-gray-600 ml-4">(+5% VAT)</span>
    </div>
    <div className="flex flex-col sm:flex-row items-center">
      <span className="text-xl font-semibold text-gray-800">Total</span>
      <span className="text-xl font-bold text-gray-900 ml-4">
        AED {(products?.reduce((acc, product) => acc + (Number(product?.quantity) * Number(product?.price)), 0) * 1.05).toFixed(2)}
      </span>
    </div>
  </div>
</div>


        {/* Footer Section */}
        <div className="px-6 py-8 sm:px-8 text-center bg-gray-100">
          <p className="text-gray-700 font-medium">Thank you for your business!</p>
          <p className="mt-2 text-sm text-gray-600">
            If you have any questions or concerns, please do not hesitate to contact us at{" "}
            <span className="font-semibold text-gray-800"><a href="mailto:sales@notebookprint.com">sales@notebookprint.com</a></span>.
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="text-center mt-6">
        <ReactToPrint
          trigger={() => (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Print Invoice
            </button>
          )}
          content={() => invoiceRef.current}
        />
      </div>
    </div>
  )
}

export default InvoiceQuotation
