
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, increment, query, updateDoc, collection, where, orderBy, getDocs, addDoc, deleteDoc, serverTimestamp, getDoc} from "firebase/firestore"
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";




const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)



export async function fetchPosts() {
  const q = query(collection(db, "posts"));
  const snapshot = await getDocs(q);
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
      reported: data.reported ?? false,
      community: data.community ?? null,
    }
  })
}

export async function toggleLikePost(postId, liked, userId) {
  //console.log("post id from firebase.js: " + postId + typeof postId)
  const postRef = doc(db, "posts", postId);  
  await updateDoc(postRef, { likes: increment(liked ? 1 : -1) });
  
  if (liked) {
    await addDoc(collection(db, "likes"), { postId: postId, userId: userId, createdAt: serverTimestamp() });
    console.log("Added like document for postId:", postId, "userId:", userId);
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
  console.log("Successfully updated like status");
}

export async function toggleLikeComment(commentId, liked, userId) {
  //console.log("comment id from firebase.js: " + commentId + typeof commentId)
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, { likes: increment(liked ? 1 : -1) });
   if (liked) {
    await addDoc(collection(db, "likes"), { postId: commentId, userId: userId, createdAt: serverTimestamp() });
    console.log("Added like document for commentId:", commentId, "userId:", userId);
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
  console.log("bookmark postId: ", id)
  console.log("bookmark userId: ", userId)
  const q = query(
    collection(db, "bookmarks"),
    where("postId", "==", id),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  console.log(snapshot.docs.map(doc => doc.data()));
  return !snapshot.empty;
}

export async function handleBookmarkPost(postId, bookmarked, userId) {
  //const postRef = doc(db, "posts", postId);  
  // console.log("post ref: ", postRef)
  console.log("bookmarked value in handleBookmarkPost: " + bookmarked )
  //console.log("post id from firebase.js: " + postId + "bookmarked: " + postRef.bookmarked + "BEFORE UPDATE")
 // await updateDoc(postRef, { bookmarked: bookmarked });
  if (bookmarked){
    await addDoc(collection(db, "bookmarks"), { postId: postId, userId: userId, createdAt: serverTimestamp()});
    toast.success("Post bookmarked!");
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
      toast.success("Comment removed from bookmarks");
      // const postRef = doc(db, "comments", postId);
      // await updateDoc(postRef, { bookmarked: bookmarked });
    }
  }
}

export async function handleBookmarkComment(commentId, bookmarked, rootPostId, userId) {
 // console.log("comment id from firebase.js: " + commentId + typeof commentId)
 // const commentRef = doc(db, "comments", commentId);
 // await updateDoc(commentRef, { bookmarked: bookmarked });
  if (bookmarked){
    await addDoc(collection(db, "bookmarks"), { postId: commentId, rootPostId: rootPostId, userId: userId, createdAt: serverTimestamp()});
    toast.success("Comment bookmarked!");
  }else {
    const q = query(collection(db, "bookmarks"),
              where("postId", "==", commentId),
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
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { reported: true });
  toast.success("Post reported. Thank you keeping the community safe!");
}

export async function fetchComments(postId) {
  const q = query(
    collection(db, "comments"),
    where("rootPostId", "==", postId),
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
      postId: data.postId,
      repliedTo: data.repliedTo || null,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      reported: data.reported ?? false,
      commentsCount: data.commentsCount ?? 0,
      rootPostId: data.rootPostId ?? ""
    //  bookmarked: data.bookmarked ?? false,
    }
  })
}

export async function createComment({ postId, username, uid, content, repliedTo, rootPostId }) {
  try {
    await addDoc(collection(db, "comments"), {
      postId,
      username,
      uid,
      content,
      repliedTo,
      createdAt: serverTimestamp(),
      likes: 0,
      reported: false,
      commentsCount: 0,
      rootPostId,
      //bookmarked: false,
    });
    toast.success("Comment posted successfully!");
    //increment comment count on the post from posts or comments
    const postRef = doc(db, "posts", rootPostId);
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
    console.error("Error creating comment: ", error);
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
    reported: false,
    community: communityName,
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
    //console.error("Error creating post: ", error);
  }
}

export async function getUser(){
  const currUser = getAuth().currentUser;
  if(!currUser) return null;
  const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", currUser.uid)));
  console.log(userDoc.docs[0]?.data()?.uid)  
  return userDoc.docs[0]?.data()
}

export async function fetchPostsByUser (user) {
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
      reported: data.reported ?? false,
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
      postId: data.postId,
      repliedTo: data.repliedTo || null,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      reported: data.reported ?? false,
      commentsCount: data.commentsCount ?? 0,
      rootPostId: data.rootPostId,
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    }
  });
}

export async function fetchBookmarksByUser(user) {
  const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
  const snap = await getDocs(q);
  console.log("snap ",snap);
  return snap.docs.map((docSnap) =>{
    const data = docSnap.data();
    console.log("bm from firebase: ", data)
    return {
      id: docSnap.id,
      uid: data.userId,
      postId: data.postId,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    }
  })
}

export async function fetchPostById (id) {
  const commDoc = await getDoc(doc(db, "comments", id));
  const data = commDoc.data();
  if(data){
    console.log("comm doc data: ",data);
    return {
      id: commDoc.id,
      content: data.content,
      username: data.username,
      uid: data.uid,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      commentsCount: data.commentsCount ?? 0,
      reported: data.reported ?? false,
      community: data.community ?? null,
    }
   } else {
      const postDoc = await getDoc(doc(db, "posts", id)); 
      const data = postDoc.data();
      if(data){
        console.log("post doc data: ",data);
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
          reported: data.reported ?? false,
          community: data.community ?? null,
        }
      }
   }
}

export async function fetchCommentById (id) {
   const commDoc = await getDoc(doc(db, "comments", id));
    const data = commDoc.data();
    console.log("post doc data: ",data);
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
      reported: data.reported ?? false,
      community: data.community ?? null,
    }
}

