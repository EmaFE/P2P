
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Settings, Activity } from "lucide-react";
import  MyActivity  from "./MyActivity";
import  AccountSettings  from "./AccountSettings";
import { getUser, getUserName } from "@/config/firebase";
import { Context } from "../util/authContext"
import NavSideBar from "../components/NavSideBar";
import image from "@/assets/images/bg_msg_clean.svg"
export default function Account () {

  const { user } = React.useContext(Context)
  const [username, setUsername] = React.useState("")

  React.useEffect(() => {
    const fetchUsername = async () => {
      const user = await getUser()
      setUsername(user?.username)
    }
    fetchUsername()
  }, [])
  
  return ( 
  <div className="min-h-screen flex">

      <div
        style={{ backgroundImage: `url(${image})` }}
        className="absolute inset-0 bg-cover bg-center opacity-70 hidden md:block"
      />

      <NavSideBar />

      <div className="z-50 flex-1 min-w-0 px-4 py-10">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">
            My Account
          </h1>
          <h3>Hi {username}!</h3>
          <div className="flex-1">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className=" w-full bg-white">
                <TabsTrigger value="activity" className="gap-1.5 data-[state=active]:bg-[var(--color-six)] data-[state=active]:text-white  hover:bg-slate-300 hover:scale-101 cursor-pointer">
                  <Activity className="h-4 w-4">My Activity</Activity>
                  <label>My Activity</label>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-1.5 data-[state=active]:bg-[var(--color-six)] data-[state=active]:text-white  hover:bg-slate-300 hover:scale-101 cursor-pointer">
                  <Settings className="h-4 w-4">Account Settings</Settings>
                  <label>Account Settings</label>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="mt-4">
                <AccountSettings user={user}></AccountSettings>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <MyActivity user={user}></MyActivity>
              </TabsContent>
            </Tabs>
          </div>
          </div>
      </div>
    </div>
  )
}