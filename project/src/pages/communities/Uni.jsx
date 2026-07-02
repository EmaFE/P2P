
import React from "react"
import CommunityLayout from "./CommunityLayout"

const Uni = () =>{
  return(
    <CommunityLayout 
      name="University Students"
      description="An online community for university students to post about stress, academics, relationships, and everything in between. Share your experiences, ask questions, or browse anonymously for reassurance and perspective. This space exists to remind students that struggling doesn’t mean failing, and no one has to figure it out alone."
      categories={["General"]}
      filterOptions={["Deadlines Stress", "Assignment Stress", "Loneliness", "Financial Stress", "Employment", "Unemployment", "Romantic Relationships", "Family", "Friends", "Health","Social Anxiety","Public Speaking"]}
      sortOptions={["Most Liked", "Newest", "Most Commented", "Oldest"]}
    />
  )
}

export default Uni