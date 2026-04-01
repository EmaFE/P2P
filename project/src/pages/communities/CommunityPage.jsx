import { Filter, Plus} from "lucide-react";
import React, { useState } from "react";
import { SheetContent, SheetTrigger, Sheet } from "../../components/ui/sheet";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { useIsMobile } from "../../util/useIsMobile"
import { cn } from "@/lib/utils"
import Post from "../../components/Post";
import NewPostWindow from "../../components/NewPostWindow";
import FilterSortSideBar from "../../components/FilterSortSideBar";
import { useAuth } from "@/util/authContext";
import { serverTimestamp, addDoc, collection, getDocs} from "firebase/firestore";
import { db } from "../../config/firebase";

const CommunityPage = ({communityName, description, categories, filterOptions, sortOptions}) =>{

  const mocks = [
  { title: "Welcome to our community!", content: "We're so glad to have you here. Feel free to introduce yourself and share your story with others who understand.", username: "user1", likes: 1, tags: ["introduction"], category: "General" },
  {title: "Tips for managing daily challenges", content: "Here are some strategies that have helped me: taking breaks when needed, practicing mindfulness, and reaching out to supportive friends.", username: "user2", tags: ["tips", "challenges"], category: "Reflections" },
  {title: "Weekly check-in thread", content: "How is everyone doing this week? Share your wins, struggles, or just say hi!", username: "user3", likes: 2, comments:[], tags: ["check-in", "weekly"], category: "General" },
  { title: "Resource recommendations", content: "I found this amazing book that really helped me understand my journey better. Has anyone else found helpful resources they'd like to share?", username: "user4", tags: ["resources", "books"], category: "Advice" },
  { title: "Celebrating small victories", content: "Today I managed to complete a task I'd been avoiding for weeks. It feels great! What small wins are you celebrating?", username: "user5", tags: ["celebration", "victories", "wins", "accomplishments", "success", "motivation", "wins", "accomplishments", "success", "motivation"], category: "General" },
];

const seedPosts = async () => {
  try {
    const postsRef = collection(db, "posts");

    for (let post of mocks) {
      await addDoc(postsRef, {
        id: Date.now() + Math.random(),
        username: post.username,
        title: post.title,
        content: post.content,
        likes: 0,
        comments: [],
        tags: post.tags,
        category: post.category,
        createdAt: serverTimestamp(),
        reported: false,
      });
    }

    console.log("10 mock posts added!");
  } catch (error) {
    console.error("Error adding posts:", error);
  }
};


// React.useEffect(() => {
//   seedPosts();
// }, []);


const showPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef); 
    const postsData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      firestoreId: doc.id, //include Firestore document ID
    }));
    return postsData;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};


  const { user } = useAuth();

  const isMobile  = useIsMobile();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [posts, setPosts] = useState([]);
  const [isNewPost, setIsNewPost] = useState(false);

  // const filteredPosts = posts.filter(
  //   (post) => post.category.toLowerCase() === activeCategory.toLowerCase() || []
  // )

  //to make posts an array, not a promise, we need to use useEffect to fetch the posts on component mount and set them in state. Then we can filter the posts based on the active category and selected filters/sort options.
  React.useEffect(() => {
    const fetchPosts = async () => {
      const data = await showPosts();
      setPosts(data);
    };

    fetchPosts();
  }, []);

   const filteredPosts = () =>{  
     return posts.filter((post) => {
      const categoryMatch = post.category && post.category.toLowerCase() === activeCategory.toLowerCase()
      
      //i want posts to match if they have at least one of the selected filters as a tag. If no filters are selected, all posts should match
      console.log("selected filters: " + selectedFilters)
      const filterMatch = selectedFilters.length === 0 || selectedFilters.some((filter) => post.tags && post.tags.map(tag => tag.toLowerCase()).includes(filter.toLowerCase()))

      return categoryMatch && filterMatch;
    })
  }

  //not correct 
  //only one sort, cus now i can select more than one
  //sort by newest as default, so if no sort is selected, sort by newest
  const sortedPosts = () =>{
    return filteredPosts().sort((a, b) =>{
      if(selectedSort === "Most Liked"){
        return b.likes - a.likes;
      } else if (selectedSort === "Most Commented"){
        return b.comments - a.comments;
      } else if (selectedSort === "Newest"){
       // console.log("sort" + selectedSort)
        // filteredPosts().forEach(post => console.log("post: " + post.title + " createdAt: " + post.createdAt))
       // console.log(filteredPosts().map(p => p.createdAt.toDate()));
        return b.createdAt.toDate() - a.createdAt.toDate();
      } else if (selectedSort === "Oldest"){
        return a.createdAt.toDate() - b.createdAt.toDate();
      } else{
        return 0;
      }})
  }

  //suggestion - look into it !!!
  //to avoid sorting and filtering on every render, we can use useMemo to memoize the sorted and filtered posts. This way, they will only be recalculated when the dependencies (posts, activeCategory, selectedFilters, selectedSort) change.  
 // const memoizedFilteredPosts = React.useMemo(() => filteredPosts(), [posts, activeCategory, selectedFilters]);
  const visiblePosts = sortedPosts();

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
      //remove if already selected, add if not selected
      return prev == option ? "Newest" : option
    })
  }

  {/*come back to this*/}
  const handleCreatePost = async (post) =>{
    const currUser = await setDoc(doc(db, "users", user.uid))
    const newPost = {
      id: Date.now() + Math.random(),
      username: currUser.username,
      title: post.title,
      content: post.content,
      likes: 0,
      comments: [],
      tags: post.tags,
      category: activeCategory,
      createdAt: serverTimestamp(),
      reported: false,
    }
    setPosts([newPost, ...posts]);
  }

  return(
    <div className="flex flex-1 top-0">
      <main className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 bg-slate-300 border-b px-7 md:px-6 py-5 pt-7 rounded-lg">

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
              {
                visiblePosts.length > 0 ? (
                  visiblePosts.map((post) =>(
                    <Post 
                      key={post.firestoreId}
                      id={post.firestoreId} 
                      title={post.title} 
                      content={post.content}
                      username={post.username}
                      createdAt={post.createdAt}
                      likes={post.likes}
                      comments={post.comments}
                      tags={post.tags}
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
          {/*right sidebar - desktop only */}
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
      />
    </div>
  )

}

export default CommunityPage