
import React from "react"
import CommunityLayout from "./CommunityLayout"

const Grief = () =>{
  return(
    <CommunityLayout 
      name="Grief"
      description1="An online peer space for expressing grief through words, stories, and reflection. Post when you’re ready, respond when you have the energy, or simply read and feel less alone. There’s no right way to grieve here; just mutual respect, empathy, and support from people who understand loss. "
      description2="The 'Advice' section is a space for users to share guidance with one another on what to do after a loved one has passed - e.g. registering the death, getting death certificates, arranging the funeral, and notifying organizations."
      description3="'Stories' - a space for users to share their personal experiences of grief and loss, and to read the stories of others."
      description4="'Advice' - a space for users to share guidance with one another on what to do after a loved one has passed."
      categories={["Stories", "Advice"]}
      filterOptions={["Family Member", "Partner", "Friend", "Family Friend", "Co-Worker", "Pet", "Animal", "Anticipatory", "Sudden Loss", "Terminal Illness", "Accident", "Suicide"]}
      sortOptions={["Most Liked", "Newest", "Most Commented", "Oldest"]}
    />
  )
}

export default Grief


