import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import { AppContext } from '../../context/AppContext'

const CoursesSection = () => {

    const {allCourses}=useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8 flex flex-col items-center text-center'>
        <h2 className='text-3xl font-medium text-gray-800'>Happy Learning</h2>
        <p className='text-center text-sm md:base text-gray-500 mt-3'>Discover Various courses</p>
      
        <div className='grid grid-cols-auto-fit px-4 md:my-16 my-10 gap-4'>
            {allCourses.slice(0,4).map((course,index)=><CourseCard key={index} course={course} />)}
        </div>

        <Link to={'/course-list'}onClick={()=>scroll(0,0)}
        className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded-md'>Show all Courses</Link>
    </div>
  )
}

export default CoursesSection