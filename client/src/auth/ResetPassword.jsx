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
                navigate('/home');
            }
        }catch{
        }
    }


    return(
        (state===0)?(
            <div className="flex min-h-screen items-center justify-center">
                <div className='glass-card p-8 w-1/5 '>
                    <h1 className='text-white font-semibold text-2xl text-center '>Reset Password</h1>         
                    <p className='mt-3 text-center text-xl mb-6 text-indigo-300'>Enter your email address</p>
                    <div className='flex flex-row  items-center justify-start bg-space-blue rounded-3xl'>
                        <HiOutlineMail size={24} color="#999" className='ml-10' />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={dataEmail}
                            className='ml-2 mt-2  bg-transparent border-transparent outline-none focus:bg-transparent hover:bg-transparent focus:ring-0 focus:border-transparent'
                            onChange={(e) => setDataEmail(e.target.value)}
                        />
                    </div>
                    

                    <form onSubmit={handlesubmitresetPass} className="mt-4 flex flex-1 w-full items-center justify-center">
                        <button
                            type="submit"
                            className="justify-center space-button w-[80%]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        ):(
        (state===1)?(
            <div className="flex min-h-screen items-center justify-center">
                <div className='glass-card p-8 w-1/3 '>
                    <h1 className='text-white font-semibold text-2xl text-center '>Reset Password OTP</h1>         
                    <p className='mt-3 text-center text-xl mb-6 text-indigo-300'>Enter your email address</p>

                    <div className='flex justify-between my-8 px-10' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_,index)=>(
                            <input type='text' maxLength='1' key={index} required className='w-12  h-16 bg-space-blue  text-center text-xl rounded-lg'
                            ref={e=> inputRefs.current[index]=e}
                            onInput={(e) => handleInput(e,index)}
                            onKeyDown={(e)=> handleKey(e,index)}
                            />
                        ))}
                    </div>
                    
                    <form onSubmit={handlesubmitOTP} className="mt-4 flex flex-1 w-full items-center justify-center">
                        <button
                            type="submit"
                            className="justify-center space-button w-[80%]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        ):(
            <div className="flex min-h-screen items-center justify-center">
                <div className='glass-card p-8 w-1/5 '>
                    <h1 className='text-white font-semibold text-2xl text-center '>New Password</h1>         
                    <p className='mt-3 text-center text-xl mb-6 text-indigo-300'>Enter your email address</p>
                    <div className='flex flex-row  items-center justify-start bg-space-blue rounded-3xl'>
                        <input 
                            type="password" 
                            placeholder="Enter New Password" 
                            className='ml-2 mt-2  bg-transparent border-transparent outline-none focus:bg-transparent hover:bg-transparent focus:ring-0 focus:border-transparent'
                            onChange={(e) => setPasswordcheck({ ...Passwordcheck, password: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-row mt-4 items-center justify-start bg-space-blue rounded-3xl'>
                        <input 
                            type="password" 
                            placeholder="Enter Confirm Password" 
                            className='ml-2 mt-2  bg-transparent border-transparent outline-none focus:bg-transparent hover:bg-transparent focus:ring-0 focus:border-transparent'
                            onChange={(e) => setPasswordcheck({ ...Passwordcheck, confirmPassword: e.target.value })}
                        />
                    </div>
                    
                    <form onSubmit={handleconfirmPassword} className="mt-4 flex flex-1 w-full items-center justify-center">
                        <button
                            type="submit"
                            className="justify-center space-button w-[80%]"
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