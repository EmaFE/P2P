import React from "react";
import { RotateCcw, Search, Trash2} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Post from "../Post";
import { getRelativeTime } from "@/lib/relative-time";
import ReasonDeleteDialog from "./ReasonDeleteDialog";
import { deleteContent, fetchPosts, dismiss } from "@/config/firebase";
import { Badge } from "../ui/badge";
import { Context } from "@/util/authContext";

export default function AdminPosts(){

  const { user } = React.useContext(Context)
  const [posts, setPosts] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("All")
  const [expanded, setExpanded] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  React.useEffect(() =>{
      const fetchPostsF = async () =>{
        const fetchedPosts = await fetchPosts("general", user);
        setPosts(fetchedPosts)
        console.log("Fetched reports: ", fetchedPosts)
      }
      fetchPostsF();
    }, [posts.length]); //fetch all posts, can be optimsied later if needed

  const filteredPosts = posts.filter((post) =>{
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase())
    if (filter === "All") return matchesSearch;
    if (filter === "Active") return matchesSearch && post.status === "active";
    if (filter === "Deleted") return matchesSearch && post.status === "deleted";
    if (filter === "Reported") return matchesSearch && post.status === "reported";
    return matchesSearch;
  })

   const handleDeletePost = async (reason) => {
    await deleteContent(deleteDialogOpen.id, reason, "posts")
    setPosts((prev) => prev.filter((post) => post.id !== deleteDialogOpen.id))
  };

  const handleRestore = async (id) => {
    await dismiss(id, "posts");
    setPosts((prev) => prev.filter((post) => post.id !== id))
    console.log("Restore post with id: ", id)
  };


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
                    <div className="truncate font-medium">{post.title}</div>
                      {post.deletionReason && <div className="text-xs text-destructive mt-0.5">Reason: {post.deletionReason}</div>}
                  </TableCell>


                  <TableCell className="max-w-sm">
                     <p className="text-sm text-card-foreground leading-relaxed w-full whitespace-pre-wrap break-words">
                      {!expanded && post.content.length > 30 ? post.content.slice(0,30) + "..." : post.content}
                      {post.content.length > 30 && (
                        <button
                          onClick={() => setExpanded((prev) => !prev)}
                          className="ml-1 text-sm font-medium text-primary hover:underline"
                        >
                          {expanded ? "Show less" : "Read more"}
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
                          <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(post)}>
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
        descrption = "Are you sure you want to delete this content? This action cannot be undone."
        confirmText ="Delete"
        onConfirm={handleDeletePost}
      />

    </div>
  )
} 