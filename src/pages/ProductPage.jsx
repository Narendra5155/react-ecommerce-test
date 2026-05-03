import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authProviders/authUtils";
import { useCartContext } from "../context/cartProvider/cartUtils";
import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils";
import { routes } from "../../constants";
import { useDebounce } from "../hooks/useDebounce";
import { useMemo, useState } from "react";

function StarRating({ rate, count }) {
  const filled = Math.round(rate);
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: "#f59e0b", fontSize: "0.8rem", letterSpacing: "0.04em" }}>
        {"★".repeat(filled)}
        <span style={{ opacity: 0.25 }}>{"★".repeat(5 - filled)}</span>
      </span>
      <span className="text-muted text-xs">{rate.toFixed(1)} ({count})</span>
    </div>
  );
}

function ProductSkeletonCard() {
  return (
    <div className="card rounded-2xl border flex flex-col overflow-hidden">
      <div className="product-img-area">
        <div className="skeleton w-full h-44 rounded-xl" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-3 w-2/5" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex justify-between items-end">
          <div className="skeleton h-6 w-1/4" />
          <div className="skeleton h-3 w-1/5" />
        </div>
        <div className="skeleton h-px w-full" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <ProductSkeletonCard key={i} />
      ))}
    </div>
  );
}

function ProductPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { inventory, isLoading, error, refetch } = useInventoryContext();
  const { addToCart, decreaseQuantity, cart } = useCartContext();
  const navigate = useNavigate();
  const { isAuth } = useAuthContext();
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const inventoryWithCartCount = useMemo(() => {
    return inventory?.map((item) => ({
      ...item,
      count: cart.find(cartItem => cartItem.id === item.id)?.quantity || 0,
    }));
  }, [inventory, cart]);

  const filteredInventory = useMemo(() => {
    return inventoryWithCartCount?.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [inventoryWithCartCount, debouncedSearch]);

  const categories = useMemo(() => {
    return [...new Set(inventory?.map((item) => item.category))];
  }, [inventory]);

  const filteredWithCategoryInventory = useMemo(() => {
    if (category === "") return filteredInventory;
    return filteredInventory?.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase(),
    );
  }, [filteredInventory, category]);

  const filterWithCategorySearchRatingInventory = useMemo(() => {
    return filteredWithCategoryInventory?.filter(
      (item) => item.rating.rate >= rating,
    );
  }, [filteredWithCategoryInventory, rating]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-primary text-2xl font-bold">Products</h1>
        {!isLoading && filterWithCategorySearchRatingInventory && (
          <p className="text-muted text-sm mt-1">
            {filterWithCategorySearchRatingInventory.length} items
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none select-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field border rounded-xl px-3 py-2.5 text-sm md:w-44"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="input-field border rounded-xl px-3 py-2.5 text-sm md:w-36"
        >
          <option value="0">Any Rating</option>
          <option value="1">★ 1+</option>
          <option value="2">★★ 2+</option>
          <option value="3">★★★ 3+</option>
          <option value="4">★★★★ 4+</option>
          <option value="5">★★★★★ 5</option>
        </select>
        <button onClick={refetch} className="btn-ghost rounded-xl px-4 py-2.5 text-sm shrink-0">
          ↻ Refresh
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && <ProductSkeletonGrid />}

      {/* Error */}
      {error && !inventory && (
        <p className="text-error text-center font-semibold my-8">Error: {error}</p>
      )}

      {/* Empty state */}
      {!isLoading && filteredWithCategoryInventory?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl">🔍</span>
          <p className="text-primary font-semibold text-lg">No products found</p>
          <p className="text-muted text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Product grid */}
      {filterWithCategorySearchRatingInventory?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterWithCategorySearchRatingInventory.map((item) => (
            <div
              key={item.id}
              className="card product-card rounded-2xl border flex flex-col overflow-hidden"
            >
              {/* Image area */}
              <div className="product-img-area">
                <span className="category-tag">{item.category}</span>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`h-44 w-full object-contain ${item.quantity === 0 ? "opacity-30" : ""}`}
                />
                {item.quantity === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-b-xl">
                    <span className="btn-danger text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <StarRating rate={item.rating.rate} count={item.rating.count} />

                <h3 className="text-primary font-semibold text-sm leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-end justify-between mt-auto">
                  <span className="text-price text-xl font-bold">${item.price}</span>
                  <span className={`text-xs ${item.quantity > 0 ? "stock-ok" : "stock-out"}`}>
                    {item.quantity > 0 ? `${item.quantity} left` : "Out of stock"}
                  </span>
                </div>

                <div className="card-divider" />

                {/* Cart action */}
                {isAuth ? (
                  item.count === 0 ? (
                    <button
                      onClick={() => addToCart(item.id)}
                      disabled={item.quantity === 0}
                      className={`btn-primary w-full py-2.5 rounded-xl text-sm font-semibold ${item.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="cart-stepper">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="btn-danger px-3 py-2.5 text-sm font-bold rounded-none"
                        >
                          −
                        </button>
                        <span className="cart-stepper-count">{item.count}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={item.quantity === 0}
                          className={`btn-primary px-3 py-2.5 text-sm font-bold rounded-none ${item.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-muted text-xs">{item.count} in cart</span>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate(routes.login)}
                    className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold"
                  >
                    Login to Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
