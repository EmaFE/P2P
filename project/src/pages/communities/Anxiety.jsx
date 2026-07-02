
import React from "react"
import CommunityLayout from "./CommunityLayout"

const Anxiety = () =>{
  return(
    <CommunityLayout 
      name="Anxiety"
      description="A supportive, judgment-free space to share posts about anxiety, read others’ experiences, and connect through understanding. Whether you’re venting, asking for advice, or quietly scrolling, this peer-to-peer community is here to remind you that anxiety is shared and manageable together, at your own pace. The 'Drafts' section is private to you. Take your time, write whatever's on your mind, and only share it when (and if) it feels right."
      categories={["General", "Drafts"]}
      filterOptions={["Not Removed", "Social Anxiety", "Phobias", "Public Speaking", "Panic Disorders", "Employment", "Unemployment"]}
      sortOptions={["Most Liked", "Newest", "Most Commented", "Oldest"]}
    />
  )
}

export default Anxiety