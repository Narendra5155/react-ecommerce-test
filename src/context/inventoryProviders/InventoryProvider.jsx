import { useCallback, useEffect, useState } from "react";
import {  InventoryContext } from "./inventoryUtils";
import { useFetch } from "../../hooks/useFetch";
import { INVENTORY_API_URL } from "../../../constants";

function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(null);
  const { data, isLoading, error, refetch } = useFetch(INVENTORY_API_URL);

  const reduceQuantity = useCallback((id) => { 
    setInventory(prev=>prev.map(item=> item.id === id ? {...item,quantity:item.quantity>0 ? item.quantity-1 : 0}:item))
  }, [])
  const increaseQuantity = useCallback((id,count=1) => { 
    setInventory(prev=>prev.map(item=> item.id === id ? {...item,quantity:item.quantity+count}:item))
  }, [])
  
  const removeProduct = useCallback((id) => {
    setInventory(prev=>prev.filter(item=>item.id!=id))
  },[])

  useEffect(() => {
    const updateInventory = async () => {
    setInventory(data?.map(item => ({
        ...item,
        quantity:10
      })));
    };

    updateInventory();
  }, [data]);


  return (
    <InventoryContext.Provider
      value={{
        inventory,
        isLoading,
        error,
        refetch,
        reduceQuantity,
        removeProduct,
        increaseQuantity
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export default InventoryProvider;
