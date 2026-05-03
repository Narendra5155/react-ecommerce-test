import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useCartContext } from "../context/cartProvider/cartUtils";
import { useInventoryContext } from "../context/inventoryProviders/inventoryUtils";
import { routes } from "../../constants";

function CartPage() {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCartContext();
  const { inventory } = useInventoryContext();

  const cartItems = useMemo(() => {
    return inventory
      ?.filter(item => cart.some(c => c.id === item.id))
      .map(item => ({
        ...item,
        count: cart.find(c => c.id === item.id)?.quantity || 0,
      }));
  }, [inventory, cart]);

  const totalPrice = useMemo(() => {
    return cartItems?.reduce((sum, item) => sum + item.price * item.count, 0) ?? 0;
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems?.reduce((sum, item) => sum + item.count, 0) ?? 0;
  }, [cartItems]);

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-bold">Your Cart</h1>
        {!isEmpty && (
          <p className="text-muted text-sm mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-6xl">🛒</span>
          <p className="text-primary font-bold text-xl">Your cart is empty</p>
          <p className="text-muted text-sm">Browse products and add items to get started</p>
          <NavLink
            to={routes.products}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Browse Products
          </NavLink>
        </div>
      )}

      {/* Cart content */}
      {!isEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Item list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="card border rounded-2xl p-4 flex gap-4 items-start"
              >
                {/* Thumbnail */}
                <div className="cart-item-img">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <h3 className="text-primary font-semibold text-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="category-tag self-start">{item.category}</span>

                  <div className="flex items-center justify-between gap-4 flex-wrap mt-1">
                    {/* Qty stepper */}
                    <div className="cart-stepper">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="btn-danger px-3 py-2 text-sm font-bold rounded-none"
                      >
                        −
                      </button>
                      <span className="cart-stepper-count">{item.count}</span>
                      <button
                        onClick={() => addToCart(item.id)}
                        disabled={item.quantity === 0}
                        className={`btn-primary px-3 py-2 text-sm font-bold rounded-none ${item.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-price font-bold text-base">
                        ${(item.price * item.count).toFixed(2)}
                      </span>
                      <span className="text-muted text-xs">
                        ${item.price.toFixed(2)} × {item.count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn-icon-danger"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="card border rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-primary font-bold text-lg">Order Summary</h2>
              <div className="card-divider" />

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Items</span>
                  <span className="text-primary font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Products</span>
                  <span className="text-primary font-medium">{cartItems.length}</span>
                </div>
              </div>

              <div className="card-divider" />

              <div className="flex justify-between items-end">
                <span className="text-muted text-sm">Subtotal</span>
                <span className="text-price text-2xl font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={clearCart}
                className="btn-ghost w-full py-2.5 rounded-xl text-sm font-medium mt-2"
              >
                Clear Cart
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default CartPage;
