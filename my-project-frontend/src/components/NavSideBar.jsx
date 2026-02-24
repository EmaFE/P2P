import React from "react";
import { Users, MessageSquare, User, HeartHandshake, Menu, X } from "lucide-react";
import { useIsMobile } from "../util/useIsMobile";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button"
import { Combobox, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxContent } from "./ui/combobox"

const NavSideBar = () =>{

   const communities = [
    {title: "Anxiety", url: "/community/anxiety" },
    {title: "Grief", url: "/community/grief" },
    {title: "University Students", url: "/community/universityStudents" }
  ]

  const items = [
    {title: "Communities", url: "/communities", icon: Users},
    {title: "Messages", url: "/messages", icon: MessageSquare},
    {title: "Account", url: "/account", icon: User},
    {title: "Crisis Support", url: "/crisisSupport", icon:HeartHandshake}
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
              return  <Combobox communities={communities}>
                        <ComboboxContent>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {communities.map((community) => (
                              <ComboboxItem key={community.title} value={community.title}>
                                <NavLink
                                    key={community.title}
                                    to={community.url}
                                    className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 transition-all hover:bg-slate-300 hover:text-slate-100"
                                  >
                                    <item.icon className="h-5 w-5"/>
                                    <span className="text-sm font-medium">{community.title}</span>
                                  </NavLink>
                              </ComboboxItem>
                            ))}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
            }
            return <NavLink
              key={item.title}
              to={item.url}
              className="flex gap-3 px-4 py-3 rounded-lg text-pink-800 transition-all hover:bg-slate-300 hover:text-slate-100"
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
        {/* Hamburger button - fixed position */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
        {/* Slide-in sidebar */}
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