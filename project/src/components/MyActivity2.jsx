import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, FileText, MessageCircle, Bookmark, ChevronDown, Loader2 } from "lucide-react";
import { getRelativeTime } from "@/lib/relative-time";
import {
  fetchUserPosts,
  fetchUserComments,
  fetchUserLikes,
  fetchUserBookmarks,
  fetchPostById,
  fetchUserByUid,
} from "@/config/firebase";
import Post from "@/components/Post";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


function ActivitySection({ icon: Icon, label, items, loading, renderItem, defaultText }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground hover:bg-accent/50 transition-colors">
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {label}
          {items && <span className="ml-1 text-xs text-muted-foreground">({items.length})</span>}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items && items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{defaultText}</p>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
            {items?.map((item, i) => renderItem(item, i))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ActivityRow({ primary, secondary, meta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-card-foreground line-clamp-1">{primary}</p>
        {secondary && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{secondary}</p>}
      </div>
      {meta && <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{meta}</span>}
    </button>
  );
}

/* ── Main component ── */

export default function MyActivity({ user, useMockData = false }) {
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [likes, setLikes] = useState(null);
  const [bookmarks, setBookmarks] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [dialogPost, setDialogPost] = useState(null);
  const [dialogComment, setDialogComment] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // useEffect(() => {
  //   if (useMockData) {
  //     setUserProfile({ userId: 1 });
  //     return;
  //   }
  //   fetchUserByUid(user.uid).then(setUserProfile);
  // }, [user.uid, useMockData]);

  // const userId = userProfile?.userId ?? null;

  useEffect(() => {
    if (userId === null) return;

    // if (useMockData) {
    //   setPosts(MOCK_POSTS);
    //   setComments(MOCK_COMMENTS);
    //   setLikes(MOCK_LIKES);
    //   setBookmarks(MOCK_BOOKMARKS);
    //   setLikedPosts(MOCK_POSTS_MAP);
    //   setBookmarkedPosts(MOCK_POSTS_MAP);
    //   return;
    // }

    // setLoadingPosts(true);
    
    // fetchUserPosts(userId).then(setPosts).finally(() => setLoadingPosts(false));
    setLoadingComments(true);
    fetchUserComments(userId).then(setComments).finally(() => setLoadingComments(false));

    setLoadingLikes(true);
    fetchUserLikes(userId).then((data) => {
      setLikes(data);
      data.forEach(async (like) => {
        const post = await fetchPostById(String(like.postId));
        if (post) setLikedPosts((prev) => ({ ...prev, [like.postId]: post }));
      });
    }).finally(() => setLoadingLikes(false));

    setLoadingBookmarks(true);
    fetchUserBookmarks(userId).then((data) => {
      setBookmarks(data);
      data.forEach(async (bm) => {
        const post = await fetchPostById(String(bm.postId));
        if (post) setBookmarkedPosts((prev) => ({ ...prev, [bm.postId]: post }));
      });
    }).finally(() => setLoadingBookmarks(false));
  }, [userId, useMockData]);


  // const openPostDialog = async (postId) => {
  //   if (useMockData) {
  //     setDialogPost(MOCK_POSTS_MAP[postId] || null);
  //     return;
  //   }
  //   setDialogLoading(true);
  //   try {
  //     const post = await fetchPostById(String(postId));
  //     setDialogPost(post);
  //   } catch {
  //     setDialogPost(null);
  //   } finally {
  //     setDialogLoading(false);
  //   }
  // };

  return (
    <div className="space-y-3">
      <ActivitySection
        icon={Heart}
        label="My Likes"
        items={likes}
        loading={loadingLikes}
        defaultText="No likes yet."
        renderItem={(like) => {
          const post = likedPosts[like.postId];
          return (
            <ActivityRow
              key={like.id}
              primary={post ? post.title : `Post #${like.postId}`}
              secondary={post?.content}
              meta={getRelativeTime(like.createdAt)}
              onClick={() => openPostDialog(like.postId)}
            />
          );
        }}
      />

      <ActivitySection
        icon={FileText}
        label="My Posts"
        items={posts}
        loading={loadingPosts}
        defaultText="No posts yet."
        renderItem={(post) => (
          <ActivityRow
            key={post.id}
            primary={post.title}
            secondary={post.content}
            meta={getRelativeTime(post.createdAt)}
            onClick={() => setDialogPost(post)}
          />
        )}
      />

      <ActivitySection
        icon={MessageCircle}
        label="My Comments"
        items={comments}
        loading={loadingComments}
        defaultText="No comments yet."
        renderItem={(comment) => (
          <ActivityRow
            key={comment.id}
            primary={comment.content}
            secondary={comment.repliedTo ? `Replied to @${comment.repliedTo}` : null}
            meta={getRelativeTime(comment.createdAt)}
            onClick={() => {
              setDialogComment(comment);
              openPostDialog(comment.rootPostId || comment.postId);
            }}
          />
        )}
      />

      <ActivitySection
        icon={Bookmark}
        label="My Bookmarks"
        items={bookmarks}
        loading={loadingBookmarks}
        defaultText="No bookmarks yet."
        renderItem={(bm) => {
          const post = bookmarkedPosts[bm.postId];
          return (
            <ActivityRow
              key={bm.id}
              primary={post ? post.title : `Post #${bm.postId}`}
              secondary={post?.content}
              meta={getRelativeTime(bm.createdAt)}
              onClick={() => openPostDialog(bm.postId)}
            />
          );
        }}
      />

      <Dialog open={!!dialogPost || dialogLoading} onOpenChange={(v) => { if (!v) { setDialogPost(null); setDialogComment(null); } }}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
          <VisuallyHidden><DialogTitle>Post Detail</DialogTitle></VisuallyHidden>
          {dialogLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : dialogPost ? (
            <div className="p-2 space-y-3">
              {dialogComment && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Your comment</p>
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">@{dialogComment.username}</span>
                        {dialogComment.repliedTo && (
                          <>
                            <span>replied to</span>
                            <span className="font-medium text-foreground">@{dialogComment.repliedTo}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{getRelativeTime(dialogComment.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-card-foreground">{dialogComment.content}</p>
                    </div>
                  </div>
                </div>
              )}
              <Post {...dialogPost} />
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">Post not found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}





/*

export async function fetchUserPosts(userId) {
  const q = query(collection(db, "posts"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((s) => {
    const d = s.data();
    return {
      id: s.id,
      title: d.title,
      content: d.content,
      username: d.username,
      createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(d.createdAt),
      likes: d.likes ?? 0,
      comments: d.commentsCount ?? 0,
      tags: d.tags ?? [],
    };
  });
}

export async function fetchUserComments(userId) {
  const q = query(collection(db, "comments"), where("userId", "==", userId), orderBy("createdAtApril", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((s) => {
    const d = s.data();
    const ts = d.createdAtApril ?? d.createdAt;
    return {
      id: s.id,
      postId: d.postId,
      rootPostId: d.rootPostId ?? d.postId,
      username: d.username,
      content: d.content,
      repliedTo: d.repliedTo || null,
      createdAt: ts instanceof Timestamp ? ts.toDate() : ts ? new Date(ts) : new Date(),
      likes: d.likes ?? 0,
    };
  });
}

export async function fetchUserLikes(userId) {
  const q = query(collection(db, "likes"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((s) => ({ id: s.id, ...s.data() }));
}

export async function fetchUserBookmarks(userId) {
  const q = query(collection(db, "bookmarks"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((s) => ({ id: s.id, ...s.data() }));
}


*/
