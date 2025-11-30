import Navbar from '@/components/navbar/Navbar'
import React, { ReactNode } from 'react'
// import { Toaster } from 'sonner'

//every Route Group -->() Route group means route wrapped in ()--> can have its own layout
// every page in (auth) will be wrapped by this layout
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
        <Navbar/>
        {children}
        {/* <Toaster /> -->  */} 
        {/* Check this out this is necessary to implekment the toaster  in the Root layout of route group
         */}
    </main>
  )
}

export default RootLayout