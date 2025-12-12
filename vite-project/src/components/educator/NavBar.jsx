import React from 'react'
import { Link } from 'react-router-dom'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'

const NavBar = () => {
  const { user } = useUser()

  return (
<div className="fixed top-0 left-0 w-full z-50 
      bg-gradient-to-r from-green-700 to-green-500 
      text-white flex items-center justify-between px-6 py-4 shadow-lg">
  <Link to='/'>
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32' />
      </Link>

      <div className='flex items-center gap-5 text-white'>
        <p>Hello, {user ? user.fullName : 'Developers'}</p>

        {user ? (
          <UserButton />
        ) : (
          <img className='max-w-8' src="" alt="profile" />
        )}
      </div>
    </div>
  )
}

export default NavBar
