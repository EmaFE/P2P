
// import React from "react";

// export default function MyActivity () {

//   return(
//     <div>MyActivity</div>
//   )
// }

import React from "react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Heart, FileText, MessageCircle, Bookmark, ChevronDown, ChevronUp, Loader } from "lucide-react"
import { fetchPostsByUser, fetchCommentsByUser, fetchBookmarksByUser, fetchLikesByUser, fetchPostById } from "@/config/firebase"
import { toast } from 'sonner'
import { getRelativeTime } from "@/lib/relative-time";

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

function ActivityRow({ text1, text2, time }) {
  console.log("text1: ", text1)
  console.log("text2: ", text2)
  return (
    <div className="flex w-full items-start gap-3 px-4 py-3 text-left">
      <div className="flex-1 py-[0.5px]">
        <p className="text-sm font-medium text-card-foreground line-clamp-1 mb-3">{text1}</p>
        {text2 && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{text2}</p>}
      </div>
      {time && <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{time}</span>}
    </div>
  );
}


export default function MyActivity ({ user }) {

  //{} => no need to call fetchPostById for liked / bookmarked posts
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
        for (const bookmark of fetchedBookmarks) {
          const post = await fetchPostById(bookmark.postId);
          if (post) setBookmarkedPosts((prev) => ({...prev, [bookmark.postId]: post}));
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
          console.log("liked post: ", post)
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
    return (
      <ActivityRow
        key={post.id}
        text1={post.title}
        text2={post.content}
        time={getRelativeTime(post.createdAt)}
      />
    )
  }

  const renderComment =(comment) =>{
    return(
      <ActivityRow
        key={comment.id}
        text1={comment.content}
        text2={comment.repliedTo ? `replied to @${comment.repliedTo}` : null}
        time={getRelativeTime(comment.createdAt)}
      />
    )
  }

  const renderBookmark = (bookmark) => {
    const post = bookmarkedPosts[bookmark.postId]
    return (
      <ActivityRow
        key={post.id}
        text1={post.title ? post.title : ""}
        text2={post.content}
        time={getRelativeTime(post.createdAt)}
      />
    )
  }

  const renderLike = (like) =>{
    const post = likedPosts[like.postId]
    return (
      <ActivityRow
        key={post.id}
        text1={post.title ? post.title : ""}
        text2={post.content}
        time={getRelativeTime(post.createdAt)}
      />
    )
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


