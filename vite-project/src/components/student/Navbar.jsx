import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import {useClerk,UserButton,useUser} from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Navbar = () => {
    const {navigate,isEducator,backendUrl,setIsEducator,getToken}=useContext(AppContext)

    const location = useLocation();
    const isCourseListPage = location.pathname.includes('/course-list');

    const{openSignIn} =useClerk()
    const {user}=useUser()

    const becomeEducator=async()=>{
        try{
            if(isEducator){
                navigate('/educator')
                return
            }
            const token=await getToken()
            const {data}=await axios.get(backendUrl + '/api/educator/update-role',{headers:{Authorization:`Bearer ${token}`}})

            if(data.success){
                setIsEducator(true)
                toast.success(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }


    return (
        <div className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
            location.pathname==='/'
            ? 'bg-gradient-to-r from-emerald-100 to-teal-500 shadow-sm' 
            : 'bg-gradient-to-r from-emarald-100 to-teal-500 shadow-sm'
        }`}>
            <div className='relative flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4'>
                
                <Link to='/'>
                    <img onClick={()=>navigate('/')}
                        src={assets.logo} 
                        alt="Logo" 
                        className='w-28 lg:w-32 cursor-pointer transition-transform duration-300 hover:scale-105'
                    />
                </Link>

                <div className='hidden md:flex items-center gap-8 absolute right-1/10 transform -translate-x-1/2'>
                    
                    <div className='flex items-center gap-6 text-gray-600 font-medium'>
                       {
                       user&&
                       <>
                        <button className='hover:text-blue-600 transition-colors duration-200'>
                           <button onClick={becomeEducator}>{isEducator? 'Educator Dashboard':'Become Educator'}</button>
                        </button>
                        
                        <Link 
                            to='/my-enrollments' 
                            className='hover:text-blue-600 transition-colors duration-200'
                        >
                            My Enrollments
                        </Link>
                       </>}
                    </div>

                        {
                            user? <UserButton/>:
                            <button onClick={()=>openSignIn()} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'>
                            Create Account
                        </button>}
                </div>

                <div className='md:hidden text-2xl text-gray-600 cursor-pointer'>
                    <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
                        {user&& <>
                            <button className='hover:text-blue-600 transition-colors duration-200'>
                            <button onClick={becomeEducator}>{isEducator? 'Educator Dashboard':'Become Educator'}</button>
                        </button>
                        <Link 
                            to='/my-enrollments' 
                            className='hover:text-blue-600 transition-colors duration-200'
                        >
                            My Enrollments
                        </Link>
                        </>}
                    </div>
                    {
                        user ? <UserButton/> :
                    
                    <button onClick={()=> openSignIn()}><img src={assets.user_icon} alt="" /></button>
                    }
                    </div>

            </div>
        </div>
    )
}

export default Navbar