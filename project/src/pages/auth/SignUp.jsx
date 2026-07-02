import React, { use } from 'react'
import { Link } from 'react-router-dom'
import { generateUsername } from 'unique-username-generator'
import AuthLayout from "./AuthLayout"
import Input from "./Input"
import { validateEmail, checkPassword } from '../../util/helper'
import { useNavigate } from 'react-router-dom'

import { auth, db, getUserByEmail, deleteUserAfterRegistration } from "../../config/firebase"
import { createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc, query, collection, where } from 'firebase/firestore'
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import CommunityRules from '../../components/CommunityRules'
import TermsAndConditions from '../../components/Terms'
import { toast } from 'sonner'
import PopUp from '@/components/PopUp'


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
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [termsOpen, setTermsOpen] = React.useState(false)
  const [susOpen, setSusOpen] = React.useState(false)
  const [banOpen, setBanOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [communityRulesOpen, setCommunityRulesOpen] = React.useState(false)
  const [communityRulesAccepted, setCommunityRulesAccepted] = React.useState(false)
  const [showEmailPopUp, setShowEmailPopUp] = React.useState(false)

  let navigate = useNavigate()


  const handleSignUp = async (e) =>{
    e.preventDefault()
  
     if (!termsAccepted) {
      setError("Please accept the terms and conditions to sign up.")
    }
    if (!communityRulesAccepted){
      setError("Please accept the community rules to sign up.")
    } 
        
    if (error) {
      setError('')
    } 

    if(!validateEmail(email)){
      setError("Please enter a valid email address.")
      return;
    }

    if(!password){
      setError("Please enter a password.")
      return;
    }

    if(password.length < 8){
      setError("Please enter a password of at least 8 characters")
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
        // console.log("entered if")
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // console.log("user credential: ", userCredential)
        // console.log("user credential uid: ", userCredential.user.uid)
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          username: username,
          email: email,
          createdAt: serverTimestamp(),
          status: "active",
          role: "user",
          reportCount: 0,
          suspendCount: 0,
        })

        await sendEmailVerification(userCredential.user)

        setShowEmailPopUp(true)
        //  navigate("/")
     
    } catch(error){
      console.error(error)
      toast.error("Signing up did not work or user already exists.")
    }
    
    
  }

  const signInWithGoogle = async (event) =>{
    event.preventDefault()
    if (!termsAccepted){
      setError("Please accept the terms and conditions when logging in with Google..")
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
        const randomUsername = await generateUniqueUsername();
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
      } else{
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

  const generateUniqueUsername = async () => {
    while (true) {
    const username = generateUsername("-", 2);

    const usernameDoc = await getDoc(doc(db, "usernames", username));

    if (!usernameDoc.exists()) {
      return username;
    }
  }
  }

  const handleEnter = (e, nextRef) =>{
    if(e.key === "Enter"){
      e.preventDefault()
      nextRef.current.focus()
    }
  }

  const changeUsername = async (e) =>{
    e.preventDefault()
    setUsername(await generateUniqueUsername())
  }

  const openTerms = (e) =>{
    e.preventDefault()
    setTermsOpen(true)
  }

  const openCommunityRules = (e) =>{
    e.preventDefault()
    setCommunityRulesOpen(true)
  }

  const checkEmailVerification = async () => {
    await auth.currentUser.reload()
    if (auth.currentUser.emailVerified) {
      setShowEmailPopUp(false)
      navigate("/")
    } else{
      toast.error("Email not verified yet. Please check your inbox and verify your email.")
    }
  }

  const resendEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser)
    } catch (error) {
      console.error("Error resending email verification:", error)
      toast.error("Failed to resend email verification. Please try again later.")
    }
  }

  const cancelRegistration = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        await deleteUserAfterRegistration(user)
        await user.delete()
        setShowEmailPopUp(false)
        navigate("/signup")
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      toast.error("Failed to cancel registration. Please try again later.")
    }
  }


  return(
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account!</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us by entering your details below.</p>

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

                <button className='w-32 text-m font-medium text-white bg-[var(--color-six)] hover:bg-[var(--color-secondary)] rounded-lg px-2 py-2 mt-1 mb-5 shadow-md shadow-grey-100 cursor-pointer inline-block'
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
              placeholder="minimum 8 characters"
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

            { termsOpen && <TermsAndConditions open={termsOpen} onOpenChange={setTermsOpen} /> }
            <FieldGroup className="mb-4 mt-2">
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

            {showEmailPopUp && <PopUp title="Email Verification Sent" text="A verification email has been sent to your email address. Please check your inbox and verify your email before continuing." 

            button1Text="Verified"  
            button1Action={() => checkEmailVerification()} 
            
            button2Text="Resend Email" 
            button2Action={() => resendEmailVerification()} 
            
            button3Text="Cancel Registration" 
            button3Action={() => cancelRegistration()} 
            
            onClose={() => setShowEmailPopUp(false)} />
            }

            <button
              type='submit'
              className='w-full text-m font-medium text-white bg-[var(--color-six)] hover:bg-[var(--color-secondary)] rounded-lg px-6 py-3 mt-4 mb-6 shadow-lg shadow-grey-100 cursor-pointer'
            >
              Create Account
            </button>

            <p>Already have an account? 
              <Link 
                className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-secondary)]'
                to="/login"
              > 
               Log in here
              </Link>
            </p>
            <p>or</p>
            <button 
                className='font-medium text-[var(--color-six)] underline pl-1 hover:text-[var(--color-secondary)] hover:cursor-pointer'
                onClick={signInWithGoogle}
              > 
              Sign in with Google
            </button>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp