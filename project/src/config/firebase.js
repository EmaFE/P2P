
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, increment, updateDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAsxJi3YJ25hCH1yLJj5XUZZ84oz3WlXTo",
  authDomain: "p2pfyp.firebaseapp.com",
  projectId: "p2pfyp",
  storageBucket: "p2pfyp.firebasestorage.app",
  messagingSenderId: "774198692848",
  appId: "1:774198692848:web:5c00a678f85fd18a4dab35"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)


export async function fetchPosts() {
  const q = query(collection(db, "posts"), orderBy("likes", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      username: data.username,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      likes: data.likes ?? 0,
      comments: data.comments ?? [],
      tags: data.tags ?? [],
    };
  });
}

export async function toggleLikePost(postId, liked) {
  console.log("post id from firebase.js: " + postId + typeof postId)
  const postRef = doc(db, "posts", String(postId));  
  await updateDoc(postRef, { likes: increment(liked ? -1 : 1) });
  console.log("Successfully updated like status");
}

export async function reportPost(postId) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { reported: true });
}