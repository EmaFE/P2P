import React, { use } from 'react'
import { Link } from 'react-router-dom'
import generateRandomUsername from 'generate-random-username'
import AuthLayout from "./AuthLayout"
import Input from "./Input"
import { validateEmail, checkPassword } from '../../util/helper'
import { useNavigate } from 'react-router-dom'

import { auth } from "../../config/firebase"
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'


const SignUp = () =>{
  
  const usernameRef = React.createRef()
  const emailRef = React.createRef()
  const passwordRef = React.createRef()
  const passwordCheckRef = React.createRef()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordCheck, setPasswordCheck] = React.useState('')
  const [error, setError] = React.useState('')
  const [username, setUsername] = React.useState('')

  let navigate = useNavigate()


  const handleSignUp = async (e) =>{
    e.preventDefault()
    setError('')  

    if(!validateEmail(email)){
      setError("Please enter a valid email address.")
      return;
    }

    if(!password){
      setError("Please enter a password.")
      return;
    }

    if(password.length < 6){
      setError("Please enter a password of at least 6 characters")
      return;
    }

    if(!passwordCheck){
      setError("Please confirm your password.")
      return;
    }

    if(!checkPassword(password, passwordCheck)){
      setError("Confirmed password does not match.")
      return;
    }

    if(username === ''){
      setError("Please generate a username")
      return;
    }

    try{
      await createUserWithEmailAndPassword(auth, email, password)
       navigate("/home")
    } catch(error){
      console.error(error)
    }
    
  }

  const handleEnter = (e, nextRef) =>{
    if(e.key === "Enter"){
      e.preventDefault()
      nextRef.current.focus()
    }
  }

  const changeUsername = (e) =>{
    e.preventDefault()
    setUsername(generateRandomUsername())
  }


  return(
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account!</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us by enetering your details below.</p>

        <form onSubmit={handleSignUp}>
          {/*generate random username; focus-within only works in parent element*/}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 gap-4'>
              <div className='flex flex-col flex-initial'>
                <label className="text-s text-slate-800">Username</label>
                <div className='w-full border border-slate-300 rounded-lg px-4 py-3 mt-2 mb-1 bg-slate-100 focus-within:border-[var(--color-six)] focus-within:shadow-md focus-within:shadow-black/20'>

                  <input
                    value={username !== '' ? username : ''}
                    placeholder="generate username"
                    type='text'
                    readOnly
                    className='outline-none'
                  />
                </div>

                <button className='w-32 text-m font-medium text-white bg-[var(--color-six)] hover:bg-[var(--color-primary)] rounded-lg px-2 py-2 mt-1 mb-5 shadow-md shadow-grey-100 cursor-pointer inline-block'
                onClick={changeUsername}
              >
                Generate
              </button>
              </div>

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
              placeholder="minimum 6 characters"
              type="password"
              onKeyDown={(e) => handleEnter(e, passwordCheckRef)}
            />
            <Input
              ref={passwordCheckRef}
              value={passwordCheck}
              onChange={setPasswordCheck}
              label="Confirm Password"
              placeholder="retype password"
              type="password"
              onKeyDown={(e) =>{
                if (e.key === "Enter"){
                  handleSignUp(e)
                }
              }}
            />
            </div>

            {error && <p className='text-s text-red-400'>{error}</p>}

            <button
              type='submit'
              className='w-full text-m font-medium text-white bg-[var(--color-six)] hover:bg-[var(--color-primary)] rounded-lg px-6 py-3 mt-4 mb-6 shadow-lg shadow-grey-100 cursor-pointer'
              onClick={handleSignUp}
            >
              Create Account
            </button>

            <p>Already have an account? 
              <Link 
                className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-primary)]'
                to="/login"
              > 
               Log in here
              </Link>
            </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp