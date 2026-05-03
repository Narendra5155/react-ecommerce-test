import { useCallback, useState } from "react"
import { CartContext } from "./cartUtils"

function CardProvider({children}) {

  const [cart, setCart] = useState([])

  const addToCart = useCallback((id) => {
    setCart(prev => {
      const item = prev.find(item => item.id === id)
      if (item) {
        return prev.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item)
      }
      return [...prev, {id, quantity: 1}]
    })
  }, [])
  
  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      return prev.filter(item => item.id !== id)
    })
  }, [])

  const decreaseQuantity = useCallback((id) => {
    setCart(prev => {
      return prev.map(item => item.id === id ? item.quantity >1 ? {...item, quantity: item.quantity - 1} : null: item).filter(Boolean)
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export default CardProvider