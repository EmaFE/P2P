
import React from "react"
import CommunityLayout from "./CommunityLayout"

const Grief = () =>{
  return(
    <CommunityLayout 
      name="Grief"
      description="An online peer space for expressing grief through words, stories, and reflection. Post when you’re ready, respond when you have the energy, or simply read and feel less alone. There’s no right way to grieve here; just mutual respect, empathy, and support from people who understand loss."
      categories={["General", "Advice"]}
      filterOptions={["All", "Today", "Family member", "Partner", "Friend"]}
    />
  )
}

export default Grief