import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { getRelativeTime } from "@/lib/relative-time";

export default function ReplyWindow({ comment, onClose, onSubmit }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText("");
    onClose();
  };

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" >
      <div className="w-full max-w-lg mx-4 flex flex-col rounded-xl border border-border bg-card shadow-lg max-h-[80vh]" onClick={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-5 w-5 text-foreground" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4">
          <div className="min-w-0 flex-1 pb-4">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-semibold text-foreground">@{comment.username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{getRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="mt-[3px] text-sm pl-4 text-card-foreground">{comment.status !== "active" ? "[ Content has been removed by the user or a moderator ] " : comment.content}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Replying to <span className="text-primary">@{comment.username}</span>
            </p>
          </div>

        {/* Reply input */}
        
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Post your reply"
            rows={3}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
          <ImagePlus className="h-5 w-5" />
        </Button>
        <Button
          size="sm"
          disabled={!text.trim()}
          onClick={handleSubmit}
          className="rounded-full px-5"
        >
          Comment
        </Button>
      </div>
      </div>
    </div>
  );
}
