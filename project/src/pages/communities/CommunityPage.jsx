import { Filter, Plus} from "lucide-react";
import React, { act, useState } from "react";
import { SheetContent, SheetTrigger, Sheet } from "../../components/ui/sheet";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { useIsMobile } from "../../util/useIsMobile"
import { cn } from "@/lib/utils"
import Post from "../../components/Post";
import NewPostWindow from "../../components/NewPostWindow";
import FilterSortSideBar from "../../components/FilterSortSideBar";
import { useAuth } from "@/util/authContext";
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, onSnapshot, query, addDoc, where, serverTimestamp} from "firebase/firestore";
import { db, fetchPosts, createPost, auth} from "../../config/firebase";

const CommunityPage = ({communityName, description, categories, filterOptions, sortOptions}) =>{

  const { user } = useAuth();
  const isMobile  = useIsMobile();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [posts, setPosts] = useState([]);
  const [isNewPost, setIsNewPost] = useState(false);
  const [isUserPressed, setUserPressed] = useState(null);

  
  async function handleCreatePost(post) {
    const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
    const username = userDoc.docs[0]?.data()?.username;
    const uid = userDoc.docs[0]?.data()?.uid
    try{       
      await createPost({ title: post.title, content: post.content, username: username, uid: uid, tags: post.tags, activeCategory: post.category.toLowerCase(), communityName: communityName.toLowerCase() });
      const newPosts = await fetchPosts();
      setPosts(newPosts);
     // console.log("new posts: ", newPosts)
    } catch (error) {
     // console.error("Error creating post:", error);
    }
    
  }


  // React.useEffect(() => {
  //   async function loadPosts() {
  //     const newPosts = await fetchPosts();
  //     setPosts(newPosts);
  //   //console.log("Fetched posts: ", newPosts)
  //   }
  //   loadPosts();
  // }, []);

//   React.useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       fetchPosts(activeCategory, user).then(setPosts);
//     }
//   });

//   return () => unsubscribe(); //cleanup on unmount
// }, []);

React.useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const posts = await fetchPosts(activeCategory, user);
    setPosts(posts);
  });

  return () => unsubscribe();
}, [activeCategory]);

  const filteredPosts = () =>{  
    return posts.filter((post) => {
  
      const communityMatch = post.community === communityName.toLowerCase();

      const categoryMatch = post.category && post.category.toLowerCase() === activeCategory.toLowerCase()

       //block private posts (from reflections in anxiety) from other users
      const isPrivate = post.category?.toLowerCase() === "reflections";
      const isOwnPost = post.uid === user.uid;
      if (isPrivate && !isOwnPost) return false;

      //posts match if they have at least one of the selected filters as a tag. If no filters are selected, all posts should match
      const filterMatchPosts = 
        selectedFilters.length === 0 || 
        selectedFilters.some((filter) => post.tags && post.tags.map(tag => tag.toLowerCase()).includes(filter.toLowerCase()))
      
      const filterMatchUser = !isUserPressed || post.username.trim().toLowerCase() === isUserPressed.trim().toLowerCase()
      
      // console.log("post username", post.username)
      // console.log("state username: ", isUserPressed)
      // console.log(filterMatchUser)
      // console.log("isUserPressed:", isUserPressed, typeof isUserPressed);

      return categoryMatch && filterMatchPosts && communityMatch && filterMatchUser;
    })
  } 


  //sort by newest as default, so if no sort is selected, sort by newest
    const sortedPosts = () =>{
      //console.log(filteredPosts())
    return filteredPosts().sort((a, b) =>{
      if(selectedSort === "Most Liked"){
        return b.likes - a.likes;
      } else if (selectedSort === "Most Commented"){
        return b.commentsCount - a.commentsCount;
      } else if (selectedSort === "Newest"){
        //console.log("sorting by newest: ", a.createdAt, b.createdAt)
        return b.createdAt - a.createdAt;
      } else if (selectedSort === "Oldest"){
        return a.createdAt - b.createdAt;
      } else{
        return 0;
      }})
  }

  const visiblePosts = sortedPosts();

  // visiblePosts.map((post) =>{
  //   console.log("commentsCount: ", post.commentsCount)
  // })

  const toggleFilter = (option) =>{
    setSelectedFilters((prev) =>{
      //remove if already selected, add if not selected
      return prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    })
  }

  //can only selecet one sort option at a time, so if the option is already selected, deselect it
  //if it's not selected, select it 
  const toggleSort = (option) =>{
    setSelectedSort((prev) =>{
      return prev == option ? "Newest" : option
    })
  }

  const onUserClick = (username) =>{
    setUserPressed(username);
  }

  return(
    <div className="flex flex-1 top-0">
      <main className="flex flex-col flex-1">
        <header className="sticky top-0 z-5 bg-slate-300 border-b px-7 md:px-6 py-5 pt-7 rounded-lg">

          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {communityName}
            </h1>
            <p className="mt-1">{description}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-6">
              {
                categories.map((category) =>(
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn("pb-2 text-lg transition-all border-b-2",
                    activeCategory === category ? "border-primary text-pink-800" : "border-transparent text-slate-400 hover: text-slate-100"
                    )}
                  >
                    {category}
                  </button>
                ))
              }
              </div>
              <div className="flex items-center gap-2">
                {
                  isMobile && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4"/>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-72 p-0">
                        <div className="p-4 space-y-6 pt-10">
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3">
                              Filter by
                            </h3>
                            <ScrollArea className="h-40">
                              <div className="space-y-1 pr-4">
                                {filterOptions.map((option) =>{
                                  const isSelected = selectedFilters.includes(option)
                                  return <button
                                    key={option}
                                    onClick={() => toggleFilter(option)}
                                    className={cn("w-full text-left px-3 py-2 rounded-md text-sm transition-colors", isSelected && "bg-slate-200 text-pink-800"
                                    )}
                                  >
                                    {option}
                                  </button>
                                })}
                              </div>
                            </ScrollArea>
                          </div>

                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-pink-800 mb-3">
                              Sort by
                            </h3>
                            <ScrollArea className="h-40">
                              <div className="space-y-1 pr-4">
                                {sortOptions.map((option) =>{
                                  const isSelected = selectedSort.includes(option)
                                  return <button
                                    key={option}
                                    onClick={() => toggleSort(option)}
                                    className={cn("w-full text-left px-3 py-2 rounded-md text-sm transition-colors", isSelected && "bg-slate-200 text-pink-800"
                                    )}
                                  >
                                    {option}
                                  </button>
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )
                }

                <Button
                  onClick={() => setIsNewPost(true)}
                  className="gap-2 font-semibold lg:mr-113"
                >
                  <Plus className="h-4 w-4"/>
                  <span className="hidden sm:inline">Create Post</span>
                </Button>
              </div>
            </div>
        </header>

        <div className="flex justify-center w-full px-4">
          <div className="flex min-h-screen w-full max-w-8xl gap-8">     
          <ScrollArea className="flex flex-1 p-4 md:p-4">
            
            <div className="max-w-3xl mx-auto w-full space-y-3">
              {isUserPressed && (
                <button className="cursor-pointer" onClick={() => setUserPressed(null)}>
                  Go back to main page
                </button>
              )}
              {
                visiblePosts.length > 0 ? (
                  visiblePosts.map((post) =>(
                    <Post 
                      key={post.id}
                      id={post.id} 
                      title={post.title} 
                      content={post.content}
                      username={post.username}
                      createdAt={post.createdAt}
                      likes={post.likes}
                      commentsCount={post.commentsCount}
                      tags={post.tags}
                      category={post.category}
                      onUserClick={onUserClick}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-pink-800">
                    <p>No posts in this category yet.</p>
                    <p>Be the first to create one!</p>
                  </div>
                )
              }
            </div>
          </ScrollArea>
          {/*right fixed sidebar - desktop only */}
          {!isMobile && 
            <FilterSortSideBar
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              selectedFilters={selectedFilters}
              selectedSort={selectedSort}
              changeFilters={toggleFilter}
              changeSort={toggleSort}
            />}
          </div>
        </div>
      </main>

            
      <NewPostWindow
        open={isNewPost}
        onOpenChange={setIsNewPost}
        onSubmit={handleCreatePost}
        categories={categories}
        tagOptions={filterOptions}
        activeCategory={activeCategory}
      />
    </div>
  )

}

export default CommunityPage