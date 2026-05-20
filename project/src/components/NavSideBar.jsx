import React from "react";
import { Users, MessageSquare, User, Menu, X, House } from "lucide-react";
import { useIsMobile } from "../util/useIsMobile";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button"
import { Combobox, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxContent, ComboboxTrigger } from "./ui/combobox"
import CrisisSupport from "./CrisisSupport";

const NavSideBar = () =>{

  const [messagesOpen, setMessagesOpen] = React.useState(false)

  const communities = [
    {title: "Anxiety", url: "/community/anxiety" },
    {title: "Grief", url: "/community/grief" },
    {title: "University Students", url: "/community/universityStudents" }
  ] 

  const items = [
    {title: "Communities", url: "/communities", icon: Users, type:"link"},
    {title: "Messages", url: "/messages", icon: MessageSquare, type:"action"},
    {title: "Account", url: "/account", icon: User, type:"link"},
    {title: "Home", url:"/", icon:House, type:"link"}
  ]

  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleSidebar = () =>{
    setIsOpen(!isOpen);
  }

  const sidebarContent = (
      <nav className="sticky flex flex-col h-screen gap-2 p-4 mt-1">
        {
          items.map((item) =>{
            if (item.title === "Communities"){
              return (
                <Combobox key={item.title} communities={communities}>
                  <ComboboxTrigger>
                    <div className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 hover:bg-slate-300 hover:cursor-pointer hover:shadow-md ">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">Communities</span>
                    </div>
                  </ComboboxTrigger>

                  <ComboboxContent>
                    <ComboboxList>
                      {communities?.map((community) => (
                        <NavLink
                            to={community.url}
                            className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 transition-all hover:bg-slate-300 hover:cursor-pointer hover:shadow-md"
                          >
                        <ComboboxItem key={community.title} value={community.title}>
                          
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm font-medium text-pink-800">{community.title}</span>
                          
                        </ComboboxItem>
                        </NavLink>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )
            } else if (item.type === "action"){
                return(<button key={item.title} size="sm" className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 hover:bg-slate-300 hover:shadow-md" 
                   onClick={(e) =>{
                e.preventDefault()
                console.log(`Clicked on ${item.title}`)
                setMessagesOpen(true)
                }}>
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </button>)
            }
            return <NavLink
              key={item.title}
              to={item.url}
              className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 transition-all hover:bg-slate-300 hover:shadow-md"
            >
              <item.icon className="h-5 w-5"/>
              <span className="text-sm font-medium">{item.title}</span>
            </NavLink>
          })
        }
      </nav>
      
   )


   

 if (isMobile) {
    return (
      <>
      {console.log("NavSideBar mounted")}
        {/*hamburger button - fixed position */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        {/*overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
        {/*slide-in sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full w-64 border-r z-50 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="pt-16">{sidebarContent}</div>
        </aside>
      </>
    );
  }
  return (
    <aside className="sticky top-0 h-screen w-64 bg-background border-r flex-shrink-0">
      {sidebarContent}
    </aside>
  );

}
export default NavSideBar