
import React from "react";

const RefNav = ({name}) =>{

  return(
    <>
      <a 
        className='cursor-pointer my-6 border-none underline underline-offset-4 decoration-1 decoration-transparent hover:decoration-current hover:text-[var(--color-eight)] transition-[text-decoration-color] duration-500 text-xl' 
        href={`/#${name}`}
        >
          {name}
      </a>
       
    </>
  )}

export default RefNav