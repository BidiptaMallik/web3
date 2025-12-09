import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext)
  const { input } = useParams()
  const [filteredCourse, setFilterCourse] = useState([])

  useEffect(() => {
    if(allCourses && allCourses.length > 0){
      const tempCourses = allCourses.slice()

      if(input){
        const filtered = tempCourses.filter(item =>
          item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
        setFilterCourse(filtered)
      } else {
        setFilterCourse(tempCourses)
      }
    }
  }, [allCourses, input])

  return (
    <>
    <div className='relative md:px-36 px-8 pt-20 text-left'>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-3">Course List</h1>
          <p className="text-gray-800">
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/')}>
              Home
            </span>{' '}
            |{' '}
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/course-list')}>
              Course List
            </span>
          </p>
        </div>
        <SearchBar 
          initialValue={input || ''} 
          onSearch={term => navigate(`/course-list/${term}`)} 
        />
      </div>
      {
        input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8-mb-8 text-gray-600 rounded-full'>
          <p>{input}</p>
          <img src={assets.cross_icon} alt="cursor-pointer" onClick={()=> navigate('course-list')}/>
        </div>
      }

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-2 md:p-0 mt-6'>
        {filteredCourse.length > 0 ? 
          filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)
          : <p className="text-gray-500">No courses found.</p>
        }
      </div>
    </div>
    <Footer />
    </>
  )
}

export default CoursesList
