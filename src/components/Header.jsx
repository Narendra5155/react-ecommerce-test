import { NavLink, useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { useAuthContext } from "../context/authProviders/authUtils";
import { useCallback, useMemo } from "react";
import { useCartContext } from "../context/cartProvider/cartUtils";
import { useThemeContext } from "../context/ThemeProviders/themeUtils";

function Header() {
  const { isAuth, logOut, currentUser } = useAuthContext();
  const { totalCartItems, clearCart } = useCartContext();
  const { theme, setTheme } = useThemeContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logOut();
    clearCart();
    navigate(routes.login);
  }, [logOut, navigate, clearCart]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }, [setTheme]);

  const navPillClass = useCallback(({ isActive, isPending }) => {
    if (isActive) return "nav-pill nav-pill-active";
    if (isPending) return "nav-pill nav-pill-pending";
    return "nav-pill";
  }, []);

  const userInitial = useMemo(() => {
    return currentUser?.username?.[0]?.toUpperCase() ?? "?";
  }, [currentUser]);

  return (
    <nav className="app-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-6">

        {/* Brand */}
        <NavLink
          to={routes.products}
          className="text-price text-lg font-bold tracking-tight shrink-0"
        >
          ShopEase
        </NavLink>

        {/* Center — main nav */}
        <div className="flex items-center gap-1">
          <NavLink to={routes.products} className={navPillClass}>
            Products
          </NavLink>
          {isAuth && currentUser.isAdmin && (
            <NavLink to={routes.inventory} className={navPillClass}>
              Inventory
            </NavLink>
          )}
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isAuth ? (
            <>
              <NavLink to={routes.login} className={navPillClass}>
                Login
              </NavLink>
              <NavLink
                to={routes.signup}
                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              {/* Cart with badge */}
              <NavLink
                to={routes.cart}
                className={({ isActive }) =>
                  "relative " + (isActive ? "nav-pill nav-pill-active" : "nav-pill")
                }
              >
                🛒 Cart
                {totalCartItems > 0 && (
                  <span className="cart-badge absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] rounded-full text-xs flex items-center justify-center px-1 font-bold leading-none">
                    {totalCartItems}
                  </span>
                )}
              </NavLink>

              {/* User pill */}
              <div className="form-wrapper flex items-center gap-2 px-3 py-1.5 rounded-xl border">
                <div className="user-avatar">{userInitial}</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-primary">{currentUser.username}</span>
                  <span className="text-xs text-muted">{currentUser.isAdmin ? "Admin" : "User"}</span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn-ghost">
                Logout
              </button>
            </>
          )}

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Header;
