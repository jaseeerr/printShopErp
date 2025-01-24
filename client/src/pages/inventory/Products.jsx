import React, { useState, useEffect,useRef } from "react";
import { Edit, Download, X,Eye,EyeOff , Plus, Camera,KeyRound,LogOut,Save, Upload,ChevronDown, FileSpreadsheet,Trash, ShoppingCart } from 'lucide-react';
import MyAxiosInstance from "../../../utils/axios";
import Modal from "react-modal";
import ProductForm from "./AddProduct";
import QrScanner from "../scanner/Scanner";
import { IMG_CDN } from "../../../urls/urls";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import PasswordForm from "./ChangePassword";
import PasswordFormSu from "./ChangeSuPassword";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';

import CategoryModal from "./addCategory";
const ProductPage = () => {
  const axiosInstance = MyAxiosInstance();
  const [products, setProducts] = useState([]);
  const [categories,setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
  const [isChangePasssword, setIsChangePasssword] = useState(false);
  const [isChangeSuPasssword, setIsChangeSuPasssword] = useState(false);
  const [categoryModal,setCategoryModal] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };
  const handleChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    });
  };
// handle edit product
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  toast.loading('Updating Product');

  try {
    let imageUrl = updatedProduct.image;

    // Upload image if a new one is selected
    if (imageFile) {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'random');
      data.append('cloud_name', 'dqrtxw295');

      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dqrtxw295/auto/upload',
        data
      );

      imageUrl = cloudinaryResponse.data.secure_url;
    }

    // Prepare updated product data
    const updatedFormData = { ...updatedProduct, image: imageUrl };

    // Send updated product details to backend
    await axiosInstance.put(`/editProduct/${updatedProduct._id}`, updatedFormData);
    toast.dismiss();
    toast.success('Product updated successfully');
    setTimeout(() => {
      location.reload();
    }, 500);
    
  } catch (error) {
    toast.dismiss();
    toast.error('Error updating product');
    console.error('Error:', error.response ? error.response.data : error.message);
  }
  
  setLoading(false);
};

  const qrRef = useRef(null);
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    };
  
    filterProducts();
  }, [products, searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/getAllProducts");
        setProducts(response.data.products);
        setCategories(response.data.categories)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if(!localStorage.getItem('userToken'))
    {
      localStorage.removeItem('superUser')
      location.href='/login'
    }
    const x = localStorage.getItem('superUser')

    if(x=='P@$$')
    {
      setIsToggled(true)
    }
    else
    {
      localStorage.removeItem('superUser')
      setIsToggled(false)

    }
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
  const closeChangePassswordModal = () => setIsChangePasssword(false);
  const openChangePassswordModal = () => setIsChangePasssword(true);
  const openChangeSuPassswordModal = () => setIsChangeSuPasssword(true);
  const closeChangeSuPassswordModal = () => setIsChangeSuPasssword(false);
  const openCategoryModal = () => setCategoryModal(true);
  const closeCategoryModal = ()=>setCategoryModal(false)


  const [isToggled, setIsToggled] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleToggleClick = () => {
    if(isToggled)
    {
      localStorage.removeItem('superUser')
      setIsToggled(false)
      return
    }
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async(e) => {
    e.preventDefault();

    const res = await axiosInstance.post('/loginSu',{password})
    if(res.data.success)
    {
      setIsToggled(true);
      localStorage.setItem('superUser','P@$$')
      setIsPasswordModalOpen(false);
      setPassword('');
      setError('');
    }
    else
    {
      localStorage.removeItem('superUser')
      setError('Incorrect password');
      setIsToggled(false)
    }
   
  };

  const closeModal = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
    setError('');
  };


  // filter cat
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract unique categories from products
  // useEffect(() => {
  //   const uniqueCategories = [...new Set(products.map((product) => product?.category))];
  //   setCategories(uniqueCategories);
  // }, [products]);

  // Update displayed products when category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product?.category === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory]);

  // Export displayed products to Excel
  const exportToExcel = () => {
    const exportData = filteredProducts.map(product => ({
      'Product Name': product.name,
      'Product Code': product.code || '',
      'Category': product?.category,
      'Cost Price (AED)': isToggled ? product.costPrice : 'null',
      'Selling Price (AED)': product.price.toFixed(2),
      'Stock': product.stock
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    XLSX.writeFile(workbook, 'Product_List.xlsx');
  };

  const deleteProduct = async(id)=>{
    // Ask for confirmation before deleting the product
    const isConfirmed = window.confirm('Are you sure you want to delete this product?');
  
    if (!isConfirmed) {
      toast.loading('Product deletion cancelled', { duration: 1000 });
      return;
    }
  
    try {
      // Show loading message
      toast.loading('Deleting product...', { duration: 1000 });
  
      // Send DELETE request to the server
      const res = await axiosInstance.delete(`/deleteProduct/${id}`);
  
      if (res.data.success) {
        // Show success message
        toast.success('Product deleted successfully!', { duration: 1000 });
        setTimeout(()=>{
             location.reload()
        },600)
      } else {
        // Show error message if the server response does not indicate success
        toast.error(res.data.message || 'Failed to delete the product', { duration: 1000 });
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'Failed to delete product'}`, { duration: 2000 });
      } else if (error.request) {
        toast.error('No response from the server. Please try again later.', { duration: 2000 });
      } else {
        toast.error(`An error occurred: ${error.message}`, { duration: 2000 });
      }
    }
  }

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


  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <div className="flex items-center justify-center p-4">
      <button
        className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${
          isToggled ? 'bg-black' : 'bg-gray-300'
        }`}
        onClick={handleToggleClick}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
            isToggled ? 'translate-x-6' : ''
          }`}
        ></div>
      </button>
      <span className="ml-3 text-sm font-medium text-gray-700">
        {isToggled ? 'ON' : 'OFF'}
      </span>
      <br />
    
    </div>  


{isToggled &&
 <span className="flex justify-center">
 <button
       onClick={openChangeSuPassswordModal}
       className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
       aria-label="Add Product"
     >
       <KeyRound size={18} className="mr-2" />
       Change Super User Password
     </button>
 </span>

}
   


       <div className="flex space-x-4 justify-center mt-7">
          <button
            onClick={openChangePassswordModal}
            className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            aria-label="Add Product"
          >
            <KeyRound size={18} className="mr-2" />
            Change Password
          </button>
          <button
            onClick={()=>{
              localStorage.removeItem('userToken')
              location.href='/login'
            }}
            className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            aria-label="Scan QR Code"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
       <div className="flex space-x-4 justify-center mt-7 mb-5">
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
          <button
            onClick={openCategoryModal}
            className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            aria-label="Add Product"
          >
            <Plus size={18} className="mr-2" />
            Add Category
          </button>
        </div>

        <div className="flex justify-center">
        <a
           href="/cart"
           className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
           aria-label="Scan QR Code"
          >
            <ShoppingCart size={18} className="mr-2" />
            View Cart
          </a>
        </div>
      <h1 className="text-4xl font-bold mb-8 text-black text-center">INVENTORY</h1>

{/* filter category */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
  <select
    className="p-3 border border-gray-300 rounded-md w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="">All Categories</option>
    {categories.map((category, index) => (
      <option className="text-gray-800" key={index} value={category?.name}>
        {category?.name}
      </option>
    ))}
  </select>

  <button
    onClick={exportToExcel}
    className="px-6 py-3 bg-gray-800 text-white rounded-md w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-200 ease-in-out"
  >
    Export to Excel
  </button>
</div>


{/* filter category */}


      <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Product Name / Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Search products by name"
          />
        </div>
       
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-200"
          >
            {/* <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 object-cover"
            /> */}
             <div className="relative">
    <img
      src={product.image || "/placeholder.svg"}
      alt={product.name}
      className="w-full h-80 object-cover"
    />
    <div className="absolute bottom-2 right-2 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
      <QRCodeCanvas
        ref={qrRef}
        // value={`http://localhost:5173/view/${product._id}`}
        value={`https://notebook.estateconnect.cloud/view/${product._id}`}
        size={80}  // Adjust the size as needed
      />
    </div>
  </div>
            <div className="p-6">
              <a href={`/view/${product._id}`} className="block mb-2">
                <h2 className="text-2xl font-semibold text-black hover:underline">{product.name}</h2>
              </a>
              <p className="text-gray-600 mb-2">Product Code: {product?.code}</p>
              <p className="text-gray-600 mb-2">Category: {product?.category}</p>
              {isToggled &&
              <p className="text-gray-600 mb-2">Cost Price: AED {product?.costPrice || 0}</p>
              }
              <p className="text-gray-600 mb-2">Price: AED {product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
             
              <div className="flex justify-between">
                <button
                onClick={()=>{
                  setUpdatedProduct(product)
                  setIsModalOpen(true)
                }}
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

                <button
                onClick={()=>{
                  deleteProduct(product._id)
                }}
                  className="flex items-center justify-center bg-gray-800 text-white py-2 px-3 rounded-lg hover:bg-black transition-colors duration-300"
                  aria-label={`Edit ${product.name}`}
                >
                  <Trash size={18} className="mr-2" />
                  Delete
                </button>
              </div>
              <div className="flex justify-center mt-2">
              <button
      type="button"
      onClick={()=>{
        addToCart(product)
      }}
      className="px-4 py-2 bg-gray-800 w-full text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-200 ease-in-out flex items-center justify-center"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Add to Cart
    </button>
              </div>


            </div>
          </div>
        ))}
      </div>


      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Enter Password</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition-colors duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md overflow-auto h-[80vh]">
         <h2 className="text-2xl font-semibold mb-6 text-black">Update Product</h2>
         <form onSubmit={handleSubmit} className="space-y-6">

         <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
        <input
          type="text"
          id="code"
          name="code"
          value={updatedProduct.code}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          
        />
      </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
             <input
               type="text"
               name="name"
               value={updatedProduct.name}
               onChange={handleChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
               required
             />
           </div>
 
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={updatedProduct?.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                
              >
                <option value={updatedProduct?.category}>{updatedProduct?.category}</option>
                {categories.map((x)=>{
                   return( <option value={X.name}>{x.name}</option>)
                })}
               
               
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
             {isToggled && 
              <div>
              <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                value={updatedProduct.costPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                
              />
            </div>
             }
         

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
             <input
               type="number"
               name="price"
               value={updatedProduct.price}
               onChange={handleChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
               
             />
           </div>
 
           {/* <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
             <input
               type="number"
               name="stock"
               value={updatedProduct.stock}
               onChange={handleChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
               required
             />
           </div> */}
 
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
             <div className="relative">
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleImageChange}
                 className="hidden"
                 id="file-upload"
               />
               <label
                 htmlFor="file-upload"
                 className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
               >
                 <Upload size={20} className="mr-2" />
                 Choose Image
               </label>
             </div>
             {updatedProduct.image && (
               <div className="mt-4">
                 <img src={updatedProduct.image || "/placeholder.svg"} alt="Product" className="h-32 w-32 rounded-lg object-cover mx-auto" />
               </div>
             )}
           </div>
 
           <div className="flex justify-end space-x-4 mt-8">
             <button
               type="button"
               onClick={()=>setIsModalOpen(false)}
               className="flex items-center px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors duration-300"
             >
               <X size={18} className="mr-2" />
               Cancel
             </button>
             <button
               type="submit"
               className={`flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
               disabled={loading}
             >
               <Save size={18} className="mr-2" />
               {loading ? 'Updating...' : 'Save Changes'}
             </button>
           </div>
         </form>
       </div>
     </div>
      )}

      <Modal
        isOpen={isAddProductModalOpen}
        onRequestClose={closeAddProductModal}
        contentLabel="Add Product"
        className="bg-white p-6 rounded-lg shadow-xl w-1/3 h-[80vh] mx-auto mt-2 outline-none"
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

      <Modal
        isOpen={isChangePasssword}
        onRequestClose={openChangePassswordModal}
        contentLabel="Change Password"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={closeChangePassswordModal}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        {/* <h2 className="text-2xl font-bold mb-4 text-black">Scan QR Code</h2> */}
        <PasswordForm closeModal={closeChangePassswordModal} />
        <button
            onClick={closeChangePassswordModal}
            className="flex w-full mt-3 font-semibold items-center justify-center bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            aria-label="Scan QR Code"
          >
          Close
          </button>
      </Modal>

      <Modal
        isOpen={isChangeSuPasssword}
        onRequestClose={openChangeSuPassswordModal}
        contentLabel="Change Su Password"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={closeChangeSuPassswordModal}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        {/* <h2 className="text-2xl font-bold mb-4 text-black">Scan QR Code</h2> */}
        <PasswordFormSu closeModal={closeChangeSuPassswordModal} />
        <button
            onClick={closeChangeSuPassswordModal}
            className="flex w-full mt-3 font-semibold items-center justify-center bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            aria-label="Scan QR Code"
          >
          Close
          </button>
      </Modal>

      <Modal
        isOpen={categoryModal}
        onRequestClose={openCategoryModal}
        contentLabel="Category Modal"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={closeCategoryModal}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        {/* <h2 className="text-2xl font-bold mb-4 text-black">Scan QR Code</h2> */}
        <CategoryModal />
        <button
            onClick={closeCategoryModal}
            className="flex w-full mt-3 font-semibold items-center justify-center bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            aria-label="Scan QR Code"
          >
          Close
          </button>
      </Modal>
    </div>
  );
};

export default ProductPage;