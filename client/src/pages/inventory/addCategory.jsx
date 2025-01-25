import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import MyAxiosInstance from "../../../utils/axios"
import { Search, Plus, Trash2 } from "lucide-react"

const CategoryModal = () => {
  const axiosInstance = MyAxiosInstance()
  const [categoryName, setCategoryName] = useState("")
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddCategory = async (e) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty")
      return
    }

    try {
      const response = await axiosInstance.post("/addCategory", { name: categoryName })

      if (response.status === 201) {
        toast.success("Category added successfully!")
        setCategories(response.data.category.reverse())
        setCategoryName("")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Error:", error.response ? error.response.data : error.message)
    }
  }

  const handleDeleteCategory = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this category?")

    if (isConfirmed) {
      try {
        const res = await axiosInstance.get(`/deleteCategory/${id}`)

        if (res.data.success) {
          toast.success("Category deleted successfully!")
          setCategories(res.data.categories.reverse())
        } else {
          toast.error("Error deleting category")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("Something went wrong while deleting.")
      }
    } else {
      toast.info("Category deletion cancelled.")
    }
  }

  useEffect(() => {
    const fetchCat = async () => {
      const res = await axiosInstance.get("/getAllCategories")
      setCategories(res.data.categories.reverse())
    }

    fetchCat()
  }, [])

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <form onSubmit={handleAddCategory} className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
        <div className="flex">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-grow border-gray-300 rounded-l-md shadow-sm focus:ring-black focus:border-black p-2"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="w-full max-w-md">
        {filteredCategories.length > 0 ? (
          <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200 max-h-[25vh] overflow-auto">
            {filteredCategories.map((category, index) => (
              <li key={index} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <span className="text-lg font-medium">{category?.name}</span>
                <button onClick={() => handleDeleteCategory(category._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-4">No categories found.</p>
        )}
      </div>
    </div>
  )
}

export default CategoryModal

