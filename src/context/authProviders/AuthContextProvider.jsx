import { useCallback, useMemo, useState } from "react"
import { AuthContext, getCurrentUserDetailsFromLocal, login, logout, registerUser } from "./authUtils"

function AuthContextProvider({children}) {

  const [currentUser, setCurrentUser] = useState(getCurrentUserDetailsFromLocal)


  const logoutCurrent = useCallback(() => {
    logout()
    setCurrentUser(getCurrentUserDetailsFromLocal())
  }, [])
  
  const loginCurrent = useCallback((username, password) => {
    try {
      
      const user = login(username,password)
      setCurrentUser({username:user.username,isAdmin:user.isAdmin,isAuthenticated:true})
    }
    catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      console.log(message)
      throw e
    }
  }, [])
  
  const isAuth = useMemo(() => {
    return currentUser.isAuthenticated
  }, [currentUser])
  
  return (
    <AuthContext.Provider value={{
      isAuth,
      currentUser:currentUser,
      login: loginCurrent,
      signUp: registerUser,
      logOut:logoutCurrent
    }}>
      {children}
   </AuthContext.Provider>
  )
}

export default AuthContextProvider