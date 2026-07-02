
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, increment, query, updateDoc, collection, where, orderBy, getDocs, addDoc, deleteDoc, serverTimestamp, getDoc, snapshotEqual, arrayUnion} from "firebase/firestore"
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { concat } from "firebase/firestore/pipelines";
import { comma } from "postcss/lib/list";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function fetchPosts(categoryN, user) {
  let q;
  categoryN = categoryN.toLowerCase();
  // console.log("fetch posts from firbease called: ", categoryN, user.uid)

  //was reflections
  if (categoryN === "drafts") {
    q = query(
      collection(db, "posts"),
      where("category", "==", "drafts"),
      where("uid", "==", user.uid),
    );
  } else {
    q = query(
      collection(db, "posts"),
      where("category", "==", categoryN),
    );
  }


  try{
    const snapshot = await getDocs(q);
  // console.log("DOC COUNT:", snapshot.size);

  // snapshot.forEach((doc) => {
  //   console.log(doc.id, doc.data());
  // });

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      username: data.username,
      uid: data.uid ?? null,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      commentsCount: data.commentsCount ?? 0,
      tags: data.tags ?? [],
      category: data.category ?? null,
      status: data.status ?? "active",
      deletionReason: data.deletionReason ?? "",
      community: data.community ?? null,
    };
  });

  }
  catch (error){
    // console.log("error fetching posts: ", error)
    toast.error("Error fetching posts. Please try again.")
  }
  
}

export async function toggleLikePost(postId, liked, userId) {
  //console.log("post id from firebase.js: " + postId + typeof postId)
  const postRef = doc(db, "posts", postId);  
  const postSnap = await getDoc(postRef);

  //this is for "my likes" page where we want the like to be removed when the comment is expnaded
  if (!postSnap.exists()) {
    toggleLikeComment(postId, liked, userId);
    return;
  }
  await updateDoc(postRef, { likes: increment(liked ? 1 : -1) });
  
  if (liked) {
    await addDoc(collection(db, "likes"), { postId: postId, userId: userId, createdAt: serverTimestamp(), type: "post" });
    // console.log("Added like document for postId:", postId, "userId:", userId);
  } else{
    const q = query(
      collection(db, "likes"),
      where("postId", "==", postId),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    //snapshot.forEach(async (docSnap) => {
      await Promise.all(snapshot.docs.map(docSnap => deleteDoc(doc(collection(db, "likes"), docSnap.id))));
      //await deleteDoc(doc(db, "likes", docSnap.id));
    //});
  }
  // console.log("Successfully updated like status");
}

export async function toggleLikeComment(commentId, liked, userId) {
  //console.log("comment id from firebase.js: " + commentId + typeof commentId)
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, { likes: increment(liked ? 1 : -1) });
   if (liked) {
    await addDoc(collection(db, "likes"), { postId: commentId, userId: userId, createdAt: serverTimestamp(), type: "comment" });
    // console.log("Added like document for commentId:", commentId, "userId:", userId);
  } else {
    const q = query(
      collection(db, "likes"),
      where("postId", "==", commentId),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
   // snapshot.forEach(async (docSnap) => {
       await Promise.all(snapshot.docs.map(docSnap => deleteDoc(doc(collection(db, "likes"), docSnap.id))));
    //});
  }
  // console.log("Successfully updated like status");
}

export async function isLikedByUser(id, userId) {
  const q = query(
      collection(db, "likes"),
      where("postId", "==", id),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

export async function isBookmarkedByUser(id, userId, type){
  // console.log("bookmark postId: ", id)
  // console.log("bookmark userId: ", userId)
  if(type === "post"){
    const q = query(
    collection(db, "bookmarks"),
    where("postId", "==", id),
    where("userId", "==", userId),
    where("commentId", "==", null)
  );
    const snapshot = await getDocs(q);
    // console.log(snapshot.docs.map(doc => doc.data()));
    return !snapshot.empty;
  } else if (type === "comment"){
    const q = query(
    collection(db, "bookmarks"),
    where("commentId", "==", id),
    where("userId", "==", userId)
  );
    const snapshot = await getDocs(q);
    // console.log(snapshot.docs.map(doc => doc.data()));
    return !snapshot.empty;
  }
  
}

export async function handleBookmarkPost(postId, bookmarked, userId) {
  //const postRef = doc(db, "posts", postId);  
  // console.log("post ref: ", postRef)
  //console.log("bookmarked value in handleBookmarkPost: " + bookmarked )
  //console.log("post id from firebase.js: " + postId + "bookmarked: " + postRef.bookmarked + "BEFORE UPDATE")
 // await updateDoc(postRef, { bookmarked: bookmarked });
  if (bookmarked){
    await addDoc(collection(db, "bookmarks"), {commentId: null, postId: postId, userId: userId, createdAt: serverTimestamp(), type:"post"});
    toast.success("Post added to your account's bookmarks!");
   // console.log("post id from firebase.js: " + postId + "bookmarked: " + postRef.bookmarked + "AFTER UPDATE")
  }else {
    const q = query(collection(db, "bookmarks"),
              where("postId", "==", postId),
              where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, "bookmarks", docSnap.id));
    }
    if (!querySnapshot.empty) {
      toast.success("Post removed from bookmarks");
      // const postRef = doc(db, "comments", postId);
      // await updateDoc(postRef, { bookmarked: bookmarked });
    }
  }
}

export async function handleBookmarkComment(commentId, bookmarked, postId, userId) {
 // console.log("comment id from firebase.js: " + commentId + typeof commentId)
 // const commentRef = doc(db, "comments", commentId);
 // await updateDoc(commentRef, { bookmarked: bookmarked });
  if (bookmarked){
    await addDoc(collection(db, "bookmarks"), { commentId: commentId, postId: postId, userId: userId, createdAt: serverTimestamp(), type:"comment"});
    toast.success("Comment added to your account's bookmarks!");
  }else {
    const q = query(collection(db, "bookmarks"),
              where("commentId", "==", commentId),
              where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, "bookmarks", docSnap.id));
    }
    if (!querySnapshot.empty) {
      toast.success("Comment removed from bookmarks");
    }
}}

