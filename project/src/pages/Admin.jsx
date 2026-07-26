import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminPosts from '@/components/admin/AdminPosts';
import AdminComments from '@/components/admin/AdminComments';
import AdminReports from '@/components/admin/AdminReports';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminAudit from '@/components/admin/AdminAudit';
import { auth } from "../config/firebase"
import { signOut } from 'firebase/auth'

export default function Admin() {

  const navigate = useNavigate()
  const logOut = async () =>{
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
    navigate("/login")
  }

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex mt-5 items-center gap-3">
          <Button variant="ghost" size="icon" onClick={(e) => {e.preventDefault(), logOut()}}>
            <ArrowLeft className="h-5 w-5"/>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground"> Review reports and manage content and users</p>
            <p className="text-sm text-muted-foreground"> Refresh to see the table after deletion</p>
          </div>
        </div>

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="reports"><AdminReports /></TabsContent>
          <TabsContent value="posts"><AdminPosts /></TabsContent>
          <TabsContent value="comments"><AdminComments /></TabsContent>
          <TabsContent value="users"><AdminUsers /></TabsContent>
          <TabsContent value="audit"><AdminAudit /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}