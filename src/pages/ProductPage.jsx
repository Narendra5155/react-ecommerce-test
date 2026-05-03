import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authProviders/authUtils";
import { useCartContext } from "../context/cartProvider/cartUtils";
import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils";
import { routes } from "../../constants";
import { useDebounce } from "../hooks/useDebounce";
import { useMemo, useState } from "react";

function ProductPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { inventory, isLoading, error, refetch } = useInventoryContext();
  const { addToCart, decreaseQuantity } = useCartContext();
  const navigate = useNavigate();
  const { isAuth } = useAuthContext();
  const [category, setCategory] = useState("");

  const filteredInventory = useMemo(() => {
    return inventory?.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [inventory, debouncedSearch]);

  const categories = useMemo(() => {
    return [...new Set(inventory?.map((item) => item.category))];
  }, [inventory]);

  const filteredWithCategoryInventory = useMemo(() => {
    if (category === "") {
      return filteredInventory;
    }
    return filteredInventory?.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase(),
    );
  }, [filteredInventory, category]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={refetch}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Refetch
      </button>
      {isLoading && (
        <p className="text-lg text-gray-500 text-center my-8">Loading...</p>
      )}
      {error && !inventory && (
        <p className="text-red-600 text-center font-semibold my-8">
          Error: {error}
        </p>
      )}
      {filteredWithCategoryInventory &&
        filteredWithCategoryInventory.length === 0 && (
          <p className="text-gray-500 text-center font-semibold my-8">
            No products found
          </p>
        )}
      {filteredWithCategoryInventory &&
        filteredWithCategoryInventory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWithCategoryInventory.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex flex-row justify-between items-center w-full">
                  <div>
                    <p className="text-xl font-bold mb-2 text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-lg text-purple-600 mb-1 font-semibold">
                      ${item.price}
                    </p>
                    <p className="text-sm text-gray-700">
                      Stock Available:{" "}
                      <span className="font-bold">{item.quantity}</span>
                    </p>
                  </div>
             
                    <p>Rating: {item.rating.rate}({item.rating.count})</p>
                </div>
                <div className={`w-full h-40 object-contain rounded-md`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-40 object-contain rounded-md ${item.quantity > 0 ? "opacity-100" : "opacity-50"}`}
                  />
                  <p className="text-sm text-gray-700 text-center">
                    {item.quantity > 0 ? "" : "Out of Stock"}
                  </p>
                </div>
                {isAuth ? (
                  <div>
                    <button
                      onClick={() => addToCart(item.id)}
                      disabled={item.quantity === 0}
                      className={`bg-blue-500 text-white p-2 rounded-md ${item.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      -
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => navigate(routes.login)}
                      className="bg-blue-500 text-white p-2 rounded-md"
                    >
                      Login to Add to Cart
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default ProductPage;
