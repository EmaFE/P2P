import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from './ui/dialog';
import React from 'react'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';

const NewPostWindow = ({ open, onOpenChange, onSubmit, categories, tagOptions, activeCategory}) =>{

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState(activeCategory);
  const [tags, setTags] = React.useState([]);


  const handleSubmit = () =>{
    if(title.trim() != "" && content.trim() != "" && category){
      onSubmit({title: title.trim(), content: content.trim(), category: category, tags: tags})
      setTitle("")
      setContent("")
      setCategory("")
      setTags([])
      onOpenChange(false)
    } else if(!category){
      toast.error("Please select a category.");
    } else if (!title.trim() || !content.trim()){
      toast.error("Title and content cannot be empty.");
    }
  }

  //if tag is already selected, deselect it, otherwise select it; multiple tags can be selected
  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  console.log(activeCategory)


  return(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent classname="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle classname="text-xl font-bold">
            Create Post
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4 max-w-md max-h-screen'>
          <div className='space-y-2'>
            <label>Title*</label>
            <Input
              id="title"
              placeholder="Enter post title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
            <div className="space-y-2 max-w-md max-h-screen">
              <label>Content*</label>
              <Textarea
                id="content"
                placeholder="Enter post content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className=" w-full resize-none max-h-60 overflow-y-auto     whitespace-pre-wrap break-words box-border border rounded-md p-2"
              />
            </div>
            
            {/* add radiobox component to select category*/}
            <div>
              <label>Category*</label>
              <RadioGroup
                className="mt-2"
                
                onValueChange={(val) => setCategory(val)}
                defaultValue={activeCategory}
              >
                {categories.map((cat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <RadioGroupItem value={cat} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{cat}</Label>
                  </div>
                ))}
              </RadioGroup>

            </div>

            {/* add tags with popover + checkbox components */}
            <div>
              <label className='mr-3'>Tags</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button>{tags.join(", ") || "Select tags"}</Button>
                </PopoverTrigger>
                <PopoverContent>
                  {tagOptions.map(tag => (
                    <div key={tag} className="flex items-center gap-2 py-1">
                      <Checkbox
                        checked={tags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <span>{tag}</span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            
          </div>

        <DialogFooter>
          <Button 
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            Post
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default NewPostWindow;