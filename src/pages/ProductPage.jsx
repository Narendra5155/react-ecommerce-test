import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/authProviders/authUtils"
import { useCartContext } from "../context/cartProvider/cartUtils"
import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils"
import { routes } from "../../constants"

function ProductPage() {

  const { inventory, isLoading, error, refetch } = useInventoryContext()
  const { addToCart, decreaseQuantity } = useCartContext()
  const navigate = useNavigate()
  const { isAuth } = useAuthContext()
    
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={refetch} className="bg-blue-500 text-white p-2 rounded-md">Refetch</button>
      {isLoading && (
        <p className="text-lg text-gray-500 text-center my-8">Loading...</p>
      )}
      {error && !inventory && (
        <p className="text-red-600 text-center font-semibold my-8">
          Error: {error}
        </p>
      )}
      {inventory && inventory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start border border-gray-100 hover:shadow-lg transition"
            >
              <p className="text-xl font-bold mb-2 text-gray-800">{item.title}</p>
              <p className="text-lg text-purple-600 mb-1 font-semibold">${item.price}</p>
              <p className="text-sm text-gray-700">
                Stock Available: <span className="font-bold">{item.quantity}</span>
              </p>
              <img src={item.image} alt={item.title} className="w-full h-40 object-contain rounded-md" />
              {isAuth ? (
                <div>
                  <button onClick={() => addToCart(item.id)} className="bg-blue-500 text-white p-2 rounded-md">+</button>
                  <button onClick={() => decreaseQuantity(item.id)} className="bg-red-500 text-white p-2 rounded-md">-</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => navigate(routes.login)} className="bg-blue-500 text-white p-2 rounded-md">Login to Add to Cart</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductPage