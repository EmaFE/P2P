import React from "react";
import NavSideBar from "../../components/NavSideBar";
import CommunityPage from "./CommunityPage";

const CommunityLayout = ({name, description, categories, filterOptions}) =>{

  return(
    <div className="flex">
      <NavSideBar/>
      <CommunityPage
        communityName={name}
        description={description}
        categories={categories}
        filterOptions={filterOptions}
        sortOptions={["Newest", "Most Commented", "Oldest"]}
      />
    </div>
  )
}

export default CommunityLayout