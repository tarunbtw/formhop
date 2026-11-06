import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children, defaultTheme: _defaultTheme, storageKey: _storageKey }: { children: ReactNode; defaultTheme?: string; storageKey?: string }) {
  const [theme] = useState<Theme>('light')

  useEffect(() => {
    // Default to clean white/light mode permanently
    const root = document.documentElement
    root.classList.remove('dark')
    localStorage.removeItem('formhop-theme')
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: 'light',
        setTheme: () => {},
        toggleTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
