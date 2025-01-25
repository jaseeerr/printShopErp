import React, { useEffect, useState } from "react";
import MyAxiosInstance from '../../../utils/axios';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Upload, X ,ChevronDown } from 'lucide-react';

const ProductForm = ({ closeModal }) => {
  const axiosInstance = MyAxiosInstance();

  const [categories,setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearch(''); // Clear the search box once a category is selected
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Uploading Product');
  
    if (!imageFile) {
      toast.error('No image selected');
      return;
    }
  
    try {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'random');
      data.append('cloud_name', 'dqrtxw295');
  
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dqrtxw295/auto/upload',
        data
      );
  
      const updatedFormData = { ...formData,category:selectedCategory, image: cloudinaryResponse.data.secure_url };
  // toast.dismiss()
      // toast.loading('Adding Product');
  
      const response = await axiosInstance.post('/addProduct', updatedFormData);
   toast.dismiss()
      toast.success('Product added successfully');
      console.log('Product added successfully:', response.data);
      closeModal();
      setTimeout(()=>{
        location.reload()
      },500)
  
    } catch (error) {
      toast.error('Error Uploading Image or Adding Product');
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const [su,setSu] = useState(false)

   useEffect(() => {
      const fetchCat = async () => {
        const res = await axiosInstance.get("/getAllCategories")
        setCategories(res.data.categories.reverse())
      }

      const x = localStorage.getItem('superUser')

    if(x=='P@$$')
    {
      setSu(true)
    }
    else
    {
      setSu(false)
    }
  
      fetchCat()

    }, [])

   

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md overflow-auto h-[65vh]"
    >
      {/* <h2 className="text-2xl font-bold mb-6 text-black text-center">
        Add Product
      </h2> */}

<div className="mb-4">
        <label
          htmlFor="code"
          className="block text-gray-700 font-medium mb-1"
        >
          Product Code
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          
        />
      </div>


      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-medium mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="mb-4">
      <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
        Category
      </label>
      <div className="relative">
        {/* Read-only input showing the selected category */}
        <input
          type="text"
          value={selectedCategory.name || 'Select a category'}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
        />
        {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} /> */}
        
        {/* Searchable input box */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black mt-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Search categories"
        />
        
        {/* Dropdown list of matching categories */}
        {filteredCategories.length > 0 && (
          <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-20 overflow-auto z-10">
            {filteredCategories.map((category) => (
              <li
                key={category.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>


{su &&
 <div className="mb-4">
 <label
   htmlFor="costPrice"
   className="block text-gray-700 font-medium mb-1"
 >
   Cost Price
 </label>
 <input
   type="number"
   id="costPrice"
   name="costPrice"
   value={formData.costPrice}
   onChange={handleChange}
   className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
   
 />
</div>
}
     

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-gray-700 font-medium mb-1"
        >
          Selling Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="stock"
          className="block text-gray-700 font-medium mb-1"
        >
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-gray-700 font-medium mb-1"
        >
          Product Image
        </label>
        <div className="relative">
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <label
            htmlFor="image"
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <Upload size={18} className="mr-2" />
            {imageFile ? 'Change Image' : 'Upload Image'}
          </label>
        </div>
      </div>

      {imageUrl && (
        <div className="mb-4 border-2 border-gray-300 rounded-lg p-2">
          <h3 className="text-gray-700 font-medium text-center mb-2">Image Preview</h3>
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Product Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImageUrl(null);
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
              aria-label="Remove image"
            >
              <X size={16} className="text-black" />
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-300"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;