export async function reportPost(postId) {
  try{
    const postData = await fetchPostById(postId);
    if (postData?.status === "active"){
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, { status: "reported"});
        toast.success("Post reported. Thank you for helping to keep the community safe!")
        console.log("postData.uid: ", postData.uid)
        const userRef = doc(db, "users", postData.uid)
        console.log("userRef: ", userRef)
        if (userRef) {
          await updateDoc(userRef, { reportCount: increment(1) });
        }
      } else {
          toast.success("Post has already been reported and is under review. Thank you for helping to keep the community safe!")
      }
  } catch (error){  
    console.log("error reporting post: ", error)
    toast.error("Could not report post. Please try again.")
  }
}

export async function reportComment(commentId) {
  try{
    const commentData = await fetchCommentById(commentId);
    if (commentData?.status === "active"){
        const commentRef = doc(db, "comments", commentId);
        await updateDoc(commentRef, { status: "reported"});
        toast.success("Comment reported. Thank you for helping to keep the community safe!")
        const userDoc = await getDoc(doc(db, "users", commentData.uid));
        if (userDoc.exists()) {
          await updateDoc(userDoc.ref, { reportCount: increment(1) });
        }
    } else {
        toast.success("Comment has already been reported and is under review. Thank you for helping to keep the community safe!")
    }
  } catch (error){  
    // console.log("error reporting comment: ", error)
    toast.error("Could not report comment. Please try again.")
  }

}

export async function fetchComments(postId) {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      username: data.username,
      uid: data.uid,
      content: data.content,
      parentId: data.parentId,
      repliedTo: data.repliedTo || null,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      status: data.status ?? "active",
      deletionReason: data.deletionReason ?? "",
      commentsCount: data.commentsCount ?? 0,
      postId: data.postId ?? ""
    //  bookmarked: data.bookmarked ?? false,
    }
  })
}

export async function fetchAllComments(){
  const snapshot = await getDocs(collection(db, "comments"));
  return snapshot.docs.map((docSnap) =>{
    const data = docSnap.data()
    return {
      id: docSnap.id,
      username: data.username,
      uid: data.uid,
      content: data.content,
      parentId: data.parentId,
      repliedTo: data.repliedTo || null,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      status: data.status ?? "active",
      deletionReason: data.deletionReason ?? "",
      commentsCount: data.commentsCount ?? 0,
      postId: data.postId ?? ""
    }
  })
}

