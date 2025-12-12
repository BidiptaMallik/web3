import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'

const SideBar = () => {

  const { isEducator } = useContext(AppContext)

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ]

  return isEducator && (
    <div className="md:w-64 w-16 min-h-screen text-base 
bg-gradient-to-b from-green-700 via-green-600 to-green-500
text-white py-2 flex flex-col shadow-xl">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path==='/educator'}
          className={({ isActive }) =>
            `flex flex-col items-center p-4 cursor-pointer 
             ${isActive ? 'bg-green-400 font-semibold' : ''}`
          }
        >
          <img src={item.icon} alt="" className='w-6 h-6 mb-1' />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default SideBar
