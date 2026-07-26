import { Search, Ban, ShieldCheck, ShieldX } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getRelativeTime } from "@/lib/relative-time";
import ReasonDeleteDialog from "./ReasonDeleteDialog";
import { deleteContent, dismiss, db } from "@/config/firebase";
import { Badge } from "../ui/badge";
import { Context } from "@/util/authContext";
import { collection, onSnapshot } from "firebase/firestore"
import { cn } from "@/lib/utils";

export default function AdminUsers(){

    const { user } = React.useContext(Context)
    const [users, setUsers] = React.useState([])
    const [search, setSearch] = React.useState("")
    const [filter, setFilter] = React.useState("All")
    const [expanded, setExpanded] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  
    React.useEffect(() => {
      const usersRef = collection(db, "users")
      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const updatedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setUsers(updatedUsers)
      })
      return () => unsubscribe() //cleanup listener on unmount
    }, []) //runs once, but listener staus active
  
    const filteredUsers= users.filter((user) =>{
      const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) || user.uid.toLowerCase().includes(search.toLowerCase()) || user.createdAt.toLowerCase().includes(search.toLowerCase()) || user.reason.toLowerCase().includes(search.toLowerCase())
      if (filter === "All") return matchesSearch
      if (filter === "Active") return matchesSearch && user.status === "active"
      if (filter === "Suspended") return matchesSearch && user.status === "suspended"
      if (filter === "Banned") return matchesSearch && user.status === "banned"
      if (filter === "Report No.")  return matchesSearch && user.reportCount > 0
      return matchesSearch
    })
  
    const handleBanUser = async (reason) => {
      await deleteContent(deleteDialogOpen.user.id, reason, "users", "banned", user.uid)
      setUsers((prev) => prev.filter((user) => user.id !== deleteDialogOpen.user.id))
    }

    const handleSuspendUser = async (reason) => {
      await deleteContent(deleteDialogOpen.user.id, reason, "users", "suspended", user.uid)
      setUsers((prev) => prev.filter((user) => user.id !== deleteDialogOpen.user.id))
    }
  
    const handleActivateUser = async (id) => {
      await dismiss(id, "users", user.uid)
      setUsers((prev) => prev.filter((user) => user.id !== id))
    }


   return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/4 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <div>
          {["All", "Active", "Suspended", "Banned", "Report No."].map((status) =>{
            return (
              <Button key={status} variant={filter === status ? "default" : "outline"} size="sm" onClick ={() => setFilter(status)}>
                {status}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Report Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableHeader>

          <TableBody>
            {filteredUsers.map((user) =>{
              return(
                <TableRow key={user.id} className={user.status === "suspended" ? "bg-orange-50" : user.status === "banned" ? "bg-red-50 opacity-60" : ""}>
                  <TableCell className="max-w-sm">
                    <div className=" font-medium">@{user.username}</div>
                      <p className="text-sm text-card-foreground w-full whitespace-pre-wrap break-words">
                        {!expanded && user.deletionReason?.length > 10 ? `Reason: ${user.deletionReason.slice(0,10)}` + "..." : user.deletionReason ? `Reason: ${user.deletionReason}` : ""}
                        {user.deletionReason?.length > 10 && (
                          <button
                            onClick={() => setExpanded((prev) => ({ ...prev, [user.id]: !prev[user.id] }))}
                            className={cn("ml-1 text-sm font-medium text-primary hover:underline", expanded[user.id] ? "text-[var(--color-six)]" : "text-pink-800")}
                          >
                            {expanded[user.id] ? "Show less" : "Read more"}
                          </button>
                        )}
                      </p>
                  </TableCell>


                  <TableCell>{user.email}</TableCell>

                  <TableCell>{getRelativeTime(user.createdAt)}</TableCell>

                  <TableCell className="text-center">{user.reportCount}</TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      {user.status === "deleted" && <Badge variant="destructive">Deleted</Badge>}
                      {user.status === "suspended" && <Badge variant="secondary">Suspended</Badge>}
                      {user.status === "active" && <Badge className="outline">Active</Badge>}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                     <div className="flex justify-end gap-1">
                      {user.status !== "active" && (
                        <Button variant="outline" size="sm" onClick={() => handleActivateUser(user.id)}>
                          <ShieldCheck className="h-3 w-3 mr-1" /> 
                            Activate
                        </Button>
                      )}
                      {user.status !== "suspended" && (
                        <Button variant="secondary" size="sm" onClick={() => setDeleteDialogOpen( {user: user, action: "Suspend"} )}>
                          <ShieldX className="h-3 w-3 mr-1" /> 
                            Suspend
                        </Button>
                      )}
                      {user.status !== "banned" && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen( {user: user, action: "Ban"} )}>
                          <Ban className="h-3 w-3 mr-1" /> 
                            Ban
                        </Button>
                      )}
                    </div>
                  </TableCell>

                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ReasonDeleteDialog
        open = {deleteDialogOpen}
        onOpenChange = {()=> setDeleteDialogOpen(false)}
        title = {`${deleteDialogOpen.action} user`} 
        description = {deleteDialogOpen.user ? `${deleteDialogOpen.action} @${deleteDialogOpen.user.username}` : ""}
        confirmText ={`${deleteDialogOpen.action} user`}
        onConfirm={deleteDialogOpen.action  === "Suspend" ? handleSuspendUser : handleBanUser}
      />

    </div>
  )
} 