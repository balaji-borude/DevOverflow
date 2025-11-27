import Navbar from '@/components/navbar/Navbar'
import React, { ReactNode } from 'react'

//every Route Group -->() Route group means route wrapped in ()--> can have its own layout
// every page in (auth) will be wrapped by this layout
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
        <Navbar/>
        {children}
    </main>
  )
}

export default RootLayout