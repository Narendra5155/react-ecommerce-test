import { useState } from "react"
import { ThemeContext } from "./themeUtils"



const initialTheme = "dark"


export default function ThemeProviders({children}) {
  const [theme, setTheme] = useState(initialTheme)

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}  
    </ThemeContext.Provider>
  )
}