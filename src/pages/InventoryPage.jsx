import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils"

function InventoryPage() {
  const { inventory, isLoading, error, refetch ,removeProduct} = useInventoryContext()
  return (
    <div>
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
            <div key={item.id}>
              <img src={item.image} alt={item.title} className="w-full h-40 object-contain rounded-md" />
              <p className="text-xl font-bold mb-2 text-gray-800">{item.title}</p>
              <p className="text-lg text-purple-600 mb-1 font-semibold">${item.price}</p>
              <p className="text-sm text-gray-700">
                Stock Available: <span className="font-bold">{item.quantity}</span>
              </p>
              <div className="flex flex-row gap-2 items-center">
                <button onClick={() => removeProduct(item.id)} className="bg-red-500 text-white p-2 rounded-md">Remove from Inventory</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InventoryPage