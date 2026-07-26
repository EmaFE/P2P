import React from 'react'
import logImage from '../../assets/images/logIn.jpg'
import { useNavigate } from 'react-router-dom'

const AuthLayout = ({children, image, altText}) =>{
  
  let navigate = useNavigate()

  return(
    <div className='flex flex-initial'>
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-17 pb-12'>
        <button className='cursor-pointer' onClick={() => navigate("/")}> 
          <h2 className='text-3xl font-medium text-black mb-5'>Peer 2 Peer Support Platform</h2>
        </button>
        {children}
      </div>

      <div className='hidden md:flex w-[40vw] h-screen bg-[var(--color-six)] bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 items-center justify-center relative'>
        <img 
          src={logImage} 
          alt={altText} 
          className='w-64 lg:w-[90%] absolute mx-auto shadow-lg shadow-black-400/15 rounded-lg'
          />
      </div>
    </div>
  )
}

export default AuthLayout