export async function createComment({ parentId, username, uid, content, repliedTo, postId }) {
  try {
    await addDoc(collection(db, "comments"), {
      parentId,
      username,
      uid,
      content,
      repliedTo,
      createdAt: serverTimestamp(),
      likes: 0,
      status: "active",
      commentsCount: 0,
      postId,
      status: "active",
      deletionReason: "",
      //bookmarked: false,
    });
    toast.success("Comment posted successfully!");
    //increment comment count on the post from posts or comments
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      await updateDoc(postRef, { commentsCount: increment(1) });
    }

    const commentRef = doc(db, "comments", postId);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      await updateDoc(commentRef, { commentsCount: increment(1) });
    }
  } catch (error) {
    toast.error("Error posting comment. Please try again.");
    // console.error("Error creating comment: ", error);
  }

  return null;
}

export async function createPost({ title, content, username, tags, uid, activeCategory, communityName }) {
  const now = new Date();
  const newPost = {
    username: username,
    uid: uid,
    title: title,
    content: content,
    likes: 0,
    commentsCount: 0,
    tags: tags,
    category: activeCategory,
    createdAt: now,
    community: communityName,
    status: "active",
    deletionReason: "",
   // bookmarked: false,
  }

  //console.log("Creating post with data:", newPost);

  try {      
    await addDoc(collection(db, "posts"), {
    ...newPost,
    createdAt: serverTimestamp()
    });
    toast.success("Post created successfully!");
  } catch (error) {
    toast.error("Error creating post. Please try again.");
    console.error("Error creating post: ", error);
  }
}

export async function getUser(){
  const currUser = getAuth().currentUser;
  if(!currUser) return null;
  const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", currUser.uid)));
  // console.log(userDoc.docs[0]?.data()?.uid)  
  return userDoc.docs[0]?.data()
}

export async function getUserByEmail(email){
  const userDoc = await getDocs(query(collection(db, "users"), where ("email", "==", email)))
  // console.log(userDoc.docs[0]?.data()?.role)
  return userDoc.docs[0]?.data()
}

export async function getUserById(uid){
  // console.log("----------------------------------------------------------------------------------------------")
  // console.log("getUserById called with uid: ", uid)
  const userDoc = await getDocs(query(collection(db, "users"), where ("uid", "==", uid)))
  // console.log(userDoc.docs[0]?.data()?.role)
  return userDoc.docs[0]?.data()
}

export async function logOut() {
  await signOut(auth);
}

export async function getUserName(){
  getUser()?.username;
}

export async function fetchPostsByUser (user) {
  // console.log("auth user: ", auth.currentUser)
  const q = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title ?? "",
      content: data.content,
      username: data.username,
      uid: data.uid,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      commentsCount: data.commentsCount ?? 0,
      tags: data.tags ?? [],
      category: data.category ?? null,
      status: data.status ?? "active",
      deletionReason: data.deletionReason ?? "",
      community: data.community ?? null,
    }
  });
}

export async function fetchCommentsByUser (user) {
  const q = query(collection(db, "comments"), where("uid", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) =>{
    const data = docSnap.data();
    return {
      id: docSnap.id,
      username: data.username,
      uid: data.uid,
      content: data.content,
      parentId: data.parentId,
      repliedTo: data.repliedTo || null,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      status: data.status ?? "active",
      commentsCount: data.commentsCount ?? 0,
      deletionReason: data.deletionReason ?? "",
      postId: data.postId,
    }
  })
}

export async function fetchLikesByUser (user) {
  const q = query(collection(db, "likes"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id:docSnap.id,
      uid: data.userId,
      postId: data.postId,
      type: data.type,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    }
  });
}

export async function fetchBookmarksByUser(user) {
  const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q);
  // console.log("snap ",snap);
  return snap.docs.map((docSnap) =>{
    const data = docSnap.data();
    // console.log("bm from firebase: ", data)
    return {
      id: docSnap.id,
      uid: data.userId,
      commentId: data.commentId ?? "",
      postId: data.postId,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      type: data.type,
    }
  })
}

export async function fetchPostById (id) {
    // console.log("before post")
  const postDoc = await getDoc(doc(db, "posts", id)); 
    // console.log("postDoc ", postDoc)
  const data = postDoc.data();
  if(data){
    return {
      id: postDoc.id,
      title: data.title ?? "",
      content: data.content,
      username: data.username,
      uid: data.uid,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      commentsCount: data.commentsCount ?? 0,
      tags: data.tags ?? [],
      category: data.category ?? null,
      status: data.status ?? "active",
      deletionReason: data.deletionReason ?? "",
      community: data.community ?? null,
    }
  } else fetchCommentById(id);
}

