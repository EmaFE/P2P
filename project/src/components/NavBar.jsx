import React from 'react'
import RefNav from './RefNav'
import peerIcon from '../assets/images/group.svg'
import { useNavigate } from 'react-router-dom'
import CrisisSupport from './CrisisSupport'

import { auth } from "../config/firebase"
import { signOut } from 'firebase/auth'

const NavBar = () =>{

  let navigate = useNavigate()
  const[isOpen, setIsOpen] = React.useState(false)

  const [open, setOpen] = React.useState(false)

  const logOut = async () =>{
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
    navigate("/login")
  }

  return(
    <div className='sticky top-0 bg-white lg:w-[100%] h-auto md:h-full flex justify-between px-6 md:px-20 py-4 border-b-1 border-slate-300 shadow-black/20 z-50 w-screen'>
      <a href="#top">
        <div className='flex gap-5 items-center justify-center'>
          <img src={peerIcon} alt="Message Icon" className='w-10 h-10 md:h-20'/>
          <h2 className='text-3xl font-semibold mt-2'>P2P</h2>
        </div>
      </a>
      <div className='hidden md:flex gap-5 justify-center'>
        <RefNav name="Communities"/>
        <RefNav name="About Us"/>
        <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-[var(--color-eight)] transition-[text-decoration-color] duration-500 text-xl' onClick={() =>{navigate("/login")}} >Account</button>
        <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-[var(--color-eight)] transition-[text-decoration-color] duration-500 text-xl text-left py-3'
        onClick={ (e) =>{
          e.preventDefault()
          setOpen(true)
        }}
        >Crisis Support</button>
        <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-[var(--color-eight)] transition-[text-decoration-color] duration-500 text-xl text-left py-3'
        onClick={ (e) =>{
          e.preventDefault()
          logOut()
        }}
        >Log Out</button>
        
      </div>
      {open && <CrisisSupport onClose={() => setOpen(false)} />}

        
      <button
        className="md:hidden flex items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-white/30 bg-opacity-1 backdrop-blur-none z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex flex-col gap-4 md:hidden space-y-4 px-6 py-3 border b border-slate-200 rounded-lg absolute top-full right-0 bg-white shadow-md z-50">
            <RefNav name="Communities"/>
            <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-[var(--color-eight)] transition-[text-decoration-color] duration-500 text-xl text-left py-3' onClick={() =>{navigate("/login")}} >Account</button>
            <RefNav name="About Us"/>
            <button className='cursor-pointer mb-1 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-[var(--color-eight)] transition-[text-decoration-color] duration-500 text-xl text-left py-3'
            onClick={ (e) =>{
              e.preventDefault()
              setOpen(true)
            }}
            >Crisis Support</button>
          </div>
          {open && <CrisisSupport onClose={() => setOpen(false)} />}
        </>
      )}

    </div>
  )
}

export default NavBar