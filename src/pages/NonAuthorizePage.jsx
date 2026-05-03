import { useNavigate } from "react-router-dom"
import { routes } from "../../constants"

function NonAuthorizePage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-primary text-2xl font-bold">You are not authorized to access this page</h1>
      <button onClick={() => navigate(routes.login)} className="btn-primary p-2 rounded-md">Login</button>
    </div>
  )
}

export default NonAuthorizePage
