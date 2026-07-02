
import React from "react"
import CommunityLayout from "./CommunityLayout"

const Grief = () =>{
  return(
    <CommunityLayout 
      name="Grief"
      description="An online peer space for expressing grief through words, stories, and reflection. Post when you’re ready, respond when you have the energy, or simply read and feel less alone. There’s no right way to grieve here; just mutual respect, empathy, and support from people who understand loss. The 'Advice' section is a space for users to share guidance with one another on what to do after a loved one has passed - e.g. registering the death, getting death certificates, arranging the funeral, and notifying organizations."
      categories={["General", "Advice"]}
      filterOptions={["Not Removed", "Family Member", "Partner", "Friend", "Family Friend", "Co-Worker"]}
      sortOptions={["Most Liked", "Newest", "Most Commented", "Oldest"]}
    />
  )
}

export default Grief


