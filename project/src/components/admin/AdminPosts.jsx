import React from "react";
import { RotateCcw, Search, Trash2} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getRelativeTime } from "@/lib/relative-time";
import ReasonDeleteDialog from "./ReasonDeleteDialog";
import { deleteContent, fetchPosts, dismiss } from "@/config/firebase";
import { Badge } from "../ui/badge";
import { Context } from "@/util/authContext";
import { cn } from "@/lib/utils";

export default function AdminPosts(){

  const { user } = React.useContext(Context)
  const [posts, setPosts] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("All")
  const [expanded, setExpanded] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [refresh, setRefresh] = React.useState(0)

  React.useEffect(() =>{
      const fetchPostsF = async () =>{
        const fetchedPosts = await fetchPosts("general", user)
        setPosts(fetchedPosts)
      }
      fetchPostsF()
    }, [refresh]) //fetch all posts, can be optimsied later if needed

  const filteredPosts = posts.filter((post) =>{
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase()) || post.username.toLowerCase().includes(search.toLowerCase()) || getRelativeTime(post.createdAt).toLowerCase().includes(search.toLowerCase()) 
    if (filter === "All") return matchesSearch
    if (filter === "Active") return matchesSearch && post.status === "active"
    if (filter === "Deleted") return matchesSearch && post.status === "deleted"
    if (filter === "Reported") return matchesSearch && post.status === "reported"
    return matchesSearch;
  })

   const handleDeletePost = async (reason) => {
    await deleteContent(deleteDialogOpen.post.id, reason, "posts","deleted", user.uid)
    setPosts((prev) => prev.filter((post) => post.id !== deleteDialogOpen.id))
    setRefresh((prev) => prev + 1)
    if (refresh === 10){
      setRefresh(0)
    }
  }

  const handleRestore = async (id) => {
    await dismiss(id, "posts", user.uid)
    setPosts((prev) => prev.filter((post) => post.id !== id))
    setRefresh((prev) => prev + 1)
    if (refresh === 10){
      setRefresh(0)
    }
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/4 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <div>
          {["All", "Active", "Reported", "Deleted"].map((status) =>{
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
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableHeader>

          <TableBody>
            {filteredPosts.map((post) =>{
              return(
                <TableRow key={post.id} className={post.status === "reported" ? "bg-orange-50" : post.status === "deleted" ? "bg-red-50 opacity-60" : ""}>
                  <TableCell>
                    <div className=" font-medium">{post.title}</div>
                      <p className="text-sm text-card-foreground w-full whitespace-pre-wrap break-words">
                        {!expanded[post.id] && post.deletionReason?.length > 10 ? `Reason: ${post.deletionReason.slice(0,10)}` + "..." : post.deletionReason ? `Reason: ${post.deletionReason}` : ""}
                          {post.deletionReason?.length > 10 && (
                            <button
                              onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                              className={cn("ml-1 text-sm font-medium text-primary hover:underline", expanded[post.id] ? "text-[var(--color-six)]" : "text-pink-800")}
                            >
                              {expanded[post.id] ? "Show less" : "Read more"}
                            </button>
                          )}
                      </p>
                  </TableCell>


                  <TableCell className="max-w-sm">
                     <p className="text-sm text-card-foreground w-full whitespace-pre-wrap break-words">
                      {!expanded[post.id] && post.content.length > 30 ? post.content.slice(0,30) + "..." : post.content}
                      {post.content.length > 30 && (
                        <button
                          onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className={cn("ml-1 text-sm font-medium text-primary hover:underline", expanded[post.id] ? "text-[var(--color-six)]" : "text-pink-800")}
                        >
                          {expanded[post.id] ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>
                  </TableCell>

                  <TableCell>@{post.username}</TableCell>

                  <TableCell className="text-sm">{getRelativeTime(post.createdAt)}</TableCell>


                  <TableCell>
                    <div className="flex gap-1">
                      {post.status === "deleted" && <Badge variant="destructive">Deleted</Badge>}
                      {post.status === "reported" && <Badge variant="secondary">Reported</Badge>}
                      {post.status === "active" && <Badge className="outline">Active</Badge>}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {
                      post.status === "deleted" ? (
                        <Button className="hover:cursor-pointer" variant="outline" size="sm" onClick={() => handleRestore(post.id)}>
                          <RotateCcw className="h-3 w-3 mr-1"/> Restore
                        </Button>) : (
                          <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen({post : post})}>
                          <Trash2 className="h-3 w-3 mr-1"/> Delete
                        </Button>
                        )
                    }
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
        title = "Delete reported content"
        description = {deleteDialogOpen.post ? `Delete: ${deleteDialogOpen.post.content.slice(0, 20)}` : ""}
        confirmText ="Delete"
        onConfirm={handleDeletePost}
      />

    </div>
  )
} 