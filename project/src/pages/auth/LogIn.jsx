import React, { use } from 'react'
import AuthLayout from './AuthLayout'
import generateRandomUsername from 'generate-random-username'
import Input from './Input'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail, checkPassword } from '../../util/helper'
import logImage from '../../assets/images/logIn.jpg'

import { auth, db } from "../../config/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider,  signInWithPopup, signOut, signInWithRedirect } from 'firebase/auth'
import {doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore'
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getUserByEmail } from '../../config/firebase'
import PopUp from '@/components/PopUp'
import CommunityRules from '@/components/CommunityRules'
import TermsAndConditions from '../../components/Terms'
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
  const [communityRulesOpen, setCommunityRulesOpen] = React.useState(false)
  const [communityRulesAccepted, setCommunityRulesAccepted] = React.useState(false)

  let navigate = useNavigate()

  const handleLogin = async (e) =>{
    e.preventDefault()
    if (error) setError('')

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
        // console.log("banned from log in")
        setBanOpen(true);
        await signOut(auth);
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
        setLoading(true)
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
      setError("Please accept the terms and conditions when logging in with Google. ")
      return
    }
    if (!communityRulesAccepted){
      setError("Please accept the community rules when logging in with Google.")
      return
    }
    try{
      if (error) {
        setError('')
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email
      //check if user already exists in users db
      const userDoc = await getUserByEmail(email);
      const user = result.user;

      if (!userDoc) {
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
      } else {
          if(userDoc.status === "suspended"){
            // console.log("suspended from sign in with google")
            setSusOpen(true)
          }
          if(userDoc.status === "banned"){
            setBanOpen(true)
            await signOut(auth)
          }
          if(userDoc.status === "active"){
            navigate("/")
          }

          setLoading(false)

          if(!loading && !susOpen){
            navigate("/")
          }
      }
    } catch(error){
        // console.log("Error signing in with Google:",error);
        toast.error("Signing in with Google did not work. Try again later.")
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


  const openCommunityRules = (e) =>{
    e.preventDefault()
    setCommunityRulesOpen(true)
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

          { termsOpen && <TermsAndConditions open={termsOpen} onOpenChange={setTermsOpen} /> }
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

          { communityRulesOpen && <CommunityRules open={communityRulesOpen} onOpenChange={setCommunityRulesOpen} /> }
          <FieldGroup className="mb-4 mt-2">
            <Field orientation="horizontal">
              <Checkbox id="community-rules-checkbox" name="community-rules-checkbox" checked={communityRulesAccepted} onCheckedChange={setCommunityRulesAccepted} />
              <FieldLabel htmlFor="community-rules-checkbox">
                <button
                  className='hover:cursor-pointer hover:underline'        
                  onClick={openCommunityRules}                  
                >
                  Accept our community rules
                </button>
                
              </FieldLabel>
            </Field>
          </FieldGroup>

          {susOpen && <PopUp title="Account Suspended" text="Your account has been suspended. You cannot create, and delete posts or comments until the suspension is lifted. You can only read posts and comments. Log in again to access the platform." onClose={() => setSusOpen(false)} />}
            
          {banOpen && <PopUp title="Account Banned" text="Your account has been banned. You cannot access the platform anymore." onClose={() => setBanOpen(false)} />}

          <button
            type='submit'
            className='w-full text-m font-medium text-white bg-[var(--color-six)] hover:bg-[var(--color-secondary)] rounded-lg px-6 py-3 mt-4 mb-6 shadow-lg shadow-grey-100 cursor-pointer'
          >
            Log In
          </button>
          
          <p>Don't have an account?
            <Link className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-secondary)]'
            to="/signup"
            >
              Sign Up
            </Link>
          </p>

          <span>or</span> <br />

          <button className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-secondary)] hover:cursor-pointer'
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