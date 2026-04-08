
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Settings, Activity } from "lucide-react";
import  MyActivity  from "./MyActivity";
import  AccountSettings  from "./AccountSettings";
import { getUser } from "@/config/firebase";
import { Context } from "../util/authContext"
import NavSideBar from "./NavSideBar";


export default function Account () {
  const { user } = React.useContext(Context);

  React.useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const data = await getUser(user);
      //console.log(data);
    };

    fetchData();
  }, [user]);
  
  return ( 
    <div className="min-h-screen flex">
      <NavSideBar />

      <div className="flex-1 min-w-0 px-4 py-10">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">
            My Account
          </h1>
          <div className="flex-1">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className=" w-full ">
                <TabsTrigger value="settings" className="gap-1.5 ">
                  <Settings className="h-4 w-4">Account Settings</Settings>
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-1.5">
                  <Activity className="h-4 w-4">My Activity</Activity>
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