import { NavLink } from "react-router-dom";
import { routes } from "../../constants";
import { useAuthContext } from "../context/authProviders/authUtils";
import { useCallback, useMemo } from "react";
import { useCartContext } from "../context/cartProvider/cartUtils";

function Header() {
  const { isAuth, logOut, currentUser } = useAuthContext();
  const { totalCartItems } = useCartContext();

  const userAvatar = useMemo(() => {
    if (!isAuth) return null;
    return (
      <div className="flex flex-col justify-center">
        <p className="text-xl font-bold">{currentUser.username}</p>
        <p className="text-xl font-bold">
          {currentUser.isAdmin ? "Admin" : "User"}
        </p>
      </div>
    );
  }, [currentUser, isAuth]);

  const colorClassname = useCallback(({ isActive, isPending }) => {
    return (
      (isActive
        ? "text-purple-500 "
        : isPending
          ? "text-red-600"
          : "text-blue-700") + " text-xl flex flex-row items-center justify-center gap-2"
    );
  }, []);

  return (
    <div className="flex flex-row justify-center gap-4 ">
      <NavLink to={routes.products} className={colorClassname}>
        Products
      </NavLink>
      {
        isAuth && currentUser.isAdmin && (
          <NavLink to={routes.inventory} className={colorClassname}>
            Inventory
          </NavLink>
        )
      }
      {!isAuth ? (
        <>
          <NavLink to={routes.login} className={colorClassname}>
            Login
          </NavLink>
          <NavLink to={routes.signup} className={colorClassname}>
            SignUp
          </NavLink>
        </>
      ) : (
        <>
          <div className="relative flex flex-row items-center justify-center gap-2">
            <NavLink to={routes.cart} className={colorClassname}>
              Cart
              </NavLink>
              {totalCartItems > 0 && (
            <p className="text-sm text-gray-700">
              <span className=" bg-red-500 text-white p-2 rounded-full text-xs">
                {totalCartItems}
              </span>
            </p>
            )}
          </div>
          {userAvatar}
          <button
            onClick={logOut}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            LogOut
          </button>
        </>
      )}
    </div>
  );
}

export default Header;
