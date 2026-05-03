import { useMemo } from "react"
import { useCartContext } from "../context/cartProvider/cartUtils"
import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils"


function CartPage() {

  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCartContext()
  const { inventory } = useInventoryContext()
  
  const cartItems = useMemo(() => {
    return inventory?.filter(item => cart.some(cartItem => cartItem.id === item.id)).map(item => ({
      ...item,
      count: cart.find(cartItem => cartItem.id === item.id)?.quantity || 0
    }))
  }, [inventory, cart])
  return (
    <div>
      <button onClick={clearCart} className="bg-blue-500 text-white p-2 rounded-md">Clear Cart</button>
      {cartItems && cartItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartItems.map((item) => (
            <div key={item.id}>
              <img src={item.image} alt={item.title} className="w-full h-40 object-contain rounded-md" />
              <p className="text-xl font-bold mb-2 text-gray-800">{item.title}</p>
              <p className="text-lg text-purple-600 mb-1 font-semibold">${(item.price*item.count).toFixed(2)}</p>
              <p className="text-sm text-gray-700">
                Quantity: <span className="font-bold">{item.count}</span>
              </p>
              <div>
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white p-2 rounded-md">Remove from Cart</button>
              </div>
              <div>
                <button onClick={() => decreaseQuantity(item.id)} className="bg-red-500 text-white p-2 rounded-md">Decrease Quantity</button>
                <button onClick={() => addToCart(item.id)} className="bg-blue-500 text-white p-2 rounded-md">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CartPage