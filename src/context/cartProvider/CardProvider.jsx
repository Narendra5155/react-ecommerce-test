import { useCallback, useMemo, useState } from "react"
import { CartContext } from "./cartUtils"
import { useInventoryContext } from "../inventoryProviders/inventoryUtils"

function CardProvider({children}) {

  const [cart, setCart] = useState([])

  const {inventory,reduceQuantity,increaseQuantity} = useInventoryContext()

  const addToCart = useCallback((id) => {
    const inventoryItem = inventory.find(item => item.id === id)
    const cartItem = cart.find(item => item.id === id)
    const remainCartItems = cart.filter(item => item.id !== id)
    if(inventoryItem && inventoryItem.quantity > 0) {
      reduceQuantity(id)
      setCart( [...remainCartItems, {id, quantity: cartItem ? cartItem.quantity + 1 : 1}])
    }
  }, [reduceQuantity,cart,inventory])
  
  const removeFromCart = useCallback((id) => {
    const itemToRemove = cart.find(item => item.id === id)
    const remainCartItems = cart.filter(item => item.id !== id)
    if (itemToRemove) {
      increaseQuantity(id,itemToRemove.quantity)
      setCart(remainCartItems)
    }
  }, [cart,increaseQuantity])

  const decreaseQuantity = useCallback((id) => {
    const cartItem = cart.find(item => item.id === id)
    const remainCartItems = cart.filter(item => item.id !== id)
    if (cartItem) {
      increaseQuantity(id)
      if(cartItem.quantity > 1) {
        setCart( [...remainCartItems, {id, quantity: cartItem.quantity - 1}])
      } else {
        setCart(remainCartItems)
      }
    }
  }, [increaseQuantity,cart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const totalCartItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart])

  const totalCartPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }, [cart])
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart, totalCartItems, totalCartPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export default CardProvider