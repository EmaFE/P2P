import React from "react";
import { RotateCcw, Search, Trash2} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getRelativeTime } from "@/lib/relative-time";
import ReasonDeleteDialog from "./ReasonDeleteDialog";
import { deleteContent, fetchAllComments, dismiss } from "@/config/firebase";
import { Badge } from "../ui/badge";
import { Context } from "@/util/authContext";
import { cn } from "@/lib/utils";

export default function AdminComments(){

  const { user } = React.useContext(Context)
  const [comments, setComments] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("All")
  const [expanded, setExpanded] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [refresh, setRefresh] = React.useState(0)

  React.useEffect(() =>{
      const fetchCommentsF = async () =>{
        const fetchedComments = await fetchAllComments()
        setComments(fetchedComments)
      }
      fetchCommentsF()
    }, [refresh]) //fetch all comments

  const filteredComments = comments.filter((comment) =>{
    const matchesSearch = comment.content.toLowerCase().includes(search.toLowerCase()) || comment.username.toLowerCase().includes(search.toLowerCase()) || getRelativeTime(comment.createdAt).toLowerCase().includes(search.toLowerCase()) 
    if (filter === "All") return matchesSearch
    if (filter === "Active") return matchesSearch && comment.status === "active"
    if (filter === "Deleted") return matchesSearch && comment.status === "deleted"
    if (filter === "Reported") return matchesSearch && comment.status === "reported"
    return matchesSearch
  })

   const handleDeleteComment = async (reason) => {
    await deleteContent(deleteDialogOpen.comment.id, reason, "comments", "deleted", user.uid)
    setComments((prev) => prev.filter((comment) => comment.id !== deleteDialogOpen.id))
    setRefresh((prev) => prev + 1)
    if (refresh === 10){
      setRefresh(0)
    }
  }

  const handleRestore = async (id) => {
    await dismiss(id, "comments", user.uid)
    setComments((prev) => prev.filter((comment) => comment.id !== id))
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
            <TableHead>Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableHeader>

          <TableBody>
            {filteredComments.map((comment) =>{
              return(
                <TableRow key={comment.id} className={comment.status === "reported" ? "bg-orange-50" : comment.status === "deleted" ? "bg-red-50 opacity-60" : ""}>

                  <TableCell className="max-w-sm">
                     <p className="text-sm text-card-foreground w-full whitespace-pre-wrap break-words">
                      {!expanded[comment.id] && comment.content.length > 30 ? comment.content.slice(0,30) + "..." : comment.content}
                      {comment.content.length > 30 && (
                        <button
                          onClick={() => setExpanded((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                          className={cn("ml-1 text-sm font-medium text-primary hover:underline", expanded[comment.id] ? "text-[var(--color-six)]" : "text-pink-800")}
                        >
                          {expanded[comment.id] ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>
                    <p className="text-sm text-card-foreground w-full whitespace-pre-wrap break-words">
                      {!expanded[comment.id] && comment.deletionReason?.length > 10 ? `Reason: ${comment.deletionReason.slice(0,10)}` + "..." : comment.deletionReason !== "" ? `Reason: ${comment.deletionReason}` : ""}
                        {comment.deletionReason?.length > 10 && (
                          <button
                            onClick={() => setExpanded((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                            className={cn("ml-1 text-sm font-medium text-primary hover:underline", expanded[comment.id] ? "text-[var(--color-six)]" : "text-pink-800")}
                          >
                            {expanded[comment.id] ? "Show less" : "Read more"}
                          </button>
                        )}
                    </p>
                  </TableCell>

                  <TableCell>@{comment.username}</TableCell>

                  <TableCell className="text-sm">{getRelativeTime(comment.createdAt)}</TableCell>


                  <TableCell>
                    <div className="flex gap-1">
                      {comment.status === "deleted" && <Badge variant="destructive">Deleted</Badge>}
                      {comment.status === "reported" && <Badge variant="secondary">Reported</Badge>}
                      {comment.status === "active" && <Badge className="outline">Active</Badge>}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {
                      comment.status === "deleted" ? (
                        <Button className="hover:cursor-pointer" variant="outline" size="sm" onClick={() => handleRestore(comment.id)}>
                          <RotateCcw className="h-3 w-3 mr-1"/> Restore
                        </Button>) : (
                          <Button className="hover:cursor-pointer" variant="outline" size="sm" onClick={() => setDeleteDialogOpen({comment : comment})}>
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
        description = {deleteDialogOpen.comment ? `Delete: ${deleteDialogOpen.comment.content.slice(0, 20)}` : ""}
        confirmText ="Delete"
        onConfirm={handleDeleteComment}
      />

    </div>
  )
} 