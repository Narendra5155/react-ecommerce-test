import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils"

function ProductPage() {

  const {data,isLoading,error,refetch } = useInventoryContext()
  return (
    <div>ProductPage</div>
  )
}

export default ProductPage