
// import React from "react";

// export default function MyActivity () {

//   return(
//     <div>MyActivity</div>
//   )
// }

import React from "react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { Button } from "../components/ui/button";
import { Heart, FileText, MessageCircle, Bookmark, ChevronDown, ChevronUp, Loader, X, Trash2 } from "lucide-react"
import { fetchPostsByUser, fetchCommentsByUser, fetchCommentById, fetchBookmarksByUser, fetchLikesByUser, fetchPostById, deleteComment, deletePost, deleteLike, deleteBookmark, deleteContent, getUserById } from "@/config/firebase"
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
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-[var(--color-six)] hover:text-white hover:font-normal transition-colors">
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 group-hover:text-white transition-colors"/>
            {label}
            {data && <span className="ml-1 text-xs text-muted-foregroud">({data.length})</span>}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 hover:text-white"/>
        ) : (
          <ChevronDown className="h-4 w-4 hover:text-white"/>
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-1">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader className="h-5 w-5 animate-spin text-muted-foreground"/>
          </div>
        ) : data && data.length === 0 ? (
          <p className="py-4 text-sm text-center text-black">
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

function ActivityRow({user, id, bookmark=null, postId=null, text1, text2, time, status, onClick, deleteText }) {

  // console.log("user from activity row: ", user)
  // console.log("postId from activity row ", postId)
  // console.log("id from activity row ", id)
  // console.log("bookmark id from activity row", bookmark)
  // console.log("delete text from actiity row ", deleteText)

  //based on deleteText decide what to call from firebase (remove like, remove post, remove bm, remove comment) in span onClick
  const deleteFunction = () =>{
    switch (deleteText){
      case "delete post": return deleteContent(id, "user deletion", "posts", "deleted", user.uid);
      case "delete comment": return deleteContent(id, "user deletion", "comments", "deleted", user.uid);
      case "remove like": return deleteLike(id, postId);
      case "remove bookmark": return deleteBookmark(bookmark);
      default: return () => {};
    }
  }
  // id, reason, collection, status, admin_id

  // console.log("status: ", status)

  return (
    <div onClick={onClick} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:cursor-pointer hover:scale-101 hover:bg-white/80 hover:shadow-l rounded-xl">
      <div className="flex-1 py-[0.5px]">
        {status === "deleted" && (
          <p className="text-sm font-medium text-card-foreground mb-3">[Deleted]</p>
        )}
        {status === "active" && (
        <p className="text-sm font-medium text-card-foreground mb-3">{text1.slice(0,15)}...</p>
        )}
          {text2 && status !== "deleted" && <p className="mt-0.5 text-xs text-muted-foreground">{text2.slice(0,15)}...</p>}
      </div>
      <div className="relative group flex flex-col items-end gap-1 py-[1px] px-1">
        {time && <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{time}</span>}
         <button 
          onClick={(e) => {
            e.stopPropagation()
            if(user.status === "active"){
              deleteFunction();
            } else if (user.status === "suspended"){
              // console.log("errroorororor")
              toast.error("Your account has been suspended. You cannot delete any content at this time")
            }
            
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
  // console.log("user from my activity: ", user)

  //{} map => no need to manually call fetchPostById for liked / bookmarked posts
  const [userDB, setUserDB] = useState(null);
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
    if(!user) return;
    async function fetchUser() {
      const userdb = await getUserById(user.uid);
      setUserDB(userdb);
    }
    async function fetchP(){
      setLoadingPosts(true);
      try{
        const fetchedPosts = await fetchPostsByUser(user);
        setPosts(fetchedPosts);
      } catch(error) {
        // console.log(error);
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
        // console.log(error);
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
        for (const bookmark of fetchedBookmarks) {
          if (bookmark.type === "comment"){
            const com = await fetchCommentById(bookmark.commentId)
            if (com) setBookmarkedPosts((prev) => ({...prev, [bookmark.commentId]: com}));
          } else if (bookmark.type === "post"){
            const post = await fetchPostById(bookmark.postId)
             if (post) setBookmarkedPosts((prev) => ({...prev, [bookmark.postId]: post}));
          }
        }
      } catch(error) {
        // console.log(error);
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
          if (like.type === "post"){
             const post = await fetchPostById(like.postId);
             if (post) setLikedPosts((prev) => ({...prev, [like.postId]: post}))
          } else if (like.type === "comment") {
            const comment = await fetchCommentById(like.postId);
              if (comment) setLikedPosts((prev) => ({...prev, [like.postId]: comment}))
          }
        }
      } catch (error) {
        // console.log(error);
        toast.error("Could not fetch likes.");
      } finally{
        setLoadingLikes(false);
      }
    }
    fetchUser();
    fetchP();
    fetchC();
    fetchB();
    fetchL();
    
  }, [user?.uid])

  const renderPost = (post) => {
    return (
      <ActivityRow
        key={post.id}
        user={userDB}
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
          user={userDB}
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
  let com = null
  let post = null
  if (bookmark.type === "comment"){
    com = bookmarkedPosts[bookmark.commentId]
    // console.log("com in render bm: ", com)
  } else if (bookmark.type === "post"){
    post = bookmarkedPosts[bookmark.postId]
    // console.log("post in render bm: ", post)
  }
    if (com !== null){
      return (
        <ActivityRow
          key={com.id}
          user={userDB}
          id={com.id}
          bookmark={bookmark.id}
          postId={com.postId}
          text1={com.content}
          text2={com.repliedTo ? `replied to @${com.repliedTo}` : null}
          time={getRelativeTime(com.createdAt)}
          status={com.status}
          onClick={() => openPost(bookmark.postId, com)}
          deleteText="remove bookmark"
        />
      )
    } else if (post !== null){
      return (
        <ActivityRow
          key={post.id}
          user={userDB}
          id={post.id}
          postId={post.id}
          bookmark={bookmark.id}
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

    let com = null
    let post = null
    if (like.type === "comment"){
      com = likedPosts[like.postId]
    } else if (like.type === "post"){
      post = likedPosts[like.postId]
    }
      if (com !== null){
        return (
          <ActivityRow
            key={com.id}
            user={userDB}
            id={like.id}
            postId={com.id}
            text1={com.content}
            text2={com.repliedTo ? `replied to @${com.repliedTo}` : null}
            time={getRelativeTime(com.createdAt)}
            status={com.status}
            onClick={() => openPost(com.postId || com.parentId, com)}
            deleteText="remove like"
          />
        )
      } else if (post !== null){
        return (
          <ActivityRow
            key={post.id}
            user={userDB}
            id={like.id}
            postId={post.id}
            text1={ post ? post.title : ""}
            text2={post ? post.content : ""}
            time={getRelativeTime(post.createdAt)}
            status={post.status}
            onClick={() => setExpandedPost(post)}
            deleteText="remove like"
          />
        )
      }



    // const post = likedPosts[like.postId]
    // console.log("post from render like ", post)
    // if(post){
    //   return (
    //     <ActivityRow
    //       key={post.id}
    //       user={userDB}
    //       id={like.id}
    //       postId={post.id}
    //       text1={post ? post.title : ""}
    //       text2={post.content}
    //       time={getRelativeTime(post.createdAt)}
    //       status={post.status}
    //       onClick={() => openPost(post.id)}
    //       deleteText="remove like"
    //     />
    //   )
    // }    
  }

  const openPost = async (postId, comment = null, bookmark = null) => {
    const post = likedPosts[postId] || bookmarkedPosts[postId] || posts?.find((p) => p.id === postId);
      setExpandedPost(post || null);
      setExpandedComment(comment || null);
      setExpandedComBookmark(bookmark || null);
      // console.log("commmm", expandedComment)
      if(post){
        const p = await fetchPostById(postId)
        setExpandedPost(p);
      }
  };

  if (expandedPost) {
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
            <p className="mt-1 text-sm text-card-foreground">{expandedComment?.status === "active" ? expandedComment.content : "[ Deleted ]"}</p>
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
            <p className="mt-1 text-sm text-card-foreground">{ expandedComBookmark?.status === "active" ? expandedComBookmark.content : "[ Deleted ]"}</p>
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

