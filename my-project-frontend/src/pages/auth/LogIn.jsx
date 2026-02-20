import React, { use } from 'react'
import AuthLayout from './AuthLayout'
import Input from './Input'
import { Link } from 'react-router-dom'
import { validateEmail, checkPassword } from '../../util/helper'
import logImage from '../../assets/images/logIn.jpg'

const LogIn = () =>{
  const emailRef = React.createRef()
  const passwordRef = React.createRef()

  const[email, setEmail] = React.useState('')
  const[password, setPassword] = React.useState('')
  const[error, setError] = React.useState('')

  const handleLogin = async (event) =>{
    event.preventDefault()
    setError('')

    if(!validateEmail(email)){
      setError('Please enter a valid email address.')
      return;
    }

    if(!password){
      setError('Please enter the correct password.')
      return;
    }
    
    const res = await fetch("http://localhost:8080/auth/logIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    localStorage.setItem("userToken", data.token);

  }

  const handleEnter = (e, nextRef) =>{
    if(e.key === "Enter"){
      e.preventDefault()
      nextRef.current.focus()
    }
  }

  return(
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome back!</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your log in details.</p>
        <form onSubmit={handleLogin}>
          <Input
            ref={emailRef}
            value={email}
            onChange={setEmail}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
            onKeyDown={(e) => handleEnter(e, passwordRef)}
          />

          <Input
            ref={passwordRef}
            value={password}
            onChange={setPassword}
            label="Password"
            placeholder="minimum 8 characters"
            type="password"
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                handleLogin(e)
              }
            }}
          />

          {error && <p className='text-red-400 text-s'>{error}</p>}

          <button
            type='submit'
            className='w-full text-m font-medium text-white bg-[var(--color-six)] hover:bg-[var(--color-secondary)] rounded-lg px-6 py-3 mt-4 mb-6 shadow-lg shadow-grey-100 cursor-pointer'
            onClick={handleLogin}
          >
            Log In
          </button>
          
          <p>Don't have an account?
            <Link className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-primary)]'
            to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default LogIn