import { createContext, useContext } from "react";
import { ALL_USER_RECORD, CURRENT_USER_KEY } from "../../../constants";

export const getCurrentUserDetailsFromLocal = ()=>{
  const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY)|| "{}")
  if (user) {
    return {
      username: user.username,
      isAuthenticated: true,
      isAdmin:user.isAdmin
    }
  }

  return {
    username: "",
    isAuthenticated: false,
    isAdmin:false
  }
}

export const getAllRegisteredUsers = () => {
  const allUsers = JSON.parse(localStorage.getItem(ALL_USER_RECORD) || "[]")
  return allUsers
}

export const setCurrentUser = (username="",isAdmin=false) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    username: username,
    isAdmin: isAdmin,
    isAuthenticated: true,
  }))
}


export const registerUser = (username="",password="",isAdmin=false) => {
  const allUsers = getAllRegisteredUsers()
  if (allUsers.map(item => item.username).find(item => item === username.trim())) {
    throw new Error("user with this username already exist")
  }

  allUsers.push({
    username: username.trim(),
    isAdmin: isAdmin,
    password: password
  })
}


export const login = (username, password) => {
  const allUsers = getAllRegisteredUsers()
  const user = allUsers.find(item => item.username === username.trim())
  if (!user) {
    throw new Error("No such User Exist")
  }

  if (user.password !== password) {
    throw new Error("Wrong Password !!")
  }

  setCurrentUser(user.username, user.isAdmin)
  return user
}

export const logout = () => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    isAuthenticated: false,
    username: "",
    isAdmin:false
  }))
}



export const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}