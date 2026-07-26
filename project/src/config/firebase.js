
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, increment, query, updateDoc, collection, where, orderBy, getDocs, addDoc, deleteDoc, serverTimestamp, getDoc, snapshotEqual, arrayUnion} from "firebase/firestore"
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function fetchPosts(categoryN, user) {
  let q
  categoryN = categoryN.toLowerCase()

  if (categoryN === "drafts") {
    q = query(
      collection(db, "posts"),
      where("category", "==", "drafts"),
      where("uid", "==", user.uid),
    )
  } else {
    q = query(
      collection(db, "posts"),
      where("category", "==", categoryN),
    )
  }


  try{
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()

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
      }
    })
  }
  catch (error){
    toast.error("Error fetching posts. Please try again.")
  }
  
}

export async function toggleLikePost(postId, liked, userId) {
  const postRef = doc(db, "posts", postId)
  const postSnap = await getDoc(postRef)

  //this is for "my likes" page where we want the like to be removed when the comment is expnaded
  if (!postSnap.exists()) {
    toggleLikeComment(postId, liked, userId)
    return;
  }
  await updateDoc(postRef, { likes: increment(liked ? 1 : -1) })
  
  if (liked) {
    await addDoc(collection(db, "likes"), { postId: postId, userId: userId, createdAt: serverTimestamp(), type: "post" })
  } else{
    const q = query(
      collection(db, "likes"),
      where("postId", "==", postId),
      where("userId", "==", userId)
    )
    const snapshot = await getDocs(q)
      await Promise.all(snapshot.docs.map(docSnap => deleteDoc(doc(collection(db, "likes"), docSnap.id))))
  }
}

export async function toggleLikeComment(commentId, liked, userId) {
  const commentRef = doc(db, "comments", commentId)
  await updateDoc(commentRef, { likes: increment(liked ? 1 : -1) })
   if (liked) {
    await addDoc(collection(db, "likes"), { postId: commentId, userId: userId, createdAt: serverTimestamp(), type: "comment" })
  } else {
    const q = query(
      collection(db, "likes"),
      where("postId", "==", commentId),
      where("userId", "==", userId)
    )
    const snapshot = await getDocs(q)
       await Promise.all(snapshot.docs.map(docSnap => deleteDoc(doc(collection(db, "likes"), docSnap.id))))
  }
}

export async function isLikedByUser(id, userId) {
  const q = query(
      collection(db, "likes"),
      where("postId", "==", id),
      where("userId", "==", userId)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
  }

export async function isBookmarkedByUser(id, userId, type){
  if(type === "post"){
    const q = query(
    collection(db, "bookmarks"),
    where("postId", "==", id),
    where("userId", "==", userId),
    where("commentId", "==", null)
  )
    const snapshot = await getDocs(q)
    return !snapshot.empty;
  } else if (type === "comment"){
    const q = query(
    collection(db, "bookmarks"),
    where("commentId", "==", id),
    where("userId", "==", userId)
  )
    const snapshot = await getDocs(q)
    return !snapshot.empty;
  }
  
}

export async function handleBookmarkPost(postId, bookmarked, userId) {
  if (bookmarked){
    await addDoc(collection(db, "bookmarks"), {commentId: null, postId: postId, userId: userId, createdAt: serverTimestamp(), type:"post"})
    toast.success("Post added to your account's bookmarks!")
  }else {
    const q = query(collection(db, "bookmarks"),
              where("postId", "==", postId),
              where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, "bookmarks", docSnap.id))
    }
    if (!querySnapshot.empty) {
      toast.success("Post removed from bookmarks")
    }
  }
}

export async function handleBookmarkComment(commentId, bookmarked, postId, userId) {
  if (bookmarked){
    await addDoc(collection(db, "bookmarks"), { commentId: commentId, postId: postId, userId: userId, createdAt: serverTimestamp(), type:"comment"})
    toast.success("Comment added to your account's bookmarks!")
  }else {
    const q = query(collection(db, "bookmarks"),
              where("commentId", "==", commentId),
              where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, "bookmarks", docSnap.id))
    }
    if (!querySnapshot.empty) {
      toast.success("Comment removed from bookmarks")
    }
}}

