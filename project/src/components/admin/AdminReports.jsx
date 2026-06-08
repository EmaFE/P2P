import { fetchAllComments, fetchPosts } from "@/config/firebase";
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare } from "lucide-react";
import { Context } from "@/util/authContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2 } from "lucide-react";
import { getRelativeTime } from "@/lib/relative-time";
import { dismiss, deleteContent } from "@/config/firebase";
import ReasonDeleteDialog from "./ReasonDeleteDialog";


export default function AdminReports(){

  const { user } = React.useContext(Context)
  const [reports, setReports] = React.useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0)


  React.useEffect(() =>{
    const fetchReports = async () =>{
      const fetchedPosts = await fetchPosts("general", user);
      const fetchedPosts2 = await fetchPosts("advice", user);
      const fetchedComments = await fetchAllComments();
      const reportedPosts = fetchedPosts.filter(post => post.status === "reported");
      const reportedPosts2 = fetchedPosts2.filter(post => post.status === "reported");
      const reportedComments = fetchedComments.filter(comment => comment.status === "reported");
      setReports([...reportedPosts, ...reportedPosts2, ...reportedComments])
    }
    fetchReports();
  }, [refresh]); //fetch all posts and filter for reported ones since theres no separate collection for reports, can be optimsied later if needed

  const handleDismiss = async (reportId, collection) =>{
    // console.log("report id: ", reportId, " collection: ", collection, " user id: ", user.uid)
    await dismiss(reportId, collection, user.uid)
    setReports((prev) => prev.filter((report) => report.id !== reportId))
    setRefresh((prev) => prev + 1)
    if (refresh === 10){
      setRefresh(0)
    }
  }

  const handleDeleteReport = async (reason) => {
    const collection = deleteDialogOpen.tags ? "posts" :  "comments"
    await deleteContent(deleteDialogOpen.id, reason, collection, "deleted", user.uid)
    setReports((prev) => prev.filter((report) => report.id !== deleteDialogOpen.id))
    setRefresh((prev) => prev + 1)
    if (refresh === 10){
      setRefresh(0)
    }
  }


  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {reports.length} pending report{reports.length !== 1 && "s"}.
        </p>
      </div>

      <div>
        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.map((report) => {
              return (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {report?.tags ? <FileText/> : <MessageSquare/>}
                      {report?.tags ?"post" : "Comment"}
                    </Badge>
                  </TableCell>

                  <TableCell className="max-w-sm">
                    <p className="text-sm text-card-foreground leading-relaxed w-full whitespace-pre-wrap break-words">
                      {!expanded && report.content.length > 30 ? report.content.slice(0,30) + "..." : report.content}
                      {report.content.length > 30 && (
                        <button
                          onClick={() => setExpanded((prev) => !prev)}
                          className="ml-1 text-sm font-medium text-primary hover:underline"
                        >
                          {expanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>
                  </TableCell>

                  <TableCell>
                      <p className="text-sm text-card-foreground leading-relaxed w-full whitespace-pre-wrap break-words">
                        @{report.username}
                      </p>
                  </TableCell>

                  <TableCell>
                      <p className="text-sm text-card-foreground leading-relaxed w-full whitespace-pre-wrap break-words">
                        {getRelativeTime(report.createdAt)}
                      </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm text-card-foreground leading-relaxed w-full whitespace-pre-wrap break-words">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleDismiss(report.id, report.tags ? "posts" : "comments")}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Dismiss
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(report)}>
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </p>
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
        description = "Are you sure you want to delete this content? This action cannot be undone."
        confirmText ="Delete"
        onConfirm={handleDeleteReport}
      />

    </div>
  )
} 