import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import MyAxiosInstance from "../../../utils/axios"

export default function CartPage() {
  const axiosInstance = MyAxiosInstance()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [spinner,setSpinner] = useState(false) 
  const fetchCartData = async () => {
    try {
      const response = await axiosInstance.get("/getCart") // Replace with actual backend endpoint
      return response.data.products
    } catch (error) {
      console.error("Error fetching cart data:", error.message)
      return []
    }
  }

  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true)
      const cartData = await fetchCartData()
      setItems(cartData)
      setLoading(false)
    }

    loadCartData()
  }, [])

  const updateQuantity = async (id, newQuantity) => {
    setSpinner(true)
    setItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item)),
    )
    try {
      const response = await axiosInstance.put('/updateCartQuantity', {
           
          pid:id,
          quantity:newQuantity
      });

      console.log('Response:', response.data);
      
      return response.data; // Return the response data if needed
  } catch (error) {
      if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Error:', error.response.data.message);
      } else if (error.request) {
          // No response was received
          console.error('Error: No response received');
      } else {
          // Other errors
          console.error('Error:', error.message);
      }
  }
  }

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart 
        {/* <span className="w-10 h-10"> */}
        {spinner &&
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="6" height="14" opacity="1"><animate id="spinner_aqiq" begin="0;spinner_xVBj.end-0.25s" attributeName="y" dur="0.75s" values="1;5" fill="freeze"/><animate begin="0;spinner_xVBj.end-0.25s" attributeName="height" dur="0.75s" values="22;14" fill="freeze"/><animate begin="0;spinner_xVBj.end-0.25s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></rect><rect x="9" y="4" width="6" height="14" opacity=".4"><animate begin="spinner_aqiq.begin+0.15s" attributeName="y" dur="0.75s" values="1;5" fill="freeze"/><animate begin="spinner_aqiq.begin+0.15s" attributeName="height" dur="0.75s" values="22;14" fill="freeze"/><animate begin="spinner_aqiq.begin+0.15s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></rect><rect x="17" y="4" width="6" height="14" opacity=".3"><animate id="spinner_xVBj" begin="spinner_aqiq.begin+0.3s" attributeName="y" dur="0.75s" values="1;5" fill="freeze"/><animate begin="spinner_aqiq.begin+0.3s" attributeName="height" dur="0.75s" values="22;14" fill="freeze"/><animate begin="spinner_aqiq.begin+0.3s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></rect></svg>        

        }
        {/* </span> */}
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">Loading your cart...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mb-4 sm:mb-0 sm:mr-6"
                />
                <div className="flex-grow sm:mr-6">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">{item.category}</p>
                  <p className="text-gray-600">Code: {item.code}</p>
                </div>
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, Number.parseInt(e.target.value, 10))}
                    className="w-16 text-center border border-gray-300 rounded-md"
                    min={1}
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right sm:ml-6">
                  <p className="text-lg font-semibold">AED {(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xl font-semibold mb-4 sm:mb-0">Subtotal: AED {subtotal.toFixed(2)}</p>
            <button className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

