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

const CommunityPage = ({communityName, description, categories, filterOptions, sortOptions}) =>{

  const mocks = [
  { id: 1, title: "Welcome to our community!", content: "We're so glad to have you here. Feel free to introduce yourself and share your story with others who understand.", category: "General" },
  { id: 2, title: "Tips for managing daily challenges", content: "Here are some strategies that have helped me: taking breaks when needed, practicing mindfulness, and reaching out to supportive friends.", category: "Reflections" },
  { id: 3, title: "Weekly check-in thread", content: "How is everyone doing this week? Share your wins, struggles, or just say hi!", category: "General" },
  { id: 4, title: "Resource recommendations", content: "I found this amazing book that really helped me understand my journey better. Has anyone else found helpful resources they'd like to share?", category: "Advice" },
  { id: 5, title: "Celebrating small victories", content: "Today I managed to complete a task I'd been avoiding for weeks. It feels great! What small wins are you celebrating?", category: "General" },
];

  const isMobile  = useIsMobile();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState([]);
  const [posts, setPosts] = useState(mocks);
  const [isNewPost, setIsNewPost] = useState(false);

  // const filteredPosts = posts.filter(
  //   (post) => post.category.toLowerCase() === activeCategory.toLowerCase() || []
  // )

   const filteredPosts = () =>{
    console.log("active category: " + activeCategory)
    posts.map((post) =>{
      console.log("post category: " + post.category)
    })
    
    return posts.filter((post) => post.category.toLowerCase() === activeCategory.toLowerCase())
  }

  const toggleFilter = (option) =>{
    setSelectedFilters((prev) =>{
      return prev.includes(option) ? prev.filter((item => item !== option)) : [...prev, option]
    })
  }

  const toggleSort = (option) =>{
    setSelectedSort((prev) =>{
      return prev.includes(option) ? prev.filter((item => item !== option)) : [...prev, option]
    })
  }

  {/*come back to this*/}
  const handleCreatePost = (post) =>{
    const newPost = {
      id: posts.length + 1,
      title: post.title,
      content: post.content,
      category: activeCategory,
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

        <div className="flex">      
        <ScrollArea className="flex flex-1 p-4 md:p-6">
          
          <div className="max-w-3xl">
            {
              filteredPosts().length > 0 ? (
                filteredPosts().map((post) =>(
                  <Post key={post.id} title={post.title} content={post.content}/>
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
        {/* Right Sidebar - Desktop Only */}
     {!isMobile && 
      <FilterSortSideBar
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        selectedFilters={selectedFilters}
        selectedSort={selectedSort}
        changeFilters={setSelectedFilters}
        changeSort={setSelectedSort}
      />}
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