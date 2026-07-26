import React from "react";
import NavSideBar from "../../components/NavSideBar";
import CommunityPage from "../CommunityPage";
import image from "@/assets/images/bg_msg_clean.svg"

const CommunityLayout = ({name, description1, description2, description3, description4, categories, filterOptions, sortOptions}) =>{

  return(
    <div className="flex">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="fixed inset-0 bg-cover bg-center opacity-70 hidden md:block"
      />
      <NavSideBar/>
      <CommunityPage
        communityName={name}
        description1={description1}
        description2={description2}
        description3={description3}
        description4={description4}
        categories={categories}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
      />
    </div>
  )
}

export default CommunityLayout