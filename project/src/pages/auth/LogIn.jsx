import React, { use } from 'react'
import AuthLayout from './AuthLayout'
import generateRandomUsername from 'generate-random-username'
import Input from './Input'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail, checkPassword } from '../../util/helper'
import logImage from '../../assets/images/logIn.jpg'

import { auth, db } from "../../config/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider,  signInWithPopup, signOut } from 'firebase/auth'
import {doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore'
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getUserByEmail } from '../../config/firebase'
import PopUp from '@/components/PopUp'

import { toast } from "sonner";

const LogIn = () =>{
  const emailRef = React.createRef()
  const passwordRef = React.createRef()

  const[email, setEmail] = React.useState('')
  const[password, setPassword] = React.useState('')
  const[error, setError] = React.useState('')
  const[termsAccepted, setTermsAccepted] = React.useState(false)
  const [termsOpen, setTermsOpen] = React.useState(false)
  const [susOpen, setSusOpen] = React.useState(false)
  const [banOpen, setBanOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  let navigate = useNavigate()

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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userDB = await getUserByEmail(email);

      if (userDB.status === "banned") {
        await signOut(auth);
        setBanOpen(true);
        return;
      }

      if (userDB.status === "suspended") {
        setSusOpen(true);
      }

      if (userDB.role && userDB.role === "admin"){
        navigate("/admin")
      }
     
      setLoading(false)

      if(!loading && !susOpen){
        navigate("/")
      }

    } catch (error) {
      console.error("error logging in message: ", error.message)
      console.error("error logging in code: ", error.code)
      toast.error("Invalid credentials")
    }
    
  }

  const signInWithGoogle = async (event) =>{
    event.preventDefault()
    if (!termsAccepted){
      setError("Please accept the terms and conditions to sign up.")
    } else{
        try{
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;

          
          //check if user already exists in firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if(userDoc?.status === "suspended"){
            setSusOpen(true)
          }
          if(userDoc?.status === "banned"){
            setBanOpen(true)
          }

          if (!userDoc.exists()) {
            //first time => generate username and create document
            const randomUsername = generateRandomUsername();
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              email: user.email,
              username: randomUsername,
              createdAt: serverTimestamp(),
              status: "active",
              role: "user",
              reportCount: 0,
              suspendCount: 0,
            });
          }
        } catch(error){
            console.log("Error signing in with Google:",error);
        } finally{
            navigate("/")
        }
      }
  }

  const handleEnter = (e, nextRef) =>{
    if(e.key === "Enter"){
      e.preventDefault()
      nextRef.current.focus()
    }
  }

  const openTerms = (e) =>{
    e.preventDefault()
    setTermsOpen(true)
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

          <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone...
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <FieldGroup className="mb-2 mt-2">
              <Field orientation="horizontal">
                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" checked={termsAccepted} onCheckedChange={setTermsAccepted} />
                <FieldLabel htmlFor="terms-checkbox-basic">

                  <button 
                    className='hover:cursor-pointer hover:underline'
                    onClick={openTerms}
                    >
                    Accept terms and conditions
                  </button>
                  
                </FieldLabel>
              </Field>
          </FieldGroup>

          {susOpen && <PopUp title="Suspended User" text="Your account has been suspended. You cannot create, and delete posts or comments until the suspension is lifted. You can only read posts and comments. Log in again to access the platform." onClose={() => setSusOpen(false)} />}
            
          {banOpen && <PopUp title="Banned User" text="Your account has been banned. You cannot access the platform anymore." onClose={() => setBanOpen(false)} />}

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

          <span>or</span> <br />

          <button className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-primary)] hover:cursor-pointer'
            onClick={signInWithGoogle}
            >
            Sign in with Google
          </button>
        </form>
      </div>
    </AuthLayout>    
  )
}

export default LogIn