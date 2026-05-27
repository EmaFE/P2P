
// import React from "react";

// export default function MyActivity () {

//   return(
//     <div>MyActivity</div>
//   )
// }

import React from "react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Heart, FileText, MessageCircle, Bookmark, ChevronDown, ChevronUp, Loader, X, Trash2 } from "lucide-react"
import { fetchPostsByUser, fetchCommentsByUser, fetchBookmarksByUser, fetchLikesByUser, fetchPostById, deleteComment, deletePost, deleteLike, deleteBookmark } from "@/config/firebase"
import { toast } from 'sonner'
import { getRelativeTime } from "@/lib/relative-time";
import Post from "../components/Post"
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

function ActivityOpt ({icon, label, data, defaultText, loading, render}){
  let Icon
  switch (icon){
    case "fileText": Icon = FileText; break; 
    case "heart": Icon = Heart; break;
    case "message": Icon = MessageCircle; break;
    case "bookmark": Icon = Bookmark; break;
    default: Icon = Heart; break;
  }
  const[open, setOpen] = useState(false)
  
  return(
    <Collapsible open={open} onOpenChange={(newVal) => setOpen(newVal)}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground hover:bg-accent/50 transition-colors">
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground"/>
            {label}
            {data && <span className="ml-1 text-xs text-muted-foreground">({data.length})</span>}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground"/>
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground"/>
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-1">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader className="h-5 w-5 animate-spin text-muted-foreground"/>
          </div>
        ) : data && data.length === 0 ? (
          <p className="py-4 text-sm text-center text-muted-foreground">
            {defaultText}
          </p>
        ) : (
          <div className="divide-y divide-solid overflow-hidden">
            {data?.map((d, index) => render(d, index))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function ActivityRow({id, postId, text1, text2, time, status, onClick, deleteText }) {

  //based on deleteText decide what to call from firebase (remove like, remove post, remove bm, remove comment) in span onClick
  const deleteFunction = () =>{
    switch (deleteText){
      case "delete post": return deletePost(id);
      case "delete comment": return deleteComment(id, postId);
      case "remove like": return deleteLike(id, postId);
      case "remove bookmark": return deleteBookmark(id);
      default: return () => {};
    }
  }

  console.log("status: ", status)

  return (
    <div onClick={onClick} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:cursor-pointer hover:bg-slate-100 rounded-xl">
      <div className="flex-1 py-[0.5px]">
        {status === "deleted" && (
          <p className="text-sm font-medium text-card-foreground line-clamp-1 mb-3">[Deleted]</p>
        )}
        {status === "active" && (
        <p className="text-sm font-medium text-card-foreground line-clamp-1 mb-3">{text1}</p>
        )}
          {text2 && status !== "deleted" && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{text2}</p>}
      </div>
      <div className="relative group flex flex-col items-end gap-1 py-[1px] px-1">
        {time && <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{time}</span>}
         <button 
          onClick={(e) => {
            e.stopPropagation();
            deleteFunction();
          }}
        >
         <Trash2 className="h-5 w-5 text-muted-foreground hover:cursor-pointer hover:text-red-400" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {deleteText}
          </span>
        </button>
      </div>
    </div>
  );
}


export default function MyActivity ({ user }) {

  //{} map => no need to manually call fetchPostById for liked / bookmarked posts
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState(null);
  const [comments, setComments] = useState(null);
  const [bookmarks, setBookmarks] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [expandedComment, setExpandedComment] = useState(null);
  const [expandedComBookmark, setExpandedComBookmark] = useState(null);

  React.useEffect(() => {
    if(user.uid === null) return;
    async function fetchP(){
      setLoadingPosts(true);
      try{
        const fetchedPosts = await fetchPostsByUser(user);
        setPosts(fetchedPosts);
      } catch(error) {
        console.log(error);
        toast.error("Could not fetch posts.");
      } finally {
        setLoadingPosts(false);
      }
    }
    async function fetchC(){
      setLoadingComments(true);
      try{
        const fetchedComments = await fetchCommentsByUser(user);
        setComments(fetchedComments);
      } catch(error) {
        console.log(error);
        toast.error("Could not fetch comments.");
      } finally {
        setLoadingComments(false);
      }
    }
    async function fetchB(){
      setLoadingBookmarks(true);
      try{
        const fetchedBookmarks = await fetchBookmarksByUser(user);
        setBookmarks(fetchedBookmarks);
        //set the actual bookmarked posts
        console.log("fet bm: ", await fetchBookmarksByUser(user))
        for (const bookmark of fetchedBookmarks) {
          console.log("bm: ", bookmark)
          console.log(bookmark.commentId ? bookmark.commentId : bookmark.postId)
          const post = await fetchPostById(bookmark.commentId ? bookmark.commentId : bookmark.postId);
          if (post) setBookmarkedPosts((prev) => ({...prev, [bookmark.commentId ? bookmark.commentId : bookmark.postId]: post}));
        }
      } catch(error) {
        console.log(error);
        toast.error("Could not fetch bookmarks.");
      } finally {
        setLoadingBookmarks(false);
      }
    }
    async function fetchL() {
      setLoadingLikes(true);
      try {
        const fetchedLikes = await fetchLikesByUser(user);
        setLikes(fetchedLikes);
        //set the actual liked posts
        for(const like of fetchedLikes){
          const post = await fetchPostById(like.postId);
          if (post) setLikedPosts((prev) => ({...prev, [like.postId]: post}));
        }
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch likes.");
      } finally{
        setLoadingLikes(false);
      }
    }
    fetchP();
    fetchC();
    fetchB();
    fetchL();
  }, [user?.uid])

//   React.useEffect(() => {
//   console.log("UPDATED BOOKMARKED:", bookmarkedPosts);
// }, [bookmarkedPosts]);
//   React.useEffect(() => {
//   console.log("UPDATED BOOKMARKS:", bookmarks);
// }, [bookmarks]);


  const renderPost = (post) => {
    console.log("rendering post with status: ", post.status)
    return (
      <ActivityRow
        key={post.id}
        id={post.id}
        text1={post.title}
        text2={post.content}
        time={getRelativeTime(post.createdAt)}
        status={post.status}
        onClick={() => setExpandedPost(post)}
        deleteText="delete post"
      />
    )
  }

  const renderComment =(comment) =>{
    if(comment){
      return(
        <ActivityRow
          key={comment.id}
          id={comment.id}
          postId={comment.postId}
          text1={comment.content}
          text2={comment.repliedTo ? `replied to @${comment.repliedTo}` : null}
          time={getRelativeTime(comment.createdAt)}
          status={comment.status}
          onClick={() => openPost(comment.postId || comment.parentId, comment)}
          deleteText="delete comment"
        />
      )
    }
  }

  const renderBookmark = (bookmark) => {
  //  const post = bookmarkedPosts[bookmark.commentId ? bookmark.commentId : bookmark.postId]
   const post = bookmarkedPosts[bookmark.postId]
    const com = bookmarkedPosts[bookmark.commentId]
    if (com){
      console.log("com",com)
      const post = getDoc(doc(db, "posts", com?.postId))
      return (
        <ActivityRow
          key={com.id}
          id={com.id}
          text1={com.title}
          text2={com.content}
          time={getRelativeTime(com.createdAt)}
          status={com.status}
          onClick={() => openPost(bookmark.postId, com)}
          deleteText="remove bookmark"
        />
      )
    } else {
      const post = bookmarkedPosts[bookmark.postId]
      return (
        <ActivityRow
          key={post.id}
          id={post.id}
          text1={ post ? post.title : ""}
          text2={post ? post.content : ""}
          time={getRelativeTime(post.createdAt)}
          status={post.status}
          onClick={() => openPost(bookmark.postId)}
          deleteText="remove bookmark"
        />
      )
    }
    
  }

  const renderLike = (like) =>{
    const post = likedPosts[like.postId]
    if(post){
      return (
        <ActivityRow
          key={post.id}
          id={like.id}
          postId={post.id}
          text1={post ? post.title : ""}
          text2={post.content}
          time={getRelativeTime(post.createdAt)}
          status={post.status}
          onClick={() => openPost(post.id)}
          deleteText="remove like"
        />
      )
    }    
  }

  const openPost = async (postId, comment = null, bookmark = null) => {
    const post = likedPosts[postId] || bookmarkedPosts[postId] || posts?.find((p) => p.id === postId);
     if (!comment && post?.status === "deleted") {
      toast.error("This content has been deleted and cannot be viewed.");  
    } else {
        setExpandedPost(post || null);
        setExpandedComment(comment || null);
        setExpandedComBookmark(bookmark || null);
        console.log("commmm", expandedComment)
        if(post){
          const p = await fetchPostById(postId)
          setExpandedPost(p);
        }
      }
  };

  if (expandedPost) {
    console.log(expandedPost)
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => { setExpandedPost(null); setExpandedComment(null); setExpandedComBookmark(null) }}>
          <X className="h-4 w-4" /> Back to My Activity
        </Button>
        {expandedComment && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            {/* <p className="text-xs font-medium text-muted-foreground mb-1">Your comment</p> */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">@{expandedComment.username}</span>
              {expandedComment.repliedTo && (
                <>
                  <span>replied to</span>
                  <span className="font-medium text-foreground">@{expandedComment.repliedTo}</span>
                </>
              )}
              <span>·</span>
              <span>{getRelativeTime(expandedComment.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-card-foreground">{expandedComment.content}</p>
          </div>
        )}
        {expandedComBookmark && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Your comment</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">@{expandedComBookmark.username}</span>
              {expandedComBookmark.repliedTo && (
                <>
                  <span>replied to</span>
                  <span className="font-medium text-foreground">@{expandedComBookmark.repliedTo}</span>
                </>
              )}
              <span>·</span>
              <span>{getRelativeTime(expandedComBookmark.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-card-foreground">{expandedComBookmark.content}</p>
          </div>
        )}
        <Post {...expandedPost}/>
      </div>
    );
  }

  return(
    <div>
      <ActivityOpt
        icon="heart"
        label="My Likes"
        data={likes}
        loading={loadingLikes}
        defaultText="You have not liked anything yet."
        render={renderLike}
      />
      <ActivityOpt
        icon="fileText"
        label="My Posts"
        data={posts}
        loading={loadingPosts}
        defaultText="You have not made any posts yet."
        render={renderPost}
      />
      <ActivityOpt
        icon="message"
        label="My Comments"
        data={comments}
        loading={loadingComments}
        defaultText="You have not made any comments yet."
        render={renderComment}
      />
      <ActivityOpt
        icon="bookmark"
        label="My Bookmarks"
        data={bookmarks}
        loading={loadingBookmarks}
        defaultText="You have not bookmarked anything yet."
        render={renderBookmark}
      />
    </div>
  )
}

