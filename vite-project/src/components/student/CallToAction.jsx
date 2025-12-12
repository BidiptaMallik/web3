import React from 'react'
import { assets } from '../../assets/assets'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const CallToAction = () => {
  const navigate=useNavigate()
  return (
    <div className='py-16 md:px-40 px-8 flex flex-col items-center text-center'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>
        Learn anything
      </h1>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button onClick={()=>navigate('/course-list')} className='px-10 py-3 rounded-md text-white bg-blue-600' >
          Get Started
        </button>
        <button onClick={()=>navigate('/course-list')} className='flex items-center gap-2'>
          Learn more <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      </div>
    </div>
  )
}

export default CallToAction