"use client"
// This Page is used to provide theme context like dark.mode/light mode/ system to the application

// in short this file is a wrapper which will wrap whole application and provide theme (dark/light/system) functionality

import { ThemeProviderProps } from 'next-themes'
import { ThemeProvider as NextThemeProvider } from 'next-themes';


const ThemeProvider = ({children , ...props}:ThemeProviderProps) => {
    // i will wrap evrything in the provider and allow me to use some of the Props 
  return (
    <NextThemeProvider {...props}>{children}</NextThemeProvider>
  )
}

export default ThemeProvider