export async function fetchCommentById (id) {
  // console.log("before")
   const commDoc = await getDoc(doc(db, "comments", id));
     // console.log("coomm doc", commDoc)
    const data = commDoc.data();
    if (data){
      return {
      id: commDoc.id,
      content: data.content,
      username: data.username,
      uid: data.uid,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      commentsCount: data.commentsCount ?? 0,
      tags: data.tags ?? [],
      category: data.category ?? null,
      status: data.status ?? "active",
      community: data.community ?? null,
      repliedTo: data.repliedTo,
      postId: data.postId,
      parentId: data.parentId,
      }
    }
}

export async function deleteComment (commentId, postId){
  try {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      status: "deleted",
      deletionReason: "Deleted by user",
    });

    toast.success("Comment deleted successfully!");

    //decrement comment count on the post from posts or comments
    const postRef = doc(db, "posts", postId)
    const postSnap = await getDoc(postRef)
    if(postSnap.exists()){
      await updateDoc(postRef, {commentsCount: increment(-1)});
    }
  }
  catch (error){
    toast.error("Could not delete comment. Please try again.")
    // console.error("error deleting comment: ", error)
  }
}

export async function deleteBookmark (bookmarkId){
  // console.log("Current uid:", auth.currentUser?.uid);
  // console.log("Deleting bookmark:", bookmarkId);
  try {
    const bookmarkRef = doc(db, "bookmarks", bookmarkId);
    if (bookmarkRef) await deleteDoc(bookmarkRef);
    toast.success("Bookmark deleted successfully!");
  }
  catch (error){
    toast.error("Could not delete bookmark. Please try again.")
    // console.error("error deleting bookmark: ", error)
  }
}

export async function deletePost (postId){
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      status: "deleted",
      deletionReason: "Deleted by user",
    });

    toast.success("Post deleted successfully!");
  }
  catch (error){
    toast.error("Could not delete post. Please try again.")
    // console.error("error deleting post: ", error)
  }
}

export async function deleteLike (likeId, postId){
  // console.log("entered delet like")
  let success = false;
  let post = false
  let com = false
  try {
    const likeRef = doc(db, "likes", likeId);
    const likeDoc = await getDoc(likeRef)
    const likeData = likeDoc.data()
    if (likeData && likeData.type === "post") post = true
    if (likeData && likeData.type === "comment") com = true
    await deleteDoc(likeRef);

    toast.success("Like deleted successfully!");
    success = true;
    // console.log("deleted like ", likeId, " + " ,postId)
  } catch(error){
      toast.error("Could not delete like from post. Please try again.")
      // console.error("error deleting like: ", error)
  }

  try{
    if (success){
      // console.log("like id after success ", likeId)
      if (post){
        const postRef = doc(db, "posts", postId)
        if(postRef){
          // console.log("decrente for post like")
          await updateDoc(postRef, {likes: increment(-1)});
          toast.success("decrement number of likes")
        }
      } else  if (com){
        // console.log("post id from comment decrement like ", postId)
        const comRef = doc(db, "comments", postId)
        if(comRef){
          // console.log("decrente for comment like")
          await updateDoc(comRef, {likes: increment(-1)});
          toast.success("decrement number of likes")
        }
      }
    

       //decrement like count from post or comment
      // console.log("decrente for post like att")
      // const postRef = doc(db, "posts", postId)
      // const postSnap = await getDoc(postRef)
      // console.log("post snap", postSnap)
      // if(postSnap.exists()){
      //   console.log("decrente for post like")
      //   await updateDoc(postRef, {likes: increment(-1)});
      // } else {
      //   console.log("decrente for comment like attt")
      //   const commentRef = doc(db, "comments", postId)
      //   const postSnap = await getDoc(commentRef)
      //   if(postSnap.exists()){
      //     console.log("decrente for comment like")
      //     await updateDoc(commentRef, {likes: increment(-1)});
      //   }
      // }
      success=false;
     }
  }
  catch (error){
    toast.error("Could not decrement number of likess.")
    console.error("error deleting like: ", error)
  }
}

