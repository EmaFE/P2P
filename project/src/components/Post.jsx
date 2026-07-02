import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, MoreHorizontal, Bookmark, Flag, Share2, ChevronUp, Plus, ChevronDown } from "lucide-react";
import { getRelativeTime } from "../lib/relative-time";
import { toggleLikePost, reportPost, fetchComments, db, isLikedByUser, handleBookmarkPost, createPost, createComment, isBookmarkedByUser, getUserById } from "../config/firebase";
import CommentThread from "./Comment";
import ReplyWindow from "./ReplyWindow";
import { collection, getDocs, query, where, onSnapshot, doc } from "firebase/firestore";
import { useAuth } from "@/util/authContext";
import { toast } from "sonner";

const MAX_CONTENT_LENGTH = 50;
const MAX_TITLE_LENGTH = 35;
const MAX_VISIBLE_TAGS = 3;
const TAG_EXPAND_THRESHOLD = 4;

export function buildCommentTree(comments, rootId) {
  const map = {};
  const roots = [];

  //map of replies
  comments.forEach(comment => {
    map[comment.id] = { ...comment, _replies: [] };
  });

  //link children to parent posrts
  comments.forEach(comment => {
    if (comment.parenttId !== rootId && map[comment.parentId]) {
      map[comment.parentId]?._replies.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
}

export default function Post({ id, title, content, username, createdAt, likes, commentsCount, tags, category, onUserClick, status }) {
  //console.log("commentsCount: ", commentsCount)
  const { user } = useAuth();
  const [userDB, setUserDB] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes ?? 0);
  const [commentsCountS, setCommentsCountS] = useState(commentsCount ?? 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const [open, setOpen] = useState(false)

  const needsTruncation = content.length > MAX_CONTENT_LENGTH;

  const titleNeedsTrunc = title.length > MAX_TITLE_LENGTH;

  const displayContent = !expanded && needsTruncation ? content.slice(0, MAX_CONTENT_LENGTH) + "…" : content;

  const displayTitle = !expandedTitle && titleNeedsTrunc ? title.slice(0, MAX_TITLE_LENGTH) + "…" : title;

  const needsTagExpand = tags?.length > TAG_EXPAND_THRESHOLD ? true : false;
  
  const visibleTags = tagsExpanded ? tags : tags?.slice(0, MAX_VISIBLE_TAGS);
  
  const commentTree = commentsData ? buildCommentTree(commentsData, id) : null;
  //console.log(JSON.stringify(commentTree, null, 2));


  const handleLike = async () => {
    //console.log("likeCount before update: " + likeCount)
    if (userDB.status !== "active") {
      toast.error("Your account is currently suspended. You cannot like posts/comments at this time.")
      return;
    }
    const prevLiked = liked;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    try {
      await toggleLikePost(id, newLiked, user.uid);
    } catch (error) {
      setLiked(prevLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
    }
  };

  React.useEffect( () =>{
    if (!id || !user?.uid) return;
    const check = async () =>{
      const resultB = await isBookmarkedByUser(id, user.uid, "post");
      setBookmarked(resultB);
    }
    check();
  }, [id, user?.uid])


  React.useEffect( () => {
    if (!id || !user?.uid) return;    
    const q = query(
      collection(db, "likes"),
      where("postId", "==", id),
      where("userId", "==", user.uid)
    );
    //get real time data from likes db for heart to be filled in
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLiked(!snapshot.empty);
    });
    return () => unsubscribe();

  }, [id, user?.uid]); //runs user.uid changes


  React.useEffect( () =>{
    if (!user) return;
    const fetchUser = async () =>{
      const userdb = await getUserById(user.uid);
    setUserDB(userdb);
    }
    fetchUser()
  }, [user.uid]);

  
  const toggleBookmark = async () => {
    if (userDB.status !== "active") {
      toast.error("Your account is currently suspended. You cannot bookmark posts/comments at this time.")
      return;
    }
    setBookmarked(prev => !prev);
    if (!id) return;

    await handleBookmarkPost(id, !bookmarked, user.uid);
  };


  const handleReplyToPost = async () => {
    if (userDB.status !== "active") {
      toast.error("Your account is currently suspended. You cannot reply to posts/comments at this time.")
      return;
    }
    const postComment = {
      username,
      content: title + (content ? "\n" + content : ""),
      createdAt,
      status,
    }
    setReplyTarget(postComment);
  };

  //handle replies to post, NOT comments 
  const handlePostReplySubmit = async (text) => {
    if (userDB.status !== "active") {
      toast.error("Your account is currently suspended. You cannot reply to comments at this time.")
      return;
    }

    // const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
    // const userName = userDoc.docs[0]?.data()?.username;
    // const uid = userDoc.docs[0]?.data()?.uid;
    try {
      await createComment({ parentId: id, username: userDB.username, uid: userDB.uid, content: text, repliedTo: username, postId: id });
      //refresh comments
      setCommentsCountS(prev => prev + 1);
      const data = await fetchComments(id);
      setCommentsData(data);
    } catch (error) {
      console.error("Error posting reply:", error);
    }

  };

  const handleCommentsToggle = async () => {
    //if comments are already opened, just close them; otherwise open and fetch comments
    if(commentsOpen){
      setCommentsOpen(false);
      return;
    } 
    setCommentsOpen(true);
    setCommentsLoading(true);
    try{
      const data = await fetchComments(id)
      if(data.length > 0) setCommentsData(data)
    } catch(error){
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }

  const handleReport = async () => {
    if (userDB.status !== "active") {
      toast.error("Your account is currently suspended. You cannot make reports at this time.")
      return;
    }
    reportPost(id);
  };

  const handlePostfromReflection = async () => {
    await createPost({ title: title, content:content, username: username, uid: user.uid, tags: tags, activeCategory: "general", communityName: "anxiety" })
  }
 
  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="pb-2 w-full">
        <div className="flex min-w-0 overflow-hidden items-start justify-between gap-2">
          {/* <h3 className="text-lg font-semibold text-card-foreground"> */}
            {
              status !== "deleted" ? (
                <h3 className="text-lg font-semibold min-w-0 text-card-foreground whitespace-pre-wrap break-words">
                  {displayTitle}
                  {titleNeedsTrunc && (
                    <button
                      onClick={() => setExpandedTitle((prev) => !prev)}
                      className="ml-1 text-sm font-medium text-primary hover:underline"
                    >
                      {expandedTitle ? "Show less" : "Read more"}
                    </button>
                  )}
                </h3>
              ) : (
                <p className=" italic mt-1 text-md font-semibold text-card-foreground break-words">
                  [ Removed ]
                </p>
              )
            }
          {/* </h3> */}
          <span className="shrink-0 text-xs text-muted-foreground">{getRelativeTime(createdAt)}</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground cursor-pointer" onClick={() => onUserClick(username)}>@{username}</span>
        </div> 
      </CardHeader>

      <CardContent className="space-y-3 w-full">
        {
          status !== "deleted" ? (
            <p className="text-sm text-card-foreground w-full whitespace-pre-wrap break-words">
              {displayContent}
              {needsTruncation && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="ml-1 text-sm font-medium text-primary hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </p>
          ) : (
            <p className=" italic mt-1 text-sm text-card-foreground break-words">
              [ Content has been removed by the user or a moderator ]
            </p>
          )
        }

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5 px-2 cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l" onClick={handleLike}>
            <Heart
              className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
            />
            <span className="text-xs text-muted-foreground">{likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5 px-2  cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l" onClick={handleCommentsToggle}>
            <MessageCircle className= "h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{commentsCountS}</span>
            {commentsOpen && <ChevronUp className="h-3 w-3 text-muted-foreground"/>}
            {!commentsOpen && <ChevronDown className="h-3 w-3 text-muted-foreground"/>}
          </Button>

         <Button variant="ghost" size="sm" className="gap-1.5 px-2 cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l" onClick={handleReplyToPost}>
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Comment</span>
          </Button>

          { category.toLowerCase() === "drafts" && (
            <Button variant="ghost" size="sm" className="gap-1.5 px-2  cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l" onClick={handlePostfromReflection}>
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Post</span>
            </Button>
          )}

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8  cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l"
              onClick={toggleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className=" cursor-pointer transition duration-300 hover:scale-105 hover:shadow-l" onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" /> Report Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {needsTagExpand && !tagsExpanded && (
              <button
                onClick={() => setTagsExpanded(true)}
                className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                +{tags.length - MAX_VISIBLE_TAGS}
              </button>
            )}
          </div>
        )}

        {commentsOpen && (
          <div className="border-t border-border pt-3 space-y-1">
            {commentsLoading && (
              <p className="text-xs text-muted-foreground">Loading comments…</p>
            )}
            {commentTree && commentTree.length === 0 && (
              <p className="text-xs text-muted-foreground">No comments yet.</p>
            )}
            {commentTree && commentTree.map((comment) => (
               <CommentThread
                 key={comment.id}
                 comment={comment}
                 replies={comment._replies || []}
                 postId={id}
                 onCommentsRefresh={async () => {
                   const data = await fetchComments(id);
                   setCommentsData(data);
                 }}
               />
             ))}
          </div>
        )}

      </CardContent>

      {replyTarget && (
        <ReplyWindow
          comment={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSubmit={handlePostReplySubmit}
        />
      )}
    </Card>
    
  );
}