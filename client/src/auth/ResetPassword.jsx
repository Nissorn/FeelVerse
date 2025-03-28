import React from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { useState } from 'react';
import axios from 'axios';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

const ResetPassword =()=>{

    const inputRefs = React.useRef([])
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const {backendUrl,isloggin,userData,getUserData,sendResetOtp} = useContext(AppContext)
    
    const [dataEmail,setDataEmail] =useState("");
    const [dataOTP,setDataOTP] =useState("");
    const [state,setState]=useState(0);

    const [Passwordcheck, setPasswordcheck] = useState({
        password: '',
        confirmPassword: ''
    });
    
    const handleInput = (e,index)=>{
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKey = (e,index) =>{
        if(e.key === 'Backspace' && e.target.value === '' && index >0){
            inputRefs.current[index-1].focus();
        }
    }

    const handlePaste = (e,index) =>{
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('');
        pasteArray.forEach((char,index)=>{
            if((inputRefs.current[index])){
                inputRefs.current[index].value=char;
            }
        })
    }

    const handlesubmitresetPass = async (e) =>{
        e.preventDefault();
        try{
            const {data} = await axios.post(backendUrl+'/api/auth/send-reset-otp',{ email: dataEmail.toString()})
            if (data.success) {
                setState(1);
                console.log("SENDOTP SUCCESS");
            } else {
                console.log("SENDOTP FAILED");
            }
        } catch (error) {
            console.log("SENDOTP ERROR", error);
        }
    }

    const handlesubmitOTP = async (e) =>{
        e.preventDefault();
        const otpArray = inputRefs.current.map(e=>e.value)
        const otp = otpArray.join('')

        try{
            
            const {data} = await axios.post(backendUrl+'/api/auth/OTPverify',
                {
                    email: dataEmail.toString(),
                    otp: otp
                })
            if(data.success){
                console.log("OTP SUCCESS");
                setState(2);
                setDataOTP(otp)
                // navigate('/home')
            }else{
                console.log("OTP WORNG >>",error.response?.data?.message || error.message);
            }
        }catch(error){
            console.log("OTP WORNG :", error.response?.data?.message || error.message);
        }
    }

    const handleconfirmPassword = async (e) =>{
        e.preventDefault();

        if(Passwordcheck.password!==Passwordcheck.confirmPassword){
            return alert("Password not match");
        }

        try{
            const {data} = await axios.post(backendUrl+'/api/auth/reset-password',{
                email: dataEmail.toString(),
                otp:dataOTP,
                newPassword: Passwordcheck.password
            })
            
            if(data.success){
                console.log("Reset Password Complete");
                navigate('/');
            }
        }catch{
        }
    }


    return(
        (state===0)?(
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className='glass-card p-4 sm:p-6 md:p-8 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 max-w-md mx-auto'>
                    <h1 className='text-white font-semibold text-xl sm:text-2xl text-center'>Reset Password</h1>         
                    <p className='mt-2 sm:mt-3 text-center text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-indigo-300'>Enter your email address</p>
                    <div className='flex flex-row items-center justify-start bg-space-blue rounded-3xl p-2 sm:p-3'>
                        <HiOutlineMail size={24} color="#999" className='ml-2 sm:ml-4' />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={dataEmail}
                            className='ml-2 w-full bg-transparent border-transparent outline-none focus:bg-transparent hover:bg-transparent focus:ring-0 focus:border-transparent text-white'
                            onChange={(e) => setDataEmail(e.target.value)}
                        />
                    </div>
                    

                    <form onSubmit={handlesubmitresetPass} className="mt-4 sm:mt-6 flex flex-1 w-full items-center justify-center">
                        <button
                            type="submit"
                            className="justify-center space-button w-full hover:nebula-glow text-sm sm:text-base"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        ):(
        (state===1)?(
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className='glass-card p-4 sm:p-6 md:p-8 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 max-w-md mx-auto'>
                    <h1 className='text-white font-semibold text-xl sm:text-2xl text-center'>Reset Password OTP</h1>         
                    <p className='mt-2 sm:mt-3 text-center text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-indigo-300'>Enter the 6-digit code sent to your email</p>

                    <div className='flex justify-between my-4 sm:my-6 md:my-8 px-2 sm:px-6 md:px-10' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_,index)=>(
                            <input 
                                type='text' 
                                maxLength='1' 
                                key={index} 
                                required 
                                className='w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-space-blue text-white text-center text-xl sm:text-2xl md:text-3xl rounded-lg border-2 border-indigo-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all'
                                ref={e=> inputRefs.current[index]=e}
                                onInput={(e) => handleInput(e,index)}
                                onKeyDown={(e)=> handleKey(e,index)}
                            />
                        ))}
                    </div>
                    
                    <form onSubmit={handlesubmitOTP} className="mt-4 sm:mt-6 flex flex-1 w-full items-center justify-center">
                        <button
                            type="submit"
                            className="justify-center space-button w-full hover:nebula-glow text-sm sm:text-base"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        ):(
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className='glass-card p-4 sm:p-6 md:p-8 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 max-w-md mx-auto'>
                    <h1 className='text-white font-semibold text-xl sm:text-2xl text-center'>New Password</h1>         
                    <p className='mt-2 sm:mt-3 text-center text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-indigo-300'>Enter your new password</p>
                    <div className='flex flex-row items-center justify-start bg-space-blue rounded-3xl p-2 sm:p-3'>
                        <input 
                            type="password" 
                            placeholder="Enter New Password" 
                            className='w-full bg-transparent border-transparent outline-none focus:bg-transparent hover:bg-transparent focus:ring-0 focus:border-transparent text-white'
                            onChange={(e) => setPasswordcheck({ ...Passwordcheck, password: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-row mt-4 items-center justify-start bg-space-blue rounded-3xl p-2 sm:p-3'>
                        <input 
                            type="password" 
                            placeholder="Enter Confirm Password" 
                            className='w-full bg-transparent border-transparent outline-none focus:bg-transparent hover:bg-transparent focus:ring-0 focus:border-transparent text-white'
                            onChange={(e) => setPasswordcheck({ ...Passwordcheck, confirmPassword: e.target.value })}
                        />
                    </div>
                    
                    <form onSubmit={handleconfirmPassword} className="mt-4 sm:mt-6 flex flex-1 w-full items-center justify-center">
                        <button
                            type="submit"
                            className="justify-center space-button w-full hover:nebula-glow text-sm sm:text-base"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        ))
    )
}
export default ResetPassword;