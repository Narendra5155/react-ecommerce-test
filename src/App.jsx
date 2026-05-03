import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "../constants"
import AppLayout from "./components/AppLayout"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import AuthContextProvider from "./context/authProviders/AuthContextProvider"
import ProductPage from "./pages/ProductPage"
import InventoryProvider from "./context/inventoryProviders/InventoryProvider"
import CartProvider from "./context/cartProvider/CardProvider"
import CartPage from "./pages/CartPage"
import InventoryPage from "./pages/InventoryPage"
import ProtectedRoute from "./wrappers/ProtectedRoute"
import NonAuthorizePage from "./pages/NonAuthorizePage"



const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: routes.login,
        element:<LoginPage/>
      },
      {
        path: routes.signup,
        element:<SignupPage/>
      },
      {
        path: routes.products,
        element:<ProductPage/>
      },
      {
        path: routes.cart,
        element:<CartPage/>
      },
      {
        path: routes.inventory,
        element:<ProtectedRoute><InventoryPage/></ProtectedRoute>
      },
      {
        path: routes.unAuthorized,
        element:<NonAuthorizePage/>
      }
    ]
  }
])
function App() {
  return (
    <AuthContextProvider>
      <InventoryProvider>
        <CartProvider>
          <RouterProvider router={router}/>
        </CartProvider>
      </InventoryProvider>
    </AuthContextProvider>
  )
}

export default App