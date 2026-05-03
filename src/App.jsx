import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "../constants"
import AppLayout from "./components/AppLayout"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import AuthContextProvider from "./context/authProviders/AuthContextProvider"
import ProductPage from "./pages/ProductPage"
import InventoryProvider from "./context/inventoryProviders/InventoryProvider"



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
    ]
  }
])
function App() {
  return (
    <AuthContextProvider>
      <InventoryProvider>
    <RouterProvider router={router}/>
      </InventoryProvider>
    </AuthContextProvider>
  )
}

export default App