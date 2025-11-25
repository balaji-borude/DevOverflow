import Link from 'next/link'
import React from 'react'

const SignUp = () => {
  return (
    <div>SignUp page
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <br />

        <p> Already have account 
            <Link href="/signin" className='text-blue-500'> LogIn</Link>
        </p>
    </div>
  )
}

export default SignUp   