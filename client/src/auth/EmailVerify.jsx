import React from 'react'
import { useState, useEffect, useContext } from 'react';
import gsap from 'gsap';
import Footer from '../components/Footer';
import axios from 'axios';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const EmailVerify =()=>{

    const inputRefs = React.useRef([])
    const navigate = useNavigate();

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
            
            const {data} = await axios.post(backendUrl+'/api/auth/verify-account',{otp})

            if(data.success){
                console.log("OTP SUCCESS");
                getUserData()
                navigate('/home')
            }else{
                console.log("OTP WORNG");
            }
        }catch(error){

        }
    }

    const sendOTP = async ()=>{
        try{    
          const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp')
            if(data.success){
              console.log("send-verify-otp");
              navigate('/email-verify')
            }else{
              console.log(data.message);
            }
            }catch(err){
                console.log(err.message);
            }
    }
    
    return(
        <div className="flex min-h-screen items-center justify-center">
            <div className='glass-card p-8 w-1/3 h- '>
                <h1 className='text-white font-semibold text-2xl text-center '>Email Verify OTP</h1>         
                <p className='mt-3 text-center text-xl mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

                <div className='flex justify-between my-8 px-10' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_,index)=>(
                        <input type='text' maxLength='1' key={index} required className='w-12  h-16 bg-space-blue  text-center text-xl rounded-lg'
                        ref={e=> inputRefs.current[index]=e}
                        onInput={(e) => handleInput(e,index)}
                        onKeyDown={(e)=> handleKey(e,index)}
                        />
                    ))}
                </div>
                <button onClick={() => sendOTP()}  className="mb-5 register-form  text-[18px] font-bold  text-blue-500 mt-1 text-center w-full">send OTP</button>

      
                <button type="submit" className="space-button w-full hover:nebula-glow " onClick={handlesubmit}>
                    Veritfy Email
                </button>
            </div>
        </div>
    )
}
export default EmailVerify;