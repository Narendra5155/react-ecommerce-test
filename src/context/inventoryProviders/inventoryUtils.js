import { createContext, useContext } from "react";
import { INVENTORY_KEY } from "../../../constants";

export const InventoryContext = createContext()

export const useInventoryContext = () => {
  return useContext(InventoryContext)
}

/*

"id": 1,
"title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
"price": 109.95,
"description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
"category": "men's clothing",
"image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
"rating": {
"rate": 3.9,
"count": 120
}
*/

export const getItemsFromInventory = () => {
  return JSON.parse(localStorage.getItem(INVENTORY_KEY)||"[]")
}

export const setInventoryItemsOne = ({
  id,
  title,
  price,
  description,
  category,
  image,
  rating
}) => {
  const inventory = getItemsFromInventory()
  inventory.push({
    id,
    title,
    price,
    description,
    category,
    image,
    rating
  })
  localStorage.setItem(INVENTORY_KEY,JSON.stringify(inventory))
}

export const setInventoryFull = (items) => {
  const sanitizedItems = items.map(item => ({
    id:item.id,
    title:item.title,
    price:item.price,
    description:item.description,
    category:item.category,
    image:item.image,
    rating:item.rating
  }))

  localStorage.setItem(INVENTORY_KEY,JSON.stringify(sanitizedItems))
}
