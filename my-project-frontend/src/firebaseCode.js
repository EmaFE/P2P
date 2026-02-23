/*

 add to config to connect to db:

 import { getFireStore } from "firebase/firestore"
 export const db = getFirestore(app)


 =====================================================================================================


 add to home to display posts:

 top: import { db } from ..config
      import { getDocs, collection } from  "firebase/firestore"

 state to  keep track of list of movies: const [movieList, setMovieList] = useState([])

 const movieCollRef = collection(db, "movies") //movies = collection name

 const getMovieList = async () =>{
      //READ data from db + set movie state = data
      //add try catch block around this
      const data = await getDocs(movieCollRef) 
      const filteredData = data.docs.map((doc) => ({...doc.data(), id:doc.id,}))
      console.log(filteredData)
      setMovieList(filteredData)
  }

  useEffect(()=>{
    getMovieList()
  }, [])

  display movies from movie list
  then movieList.map((movie) =>{
    return ...
    })
  

  ===================================================================================================================================
  
    for creating post

    have states for the post's title and body and update them as user types in the box
    when creating post, we call a function (async) like createPost

    import addDoc, deleteDoc, doc from firestore

    const createPost = async () =>{
      //add try catch block here
      await addDoc(movieCollRef, newPost())  //in my case, the post will be created so take the fileds form the object or mayeb dont even have the object and just do { title: newTitle, body: newBody,}
      getMovieList() //to show the new post after being created instead of havong the user refresh after each post to see it
    }



    //call this from movieRef Coll to have the id from the movie
    const deletePost = async (id) =>{
      const movieDoc = doc(db, "movies", id)
      await deleteDoc(movieDoc)
    }



    ========================================================================================================

    //have to be logged in to see and create posts

    keep track of the user id who created the movie so we can allow people who are logged in 

    have code that automatically sends the user id to the movies db and check if that id is the same as the one that's already logged in. if, yes create, otherise dont

    //update this

    import auth from firebase


    const createPost = async () =>{
      //add try catch block here
      await addDoc(movieCollRef, newPost())  //in my case, the post will be created so take the fileds form the object or mayeb dont even have the object and just do 
      
      { title: newTitle, body: newBody, userId: auth?.currentUser?.uid,}

      getMovieList() //to show the new post after being created instead of havong the user refresh after each post to see it
    }





*/