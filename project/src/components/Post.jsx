
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, MoreHorizontal, Bookmark, Flag, Share2 } from "lucide-react";
import { getRelativeTime } from "../lib/relative-time";
import { toggleLikePost, reportPost, db } from "../config/firebase";

//import { useToast } from "../components/ui/use-toast";

const MAX_CONTENT_LENGTH = 200;
const MAX_VISIBLE_TAGS = 3;
const TAG_EXPAND_THRESHOLD = 4;

export default function Post({ id, title, content, username, createdAt, likes, comments, tags }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  //const { toast } = useToast();

  const needsTruncation = content.length > MAX_CONTENT_LENGTH;
  const displayContent = !expanded && needsTruncation ? content.slice(0, MAX_CONTENT_LENGTH) + "…" : content;
  const needsTagExpand = tags.length > TAG_EXPAND_THRESHOLD ? true : false;
  const visibleTags = tagsExpanded ? tags : tags.slice(0, MAX_VISIBLE_TAGS);

  const handleLike = async () => {
    const prevLiked = liked;
    const newLiked = !liked;

    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    try {
      console.log("post id from Post.jsx: " + id)
      await toggleLikePost(id, prevLiked);
    } catch (error) {
      setLiked(prevLiked);
      setLikeCount((prev) => prev + (newLiked ? 1 : -1));
      console.log("Failed to update like status");
      console.log(error);
    }
  };

  const handleReport = async () => {
    try {
      await reportPost(id);
      console.log("Thank you for helping keep the community safe.");
     // toast({ title: "Post reported", description: "Thank you for helping keep the community safe." });
    } catch {
      console.log("failed to report post")
    //  toast({ title: "Error", description: "Failed to report post.", variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-card-foreground">{title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{getRelativeTime(createdAt)}</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">@{username}</span>
        </div> 
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-card-foreground leading-relaxed">
          {displayContent}
          {needsTruncation && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="ml-1 text-sm font-medium text-primary hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5 px-2" onClick={handleLike}>
            <Heart
              className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
            />
            <span className="text-xs text-muted-foreground">{likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5 px-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{comments}</span>
          </Button>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setBookmarked((prev) => !prev)}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" /> Report Post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    //toast({ title: "Link copied!" });
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {needsTagExpand && !tagsExpanded && (
              <button
                onClick={() => setTagsExpanded(true)}
                className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                +{tags.length - MAX_VISIBLE_TAGS}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}