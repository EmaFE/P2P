import React from "react";
import { Users, Shield, User, Menu, X, LogOut, House, Phone } from "lucide-react";
import { useIsMobile } from "../util/useIsMobile";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button"
import { Combobox, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxContent, ComboboxTrigger } from "./ui/combobox"
import PopUp from "./PopUp";
import CommunityRules from "./CommunityRules";
import { useNavigate } from "react-router-dom";
import { logOut } from "../config/firebase";

const NavSideBar = () =>{
 
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)
  const [crisisOpen, setCrisisOpen] = React.useState(false)
  const [rulesOpen, setRulesOpen] = React.useState(false)

  const navigate = useNavigate()
  
  const communities = [
    {title: "Anxiety", url: "/community/anxiety" },
    {title: "Grief", url: "/community/grief" },
    {title: "University Students", url: "/community/universityStudents" }
  ] 

  const items = [
    {title: "Communities", url: "/communities", icon: Users, type:"link"},
    {title: "Account", url: "/account", icon: User, type:"link"},
    {title: "Home", url:"/", icon:House, type:"link"},
    {title: "Rules", icon: Shield, type:"action"},
    {title: "Crisis Support", icon: Phone, type:"action"},
    {title: "Log Out", url: "/login", icon: LogOut, type:"action"}
  ]

  const toggleSidebar = () =>{
    setIsOpen(prev => !prev);
  }

  const sidebarContent = (
      <nav className="sticky flex flex-col h-screen gap-2 p-4 z-[100] bg-white">
        { rulesOpen && <CommunityRules open={rulesOpen} onOpenChange={setRulesOpen} /> }
        { crisisOpen && <PopUp title="Crisis Support" text="Please contact the crisis helpline at 1800 247 247 or text 'HELP' to 51444" onClose={() => setCrisisOpen(false)} />}
        {
          items.map((item) =>{
            if (item.title === "Communities"){
              return (
                <Combobox key={item.title}>
                  <ComboboxTrigger>
                    <div className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 hover:text-white hover:bg-[var(--color-six)] hover:cursor-pointer hover:shadow-md cursor-pointer">
                      <span className="text-sm font-medium">Communities</span>
                    </div>
                  </ComboboxTrigger>

                  <ComboboxContent>
                    <ComboboxList>
                      {communities?.map((community) => (
                        community.url && <NavLink
                            to={community.url}
                            className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 transition-all hover:cursor-pointer hover:shadow-md"
                          >
                        <ComboboxItem key={community.title} value={community.title} className="hover:bg-[var(--color-six)] hover:text-white" >
                            <span className="text-sm font-medium  hover:text-white">{community.title}</span>
                            <item.icon className="h-5 w-5 hover:text-white" />
                        </ComboboxItem>
                        </NavLink>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )
            } else if (item.type === "action"){
                return(
                  <button key={item.title} size="sm" 
                    className={cn(`flex ${item.title==="Rules" ? "mt-auto" : ""} gap-3 px-4 py-3 rounded-lg text-pink-800 hover:text-white 
                    hover:bg-[var(--color-six)] hover:shadow-md cursor-pointer`)}
                    onClick={(e) =>{
                      e.preventDefault()
                      if (item.title === "Crisis Support") setCrisisOpen(true)
                      else if (item.title === "Rules") setRulesOpen(true)
                      else if (item.title === "Log Out") {
                        logOut(),
                        navigate(item.url)}
                      }}>
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>)
                }
            return <NavLink
              key={item.title}
              to={item.url}
              className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 transition-all hover:text-white hover:bg-[var(--color-six)] hover:shadow-md"
            >
              <span className="text-sm font-medium">{item.title}</span>
            </NavLink>
          })
        }
      </nav>
      
   )

  if (isMobile) {
      return (
        <>
          {/*hamburger button; fixed */}
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 shadow-md"
            onClick={toggleSidebar}
          >
            {isOpen ? <X className="h-5 w-5 z-[100]" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/*slide-in sidebar */}
          <aside
            className={cn(
              "fixed overflow-y h-full top-0 left-0 w-64 border-r z-10 bg-white transform transition-transform duration-300 ease-in-out",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="pt-16">{sidebarContent}</div>
          </aside>
        </>
      )
    }
  return (
    <aside className="sticky top-0 h-screen w-64 border-r flex-shrink-0">
      {sidebarContent}
    </aside>
  )

}
export default NavSideBar