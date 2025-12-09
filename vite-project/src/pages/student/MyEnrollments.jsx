import React, { useContext,useState } from 'react'
import { AppContext } from '../../context/AppContext'
import{Line} from 'rc-progress'
import Footer from '../../components/student/Footer'
const MyEnrollments = () => {

  const {enrolledCourses,calculateCourseDuration,navigate}=useContext(AppContext)
  const [progressArray,setProgressArray]=useState([
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:4,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:4,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
    {lectureCompleted:2,totalLecture:4},
  ])
  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>MyEnrollments</h1>
    <table className='md:text-suto table-fixed w-full overflow-hidden border mt-10'>
      <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
        <tr >
          <th className='px-4 py-3 font-semibold truncate'>Course</th>
          <th className='px-4 py-3 font-semibold truncate'>Duration</th>
          <th className='px-4 py-3 font-semibold truncate'>Complete</th>
          <th className='px-4 py-3 font-semibold truncate'>Status</th>
        </tr>
      </thead>
      <tbody className='text-gray-700'>
        {enrolledCourses.map((course,index)=>(
          <tr key={index} className='border-b border-gray-500/20'>
            <td className='md:px-4 pl-2 md:pl-4 py-3 flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-3'>
              <img  src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28'/>
              <div className='flex-1 mt-2 sm:mt-0'>
                
                <p className='px-0 sm:px-4 py-1 '>{course.courseTitle}</p> 
                <Line strokeWidth={2} percent={progressArray[index]? (progressArray[index].lectureCompleted*100)/progressArray[index].totalLecture:0} className='bg-gray-300 rounded'/>
              </div>

            </td >
            <td className='px-4 py-3 max-sm:hidden'>
              {calculateCourseDuration(course)}
            </td>
            <td className='px-4 py-3 max-sm:hidden'>
              {progressArray[index]&&`${progressArray[index].lectureCompleted}/${progressArray[index].totalLecture}`}<span>Lectures</span>
            </td>
            <td className='px-4 py-3 max-sm:text-right'>
              <button  className='px-3 sm:px-5 py-1.5 sm:py-2 bg-green-600 max sm:text-xs text-white' onClick={()=>navigate(`/player/${course._id}`)}>
                {progressArray[index]&& (progressArray[index].lectureCompleted/progressArray[index].totalLecture===1)? 'Completed':'On Going'}
                
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <Footer />
    </>
  )
}

export default MyEnrollments