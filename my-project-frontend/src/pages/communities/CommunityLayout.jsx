import React from "react";
import NavSideBar from "../../components/NavSideBar";
import CommunityPage from "./CommunityPage";

const CommunityLayout = () =>{
  
  return(
    <div className="flex">
      <NavSideBar/>
      <CommunityPage
        communityName="Anxiety"
        description="A supportive, judgment-free space to share posts about anxiety, read others’ experiences, and connect through understanding. Whether you’re venting, asking for advice, or quietly scrolling, this peer-to-peer community is here to remind you that anxiety is shared and manageable together, at your own pace."
        categories={["General", "Reflections"]}
        filterOptions={["All", "Today", "Emplyment", "Unemployment"]}
        sortOptions={["Newest", "Most Commented", "Oldest"]}
      />
    </div>
  )
}

export default CommunityLayout