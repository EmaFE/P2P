import React from "react";
const Slider = ({ pic: Icon, name, description, bgColor, isVisible, duration}) =>{
  
  return(
    <>
      <div className={`flex md:flex
        ${bgColor === 'dark' ? 'bg-[var(--color-six)]/60' : 'bg-[var(--color-seven)]/70'}
        mx-2 px-10 py-5 rounded-xl w-60 md:w-80 lg:w-220
        transition-all
        ease-in
        duration-${duration}
        ${ (isVisible) ? "opacity-100 translate-x-0" : `opacity-0 -translate-x-32`}
      `}>
        <Icon className="w-15 h-15 mr-5" />
        <div className="flex flex-col">
          <h2 className="text-md md:font-semibold mt-2">{name}</h2>
          <p className="text-sm hidden md:block">{description}</p>
        </div>
      </div>
    </>
  )
}

export default Slider