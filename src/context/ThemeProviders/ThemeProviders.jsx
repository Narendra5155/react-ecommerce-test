import { useState, useEffect } from "react"
import { ThemeContext } from "./themeUtils"

const initialTheme = "dark"

export default function ThemeProviders({ children }) {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
