import { useMemo } from "react";
import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils";

function stockClass(qty) {
  if (qty === 0) return "stock-out";
  if (qty <= 3) return "stock-low";
  return "stock-ok";
}

function stockLabel(qty) {
  if (qty === 0) return "Out of stock";
  if (qty <= 3) return `Low — ${qty} left`;
  return `${qty} in stock`;
}

function InventorySkeletonCard() {
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
          <div className="skeleton h-4 w-1/4" />
        </div>
        <div className="skeleton h-px w-full" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

function InventorySkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <InventorySkeletonCard key={i} />
      ))}
    </div>
  );
}

function InventoryPage() {
  const { inventory, isLoading, error, refetch, removeProduct } = useInventoryContext();

  const stats = useMemo(() => {
    if (!inventory) return null;
    return {
      total: inventory.length,
      inStock: inventory.filter(i => i.quantity > 0).length,
      outOfStock: inventory.filter(i => i.quantity === 0).length,
      lowStock: inventory.filter(i => i.quantity > 0 && i.quantity <= 3).length,
    };
  }, [inventory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-primary text-2xl font-bold">Inventory</h1>
          <p className="text-muted text-sm mt-1">Manage your product catalogue</p>
        </div>
        <button onClick={refetch} className="btn-ghost rounded-xl px-4 py-2.5 text-sm shrink-0">
          ↻ Refresh
        </button>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total",       value: stats.total,      cls: "text-primary" },
            { label: "In Stock",    value: stats.inStock,    cls: "stock-ok" },
            { label: "Low Stock",   value: stats.lowStock,   cls: "stock-low" },
            { label: "Out of Stock",value: stats.outOfStock, cls: "stock-out" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="card border rounded-2xl p-4 flex flex-col gap-1">
              <span className={`text-2xl font-bold ${cls}`}>{value}</span>
              <span className="text-muted text-xs">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && <InventorySkeletonGrid />}

      {/* Error */}
      {error && !inventory && (
        <p className="text-error text-center font-semibold my-8">Error: {error}</p>
      )}

      {/* Empty state */}
      {!isLoading && inventory?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl">📦</span>
          <p className="text-primary font-semibold text-lg">No products in inventory</p>
          <p className="text-muted text-sm">Refresh to reload from the API</p>
        </div>
      )}

      {/* Inventory grid */}
      {inventory && inventory.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => (
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
                <h3 className="text-primary font-semibold text-sm leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-end justify-between">
                  <span className="text-price text-xl font-bold">${item.price}</span>
                  <span className={`text-xs ${stockClass(item.quantity)}`}>
                    {stockLabel(item.quantity)}
                  </span>
                </div>

                <div className="card-divider" />

                <button
                  onClick={() => removeProduct(item.id)}
                  className="btn-danger w-full py-2.5 rounded-xl text-sm font-semibold"
                >
                  Remove from Inventory
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
