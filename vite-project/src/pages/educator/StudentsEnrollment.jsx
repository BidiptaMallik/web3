import React, { useContext, useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const StudentsEnrollment = () => {

  const{backendUrl,getToken,isEducator}=useContext(AppContext)

  const [enrolledStudents,setEnrolledStudents]=useState(null)

  const fetchEnrolledStudents=async()=>{
    try{
      const token=await getToken()
      const {data}=await axios.get(backendUrl + '/api/educator/enrolled-students',{headers:{Authorization: `Bearer ${token}`}})
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(isEducator){
      fetchEnrolledStudents()
    }
  },[isEducator])
  return enrolledStudents?(
    <div className="w-full flex flex-col p-6 pb-20 overflow-y-auto 
bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table >
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold text-center hiddem sm:table-cell'>Student Name</th>
              <th className='px-4 py-3 font-semibold text-center hiddem sm:table-cell'>Course Title</th>
              <th className='px-4 py-3 font-semibold text-center hiddem sm:table-cell'>Date</th>
              
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item,index)=>(
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index+1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img src={item.student.imageUrl} alt="" className='w-9 h-9 rounded-full' />
                  <span className='trauncate'>{item.student.name}</span>


                </td>
                <td className='px-4 py-3 trauncate'>{item.courseTitle}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ): <Loading />
}

export default StudentsEnrollment