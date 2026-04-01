import React from "react";
import NavSideBar from "../../components/NavSideBar";
import CommunityPage from "./CommunityPage";

const CommunityLayout = ({name, description, categories, filterOptions, sortOptions}) =>{

  return(
    <div className="flex">
      <NavSideBar/>
      <CommunityPage
        communityName={name}
        description={description}
        categories={categories}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
      />
    </div>
  )
}

export default CommunityLayout