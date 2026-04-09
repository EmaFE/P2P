import React from "react";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db, toggleLikeComment, handleBookmarkComment, isLikedByUser, createComment, isBookmarkedByUser } from "@/config/firebase";
import { useAuth } from "@/util/authContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ChevronDown, ChevronUp, Bookmark, MoreHorizontal, Flag, Share2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { getRelativeTime } from "@/lib/relative-time";
import ReplyWindow from "./ReplyWindow";

const COLLAPSED_REPLY_LIMIT = 4;
const MAX_CONTENT_LENGTH = 50;


function CommentItem({ comment, onReplyClick }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes ?? 0);
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleReport = () => {
    // Implement report functionality here
    console.log("Reported comment ID:", comment.id);
  };

  const needsTruncation = comment.content.length > MAX_CONTENT_LENGTH;
  const displayContent = !expanded && needsTruncation ? comment.content.slice(0, MAX_CONTENT_LENGTH) + "…" : comment.content;

  const handleLike = async () => {
    const prevLiked = liked;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    try {
     // console.log("comment id from Comment.jsx: " + comment.id)
      await toggleLikeComment(comment.id, newLiked, user.uid);
    } catch (error) {
      setLiked(prevLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
     // console.log("Failed to update like status");
     // console.log(error);
    }
  };

  const { user } = useAuth();
  React.useEffect( () =>{
    if (!comment.id || !user?.uid) return;
    const check = async () =>{
      const resultB = await isBookmarkedByUser(comment.id, user.uid);
      setBookmarked(resultB);
    }
    check();
  }, [comment.id, user?.uid])

  // React.useEffect(() => {
  //   const checkLiked = async () => {
  //     if (!comment.id || !user?.uid) return;
        
  //     const result = await isLikedByUser(comment.id, user.uid);
  //     setLiked(result);
  //   checkLiked();
  // }, [comment.id, user?.uid]); //runs evrythime comment.id or user.uid changes

    React.useEffect( () => {
      if (!comment.id || !user?.uid) return;    
      const q = query(
        collection(db, "likes"),
        where("postId", "==", comment.id),
        where("userId", "==", user.uid)
      );
      //get real time data from likes db for heart to be filled in
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setLiked(!snapshot.empty);
      });
      return () => unsubscribe();
  
    }, [comment.id, user?.uid]); //runs user.uid changes

    
  //   React.useEffect(() => {
  //     if(!comment.id || !user?.uid) return
  //     const handleBookmark = async () => {
  //       // const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
  //       // const userId = userDoc.docs[0]?.data()?.uid;
  //       // handleBookmarkComment(comment.id, bookmarked, userId);

  //       const resultBookmark = await isBookmarkedByUser(comment.id, user.uid);
  //       setBookmarked(resultBookmark)
  //     };
  //   handleBookmark();
  //   const q = query(
  //         collection(db, "likes"),
  //         where("postId", "==", comment.id),
  //         where("userId", "==", user.uid)
  //       );
    
  //       const unsubscribe = onSnapshot(q, (snapshot) => {
  //         setLiked(!snapshot.empty);
  //       });
  //       return () => unsubscribe();
  // }, [comment.id, user?.uid]); //runs every time bookmarked changes

  const toggleBookmark = async () => {
    const prevB = bookmarked
    const newB = !bookmarked
    setBookmarked(newB);

    if (!comment.id) return;
    const userDoc = await getDocs(
      query(collection(db, "users"), where("uid", "==", user.uid))
    );
    const userId = userDoc.docs[0]?.data()?.uid;
    await handleBookmarkComment(comment.id, !bookmarked, userId);
  };

  return (
    <div className="rounded-lg bg-card/50 px-3 py-2">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
            <span className="font-medium text-foreground">@{comment.username}</span>
            {comment.repliedTo && (
              <>
                <span>replied to</span>
                <span className="font-medium text-foreground">@{comment.repliedTo}</span>
              </>
            )}
            <span>·</span>
            <span>{getRelativeTime(comment.createdAt)}</span>
          </div>

           <p className=" mt-1 text-sm text-card-foreground leading-relaxed break-words">
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

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-6 gap-1 px-1.5" onClick={handleLike}>
              <Heart
                className={`h-3 w-3 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
              />
              <span className="text-[10px] text-muted-foreground">{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-6 gap-1 px-1.5" onClick={onReplyClick}>
              <MessageCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Reply</span>
            </Button>

            <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" /> Report Post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    //toast({ title: "Link copied!" });
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentThread({ comment, rootPostId, replies, onCommentsRefresh }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const hasReplies = replies.length > 0;
  const needsCollapse = replies.length > COLLAPSED_REPLY_LIMIT;

  //replies to comments, not posts
  const handleReplySubmit = async (text) => {

    if (!user) return;
    const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
    const username = userDoc.docs[0]?.data()?.username;
    const uid = userDoc.docs[0]?.data()?.uid;
    console.log(uid)

    await createComment({ postId: comment.id, uid: uid, username: username, content: text, repliedTo: comment.username, rootPostId: rootPostId });

    await onCommentsRefresh();
    setReplyTarget(null);
  };

  return (
    <div className="py-1.5">
      <CommentItem comment={comment} onReplyClick={() => setReplyTarget(comment)} />

      {hasReplies && (
        <div className="mt-1">
          {needsCollapse && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="ml-7 flex items-center gap-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{comment.commentsCount} replies</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}

          {needsCollapse && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="ml-7 flex items-center gap-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Hide replies</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          )}

          {(!needsCollapse || expanded) && (
            <div className="ml-6 pl-4 border-l border-border/60 space-y-1">
              {replies.map((comment) => (
               <CommentThread
                 key={comment.id}
                 comment={comment}
                 replies={comment._replies || []}
                 rootPostId={rootPostId}
                 onCommentsRefresh={onCommentsRefresh}
               />
             ))}
            </div>
          )}
        </div>
      )}

      {replyTarget && (
        <ReplyWindow
          comment={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSubmit={handleReplySubmit}
        />
      )}
    </div>
  );
}
