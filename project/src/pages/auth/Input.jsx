import React from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

const Input = ({ref, value, onChange, label, placeholder, type, onKeyDown}) =>{

  const [showPassword, setShowPassword] = React.useState(false)

  const togglePassword = () =>{
    setShowPassword(!showPassword)
  }

  return(
    <div>
      <label className="text-s text-slate-800">{label}</label>
      <div className="w-full flex justify-between items-center border border-slate-300 rounded-lg px-4 py-3 mt-2 mb-5 bg-slate-100 focus-within:border-[var(--color-six)] focus-within:shadow-md focus-within:shadow-black/20">

        <input
          ref={ref}
          type={type == "password" 
            ? showPassword ? "text" : "password" :
            "email"
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none"
          onKeyDown={onKeyDown}
        />

        {
          type === "password" && (
            <>
              {showPassword ? 
                <FaRegEye
                  size={20}
                  className="cursor-pointer"
                  onClick={() => togglePassword()} />
                  :
                <FaRegEyeSlash
                  size={20}
                  className="cursor-pointer text-slate-400"
                  onClick={() => togglePassword()} />
              }
            </>
          )
        }
      </div>
    </div>
  )
}

export default Input