export async function reportPost(postId) {
  try{
    const postData = await fetchPostById(postId)
    if (postData?.status === "active"){
        const postRef = doc(db, "posts", postId)
        await updateDoc(postRef, { status: "reported"})
        toast.success("Post reported. Thank you for helping to keep the community safe!")
        const userRef = doc(db, "users", postData.uid)
        if (userRef) {
          await updateDoc(userRef, { reportCount: increment(1) })
        }
      } else {
          toast.success("Post has already been reported and is under review. Thank you for helping to keep the community safe!")
      }
  } catch (error){
    toast.error("Could not report post. Please try again.")
  }
}

export async function reportComment(commentId) {
  try{
    const commentData = await fetchCommentById(commentId)
    if (commentData?.status === "active"){
        const commentRef = doc(db, "comments", commentId)
        await updateDoc(commentRef, { status: "reported"})
        toast.success("Comment reported. Thank you for helping to keep the community safe!")
        const userDoc = await getDoc(doc(db, "users", commentData.uid))
        if (userDoc.exists()) {
          await updateDoc(userDoc.ref, { reportCount: increment(1) })
        }
    } else {
        toast.success("Comment has already been reported and is under review. Thank you for helping to keep the community safe!")
    }
  } catch (error){ 
    toast.error("Could not report comment. Please try again.")
  }

}

export async function fetchComments(postId) {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => {
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

export async function fetchAllComments(){
  const snapshot = await getDocs(collection(db, "comments"))
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
      deletionReason: "",
    })
    toast.success("Comment posted successfully!")
    //increment comment count on the post from posts or comments
    const postRef = doc(db, "posts", postId)
    const postSnap = await getDoc(postRef)

    if (postSnap.exists()) {
      await updateDoc(postRef, { commentsCount: increment(1) })
    }

    const commentRef = doc(db, "comments", parentId)
    const commentSnap = await getDoc(commentRef)

    if (commentSnap.exists()) {
      await updateDoc(commentRef, { commentsCount: increment(1) })
    }
  } catch (error) {
    toast.error("Error posting comment. Please try again.")
  }

  return null
}

export async function createPost({ title, content, username, tags, uid, activeCategory, communityName }) {
  const now = new Date()
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
  }

  try {      
    await addDoc(collection(db, "posts"), {
    ...newPost,
    createdAt: serverTimestamp()
    })
    toast.success("Post created successfully!")
  } catch (error) {
    toast.error("Error creating post. Please try again.")
    console.error("Error creating post: ", error)
  }
}

export async function getUser(){
  const currUser = getAuth().currentUser
  if(!currUser) return null
  const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", currUser.uid)))
  return userDoc.docs[0]?.data()
}

export async function getUserByEmail(email){
  const userDoc = await getDocs(query(collection(db, "users"), where ("email", "==", email)))
  return userDoc.docs[0]?.data()
}

export async function getUserById(uid){
  const userDoc = await getDocs(query(collection(db, "users"), where ("uid", "==", uid)))
  return userDoc.docs[0]?.data()
}

export async function logOut() {
  await signOut(auth);
}

export async function getUserName(){
  return getUser()?.username;
}

export async function fetchPostsByUser (user) {
  const q = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((docSnap) => {
    const data = docSnap.data()
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
  })
}

export async function fetchCommentsByUser (user) {
  const q = query(collection(db, "comments"), where("uid", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((docSnap) =>{
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
      commentsCount: data.commentsCount ?? 0,
      deletionReason: data.deletionReason ?? "",
      postId: data.postId,
    }
  })
}

export async function fetchLikesByUser (user) {
  const q = query(collection(db, "likes"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id:docSnap.id,
      uid: data.userId,
      postId: data.postId,
      type: data.type,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    }
  })
}

export async function fetchBookmarksByUser(user) {
  const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((docSnap) =>{
    const data = docSnap.data()
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
  const postDoc = await getDoc(doc(db, "posts", id))
  const data = postDoc.data()
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
  } else fetchCommentById(id)
}

export async function fetchCommentById (id) {
   const commDoc = await getDoc(doc(db, "comments", id))
    const data = commDoc.data()
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
    const commentRef = doc(db, "comments", commentId)
    await updateDoc(commentRef, {
      status: "deleted",
      deletionReason: "Deleted by user",
    })

    toast.success("Comment deleted successfully!")

    //decrement comment count on the post from posts or comments
    const postRef = doc(db, "posts", postId)
    const postSnap = await getDoc(postRef)
    if(postSnap.exists()){
      await updateDoc(postRef, {commentsCount: increment(-1)})
    }
  }
  catch (error){
    toast.error("Could not delete comment. Please try again.")
  }
}

