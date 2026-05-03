import { useNavigate } from "react-router-dom"
import { routes } from "../../constants"

function NonAuthorizePage() {
  const navigate = useNavigate()
  return (
    <div>
      <h1>You are not authorized to access this page</h1>
      <button onClick={() => navigate(routes.login)} className="bg-blue-500 text-white p-2 rounded-md">Login</button>
  </div>
  )
}

export default NonAuthorizePage