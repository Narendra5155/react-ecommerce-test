import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "../constants"
import AppLayout from "./components/AppLayout"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import AuthContextProvider from "./context/authProviders/AuthContextProvider"



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
    ]
  }
])
function App() {
  return (
    <AuthContextProvider>
    <RouterProvider router={router}/>
    </AuthContextProvider>
  )
}

export default App