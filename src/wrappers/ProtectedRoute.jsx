import { Navigate } from "react-router-dom"
import { routes } from "../../constants"
import { useAuthContext } from "../context/authProviders/authUtils"

function ProtectedRoute({ children }) {
  const { isAuth, currentUser } = useAuthContext()
  if (!isAuth || !currentUser.isAdmin) {
    return <Navigate to={routes.unAuthorized} />
  }
  return children
}

export default ProtectedRoute