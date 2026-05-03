import { NavLink } from "react-router-dom"
import { routes } from "../../constants"
import {useAuthContext} from "../context/authProviders/authUtils"
import { useCallback } from "react"

function Header() {

  const { isAuth ,logOut} = useAuthContext()
  
  const colorClassname = useCallback(({ isActive, isPending }) => {
    return (isActive ? "text-purple-500 ": isPending?"text-red-600":"text-blue-700") + " text-xl"
  }, [])
  return (
    <div className="flex flex-row justify-center gap-4 ">
      {
        !isAuth ? (<>
        <NavLink to={routes.login} className={colorClassname}>Login</NavLink>
        <NavLink to={routes.signup} className={colorClassname}>SignUp</NavLink>
        
        </>) :
          <button onClick={logOut} className="bg-blue-500 text-white p-2 rounded-md">LogOut</button>
      }
    </div>
  )
}

export default Header