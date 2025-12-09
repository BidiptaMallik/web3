import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-700 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
            <img className='flex flex-col w-40 h-auto px-3 py-5 md:items-start items-center ' src={assets.logo} alt="logo" />
            <p></p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Privacy & Policy</a></li>
            <li><a href="#">Contact us</a></li>
        
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white nb-5'>
            Subscribe to get our exclusive resources
          </h2>
          <div className='flex items-center gap-2 pt-4'>
            <input className="bg-gray-600 rounded full outline-none" type='email' placeholder="Enter your email" />
            <button className='bg-blue-600 w-24 h-9 text-white rounded-full'>Subscribe</button>
          </div>
        </div>
      </div>
      <p className='border-t border-white/30 mt-4 py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 @ CollegeAid All Right Reserved.</p>
    </footer>
  )
}

export default Footer