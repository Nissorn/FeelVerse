import React from 'react'
import { useState, useEffect, useContext } from 'react';
import gsap from 'gsap';
import Footer from '../components/Footer';
import axios from 'axios';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const EmailVerify =()=>{
    const inputRefs = React.useRef([])
    const navigate = useNavigate();

    const loction = useLocation();
    console.log(loction)
    const Emailreg = loction.state;


    axios.defaults.withCredentials = true;
    const {backendUrl,isloggin,userData,getUserData} = useContext(AppContext)
    

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

    const handlesubmit = async (e) =>{
        try{
            e.preventDefault();
            const otpArray = inputRefs.current.map(e=>e.value)
            const otp = otpArray.join('')
            
            console.log(Emailreg);
            const {data} = await axios.post(backendUrl+'/api/auth/verify-account',{email:Emailreg ,otp:otp})
            console.log(data);

            if(data.success){
                console.log("OTP SUCCESS");
                localStorage.setItem('isAuthenticated', true);
                navigate('/story')
            }else{
                alert("OTP WORNG");
            }
        }catch(error){
            alert("Error : OTP WORNG");
        }
    }
    
    return(
        <div className="flex min-h-screen items-center justify-center p-4 bg-black/10">
            <div className='glass-card p-6 sm:p-8 md:p-10 w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-lg mx-auto'>
                <h1 className='text-white font-semibold text-xl sm:text-2xl text-center'>Email Verify OTP</h1>         
                <p className='mt-2 sm:mt-3 text-center text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

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
      
                <button type="submit" className="space-button w-full hover:nebula-glow text-sm sm:text-base" onClick={handlesubmit}>
                    Verify Email
                </button>
            </div>
        </div>
    )
}
export default EmailVerify;