import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getRelativeTime } from "@/lib/relative-time";
import { fetchLogs } from "@/config/firebase";
import { Context } from "@/util/authContext";
import { cn } from "@/lib/utils";

export default function AdminAudit(){

  const { user } = React.useContext(Context)
  const [logs, setLogs] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("All")
  const [expanded, setExpanded] =  React.useState({})

   React.useEffect(() =>{
    const fetchLogsF = async () =>{
      const fetchedLogs = await fetchLogs()
      setLogs(fetchedLogs)
    }
    fetchLogsF()
  }, [logs.length]) //fetch all logs

  const filteredLogs= logs.filter((log) =>{
    const matchesSearch = log.admin_username.toLowerCase().includes(search.toLowerCase()) || log.admin_id.toLowerCase().includes(search.toLowerCase()) || log.impacted_user_id.toLowerCase().includes(search.toLowerCase()) || log.impacted_username.toLowerCase().includes(search.toLowerCase()) || getRelativeTime(log.createdAt).toLowerCase().includes(search.toLowerCase()) || log.og_content_id?.includes(search)
    if (filter === "All") return matchesSearch
    if (filter === "Deleted Post") return matchesSearch && log.action === "deleted_post"
    if (filter === "Deleted Comment") return matchesSearch && log.action === "deleted_comment"
    if (filter === "Deleted Report") return matchesSearch && log.action === "deleted_report"
    if (filter === "Restored Post") return matchesSearch && log.action === "restored_post"
    if (filter === "Restored Comment") return matchesSearch && log.action === "restored_comment"
    if (filter === "Dismissed Report") return matchesSearch && log.action === "dismissed_report"
    if (filter === "Banned User") return matchesSearch && log.action === "banned_user"
    if (filter === "Suspended User") return matchesSearch && log.action === "suspended_user"
    return matchesSearch
  })

  const filters = ["All", "Deleted Post", "Deleted Comment", "Deleted Report", "Restored Post", "Restored Comment", "Dismissed Report", "Banned User", "Suspended User"]

 return (
    <div className="space-y-4">
      <div className="flex items-center space-between">
        <div className="w-1/2 relative mr-5">
          <Search className="absolute left-3 top-1/4 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <div>
          {filters.map((f) =>{
            return (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick ={() => setFilter(f)}>
                {f}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableHead>Admin Username</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Content ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Impacted User</TableHead>
          </TableHeader>

          <TableBody>
            {filteredLogs.map((log) =>{
              return(
                <TableRow key={log.id} className={(log.action === "deleted_post" || log.action === "deleted_comment" || log.action === "deleted_report") ? "bg-red-50" : ""}>
                  <TableCell>@{log.admin_username}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="max-w-sm">
                    <p className="text-card-foreground w-full whitespace-pre-wrap break-words">
                      {!expanded[log.id] && log.reason?.length > 10 ? log.reason.slice(0,10) + "..." : log.reason ? log.reason : " - "}
                        {log.reason?.length > 10 && (
                          <button
                            onClick={() => setExpanded((prev) => ({ ...prev, [log.id] : !prev[log.id] }))}
                            className={cn("ml-1 font-medium text-primary hover:underline", expanded[log.id] ? "text-[var(--color-six)]" : "text-pink-800")}
                          >
                            {expanded[log.id] ? "Show less" : "Read more"}
                          </button>
                        )}
                    </p>
                  </TableCell>
                   <TableCell>{log.og_content_id ? log.og_content_id : "-"}</TableCell>
                  <TableCell>{getRelativeTime(log.createdAt)}</TableCell>
                  <TableCell>{log.impacted_username}</TableCell>
             </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 