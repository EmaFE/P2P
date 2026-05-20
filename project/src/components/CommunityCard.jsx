import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../util/authContext"

const Communitycard = ({name, description, route}) =>{

  let navigate = useNavigate()
  const [expanded, setExpanded] = React.useState('')

  const handleCardHover = (size) =>{
    return cardHover ? "line-clamp-none" : `line-clamp-${size}`
  }

  const {user, loading} = useAuth()
  
  if (loading) return null;
  

  return(
    <div className="bg-slate-100 px-10 py-5 rounded-2xl md:px-20 md:py-20 shadow-sm transition duration-300 bg-white/50 hover:scale-115 hover:bg-white hover:shadow-xl"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className='text-center mb-3 text-xl font-bold'>{name}</div>
      <div className={`
          overflow-hidden
          transition-all
          duration-900
          ease-in-out
          ${
            expanded
              ? "max-h-[1000px]"
              : "line-clamp-3 md:line-clamp-4 sm:line-clamp-2 max-h-[9rem] sm:max-h-[3rem] md:max-h-[6rem]"
          }
        `}>{description}</div>
      <button 
        className='font-bold text-md text-white rounded-lg border border-slate-300 bg-[var(--color-six)] px-3 py-1 md:px-5 md:py-3 mt-7 opacity-100
        cursor-pointer hover:bg-[var(--color-eight)]/70 hover:shadow-md hover:text-black decoration-1 decoration-transparent hover:decoration-current transition-colors duration-200'
        onClick={() => navigate(user ? route : "/signUp")}
      >
        {user ? "Enter" : "Join"}
      </button>
    </div>
  )
}

export default Communitycard