export async function dismiss(id, collection, admin_id){
  const admin = await getUserById(admin_id)
  // console.log("admin", admin)
  let data
  try {
    const ref = doc(db, collection, id);
    await updateDoc(ref, { status: "active", deletionReason: "" })
    toast.success("Content successfully dismissed / restored!")

    //if a comment is restored, increment the comment count on the post
    const snapshot = await getDoc(ref)
    data = snapshot.data()
    if (collection === "comments") {
      const postRef = doc(db, "posts", data.postId)
      await updateDoc(postRef, { commentsCount: increment(1) })
    }

  } catch (error) {
    toast.error("Could not dismiss content. Please try again.")
    // console.log("error dismissing content: ", error)
  } finally {
    createLog(collection, admin_id, admin.username, id, data.uid, data.username, "dismiss")
  }
}

export async function deleteContent (id, reason, collection, status, admin_id){
  // console.log("Auth UID:", auth.currentUser?.uid);
  const admin = await getUserById(admin_id)
  let data
  try {
    const ref = doc(db, collection, id)
   // console.log("before update doc, ref: ", ref)
    await updateDoc(ref, { status: status, deletionReason: reason })
    //console.log("after update")
    toast.success("Content successfully deleted!")
     //if a comment is deleted, decrement the comment count on the post
    const snapshot = await getDoc(ref)
    data = snapshot.data()
    // console.log("post id from com: ", data.postId)
    // console.log("data form user: ", data.uid)
     if (collection === "comments") {
      const postRef = doc(db, "posts", data.postId)
      await updateDoc(postRef, { commentsCount: increment(-1) })
    }
    if (collection === "users"){
      await updateDoc(ref, { suspendCount: increment(1) })
    }
  }
  catch (error){
    toast.error("Could not delete content. Please try again.")
    // console.log("error deleting content: ", error)
  } finally {
    if (admin.role === "admin") createLog(collection, admin_id, admin.username, id, data.uid, data.username, "delete", reason)
  }
}

export async function fetchUsers (){
  const snapshot = await getDocs(collection(db, "users"))
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      uid: data.uid,
      username: data.username,
      createdAt: data.createdAt,
      email: data.email,
      status: data.status,
      deletionReason: data.reason ?? "",
    }
  })
}

export async function  createLog(collectionName, admin_id, admin_username, og_content_id = null, impacted_user_id, impacted_username, type, reason=null){
  let action
  if(type === "delete"){
    if (collectionName === "posts") { action = "deleted_post" }
      else if (collectionName === "comments") { action = "deleted_comment" }
        else action = "deleted_report"
  } else if (type === "dismiss"){
    if (collectionName === "posts") { action = "restored_post" }
      else if (collectionName === "comments") { action = "restored_comment" }
        else action = "dismissed_report"
  }

  //  console.log("admin_id: ", admin_id)
  // console.log("admin_username: ", admin_username)
  // console.log("action: ", action)
  // console.log("reason: ", reason)
  // console.log("impacted_user_id: ",impacted_user_id)
  // console.log("impacted_username: ",impacted_username)
 
  const now = new Date()
  const newLog = {
    admin_id: admin_id,
    admin_username: admin_username,
    action: action,
    reason: reason,
    impacted_user_id: impacted_user_id,
    impacted_username: impacted_username,
    createdAt: now,
    og_content_id: og_content_id ?? null,
  }

  try {      
    await addDoc(collection(db, "logs"), {
    ...newLog,
    createdAt: serverTimestamp()
    });
    toast.success("Log created successfully!");
  } catch (error) {
    toast.error("Error creating log. Please try again.");
    // console.error("Error creating log: ", error);
  }
}

export async function fetchLogs(){
  const snapshot = await getDocs(collection(db, "logs"))
  return snapshot.docs.map((docSnap) =>{
    const data = docSnap.data()
    return {
      id: docSnap.id,
      admin_id: data.admin_id,
      admin_username: data.admin_username,
      action: data.action,
      og_content_id: data.og_content_id ?? null,
      reason: data.reason,
      createdAt: data.createdAt,
      impacted_user_id: data.impacted_user_id,
      impacted_username: data.impacted_username,
    }
  })
}

export async function deleteUserAfterRegistration(user) {
  try {
    console.log("Deleting user after registration:", user.uid);
    await deleteDoc(doc(db, "users", user.uid));
  }
    catch (error) {
      toast.error("Could not delete user. Please try again.")
      console.error("error deleting user: ", error)
    }
}