export async function deleteBookmark (bookmarkId){
  try {
    const bookmarkRef = doc(db, "bookmarks", bookmarkId)
    if (bookmarkRef) await deleteDoc(bookmarkRef)
    toast.success("Bookmark deleted successfully!")
  }
  catch (error){
    toast.error("Could not delete bookmark. Please try again.")
  }
}

export async function deletePost (postId){
  try {
    const postRef = doc(db, "posts", postId)
    await updateDoc(postRef, {
      status: "deleted",
      deletionReason: "Deleted by user",
    })

    toast.success("Post deleted successfully!")
  }
  catch (error){
    toast.error("Could not delete post. Please try again.")
  }
}

export async function deleteLike (likeId, postId){
  let success = false
  let post = false
  let com = false
  try {
    const likeRef = doc(db, "likes", likeId)
    const likeDoc = await getDoc(likeRef)
    const likeData = likeDoc.data()
    if (likeData && likeData.type === "post") post = true
    if (likeData && likeData.type === "comment") com = true
    await deleteDoc(likeRef)

    toast.success("Like deleted successfully!")
    success = true
  } catch(error){
      toast.error("Could not delete like from post. Please try again.")
  }

  try{
    if (success){
      if (post){
        const postRef = doc(db, "posts", postId)
        if(postRef){
          await updateDoc(postRef, {likes: increment(-1)})
          toast.success("decrement number of likes")
        }
      } else  if (com){
        const comRef = doc(db, "comments", postId)
        if(comRef){
          await updateDoc(comRef, {likes: increment(-1)})
          toast.success("decrement number of likes")
        }
      }
      success=false
     }
  }
  catch (error){
    toast.error("Could not decrement number of likess.")
    console.error("error deleting like: ", error)
  }
}

export async function dismiss(id, collection, admin_id){
  const admin = await getUserById(admin_id)
  let data
  try {
    const ref = doc(db, collection, id)
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
  } finally {
    createLog(collection, admin_id, admin.username, id, data.uid, data.username, "dismiss")
  }
}

export async function deleteContent (id, reason, collection, status, admin_id){
  const admin = await getUserById(admin_id)
  let data
  try {
    const ref = doc(db, collection, id)
    await updateDoc(ref, { status: status, deletionReason: reason })
    toast.success("Content successfully deleted!")
     //if a comment is deleted, decrement the comment count on the post
    const snapshot = await getDoc(ref)
    data = snapshot.data()
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
  } finally {
    if (admin.role === "admin") createLog(collection, admin_id, admin.username, id, data.uid, data.username, "delete", reason, status)
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

export async function  createLog(collectionName, admin_id, admin_username, og_content_id = null, impacted_user_id, impacted_username, type, reason=null, status=null){
  let action
  if(type === "delete"){
    if (collectionName === "posts") { action = "deleted_post" }
      else if (collectionName === "comments") { action = "deleted_comment" }
        else if (collectionName === "users") { 
          if (status === "suspended") action = "suspended_user"
          else if (status === "deleted") action = "deleted_user"
        }
        else action = "deleted_report"
  } else if (type === "dismiss"){
    if (collectionName === "posts") { action = "restored_post" }
      else if (collectionName === "comments") { action = "restored_comment" }
        else if (collectionName === "users") { action = "restored_user" }
        else action = "dismissed_report"
  }
 
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
    })
    toast.success("Log created successfully!")
  } catch (error) {
    toast.error("Error creating log. Please try again.")
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
    await deleteDoc(doc(db, "users", user.uid))
  }
    catch (error) {
      toast.error("Could not delete user. Please try again.")
      console.error("error deleting user: ", error)
    }
}

export async function removeDraft(id){
  try {
    await deleteDoc(doc(db, "posts", id))
  } catch (error) {
      // toast.error("Could not delete draft. Please try again.")
  }
}