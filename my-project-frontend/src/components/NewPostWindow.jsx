import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from './ui/dialog';
import React from 'react'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

const NewPostWindow = ({ open, onOpenChange, onSubmit}) =>{

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const handleSubmit = () =>{
    if(title.trim() && content.trim()){
      onSubmit({title: title.trim(), content: content.trim()})
      setTitle("")
      setContent("")
      onOpenChange(false)
    }
  }

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
            <label>Title</label>
            <Input
              id="title"
              placeholder="Enter post title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
            <div className="space-y-2 max-w-md max-h-screen">
            <label>Content</label>
            <Textarea
              id="content"
              placeholder="Enter post title here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className=" w-full resize-none max-h-60 overflow-y-auto     whitespace-pre-wrap break-words box-border border rounded-md p-2"
            />
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