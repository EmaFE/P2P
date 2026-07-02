import React from 'react'
import RefNav from './RefNav'
import peerIcon from '../assets/images/group.svg'
import { useNavigate } from 'react-router-dom'
import PopUp from './PopUp'
import { auth } from "../config/firebase"
import { signOut } from 'firebase/auth'
import CommunityRules from './CommunityRules'


const NavBar = () =>{

  let navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [rulesOpen, setRulesOpen] = React.useState(false)

  const logOut = async () =>{
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
    navigate("/login")
  }

  const navBarContent =(
    <>
      <RefNav name="Communities"/>
      <RefNav name="About Us"/>
      <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-pink-800 transition-[text-decoration-color] duration-500 text-xl text-left py-3'
      onClick={ (e) =>{
        e.preventDefault()
        setRulesOpen(true)
      }}
      >Rules</button>
      <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-pink-800 transition-[text-decoration-color] duration-500 text-xl text-xl text-left py-3' 
        onClick={() =>{
          if (auth.currentUser) navigate("/account")
          else navigate("/login")
        }} 
        >Account</button>
      <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-pink-800 transition-[text-decoration-color] duration-500 text-xl text-left py-3'
        onClick={ (e) =>{
          e.preventDefault()
          setOpen(true)
        }}
      >Crisis Support</button>
      <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-pink-800 transition-[text-decoration-color] duration-500 text-xl text-left py-3'
      onClick={ (e) =>{
        e.preventDefault()
        auth.currentUser ? logOut() : navigate("/login")
      }}
      >{auth.currentUser ? "Log Out" : "Log In"}</button>
    </>
  )
  
  return(
    <div className='sticky top-0 bg-white lg:w-[100%] h-auto md:h-full flex justify-between px-6 md:px-20 py-4 border-b-1 border-slate-300 shadow-black/20 z-50 w-screen'>
      <a href="#top">
        <div className='flex gap-5 items-center justify-center'>
          <img src={peerIcon} alt="Message Icon" className='w-10 h-10 md:h-20'/>
          <h2 className='text-3xl font-semibold mt-2'>P2P</h2>
        </div>
      </a>
      <div className='hidden md:flex gap-5 justify-center'>
        {navBarContent}      
      </div>

      {open && <PopUp title="Crisis Support" text="Please contact the crisis helpline at 1800 247 247 or text 'HELP' to 51444" onClose={() => setOpen(false)} />}
        
      {rulesOpen && <CommunityRules open={rulesOpen} onOpenChange={setRulesOpen} />}
      
    </div>
  )
}

export default NavBar