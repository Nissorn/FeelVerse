import React from 'react'


const ResetPassword =()=>{

    return(

        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
        
       <img onClick={()=>navigate('/')} src={assets.space-bg} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        
        <form className='bg-slate-900 p-8 rounded-1g shadow-lg w-96 text-sm'>
        
        <h1 className='text-white text-2x1 font-semibold text-center mb-4'>Email Verify OTP</h1>
        
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
        </form>
        </div>
    )
}
export default ResetPassword;