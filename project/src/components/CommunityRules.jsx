
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Users, Ear, Shield, TriangleAlert,  MessageCircleMore, ThumbsUp } from "lucide-react";

const rules = [
  {
    icon: Heart,
    colors: "bg-teal-50 text-teal-700",
    title: "Treat everyone with respect",
    desc: "Speak to others as you'd want to be spoken to on your hardest day. Disagreement is fine, cruelty is not.",
  },
  {
    icon: Users,
    colors: "bg-blue-50 text-blue-700",
    title: "Embrace inclusiveness",
    body: "This community welcomes everyone regardless of background, identity, ability, or experience. Discrimination is not tolerated.",
  },
  {
    icon: Ear,
    colors: "bg-violet-50 text-violet-700",
    title: "Listen before you respond",
    body: "Not every post is asking for advice. Sometimes people just need to feel heard. Ask before offering solutions.",
  },
  {
    icon: TriangleAlert,
    colors: "bg-amber-50 text-amber-700",
    title: "Do not give harmful advice",
    body: "Share lived experience freely, but avoid medical, legal, or psychological advice beyond your qualifications.",
  },
  {
    icon: Shield,
    colors: "bg-rose-50 text-rose-700",
    title: "No harassment or hate speech",
    body: "Threats, slurs, and targeted harassment are grounds for immediate removal; no exceptions.",
  },
  {
    icon: MessageCircleMore,
    colors: "bg-green-50 text-green-700",
    title: "Use content warnings thoughtfully",
    body: "Add a warning if your post covers sensitive topics like grief, trauma, or mental health crises.",
  },
  {
    icon: ThumbsUp,
    colors: "bg-teal-50 text-teal-700",
    title: "Stay honest and authentic",
    body: "Don't impersonate others or spread misinformation. Authentic voices are what make peer support meaningful.",
  },
];

export default function CommunityRules({ open, onOpenChange }) {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/10"/>

      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">

          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
              Community Rules
            </p>
            <DialogTitle className="text-xl font-semibold">
              Our community is built on kindness, respect, and support. Let's keep it that way.
            </DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Please read and agree to these rules before participating in our support community.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[360px]">
            <ul className="divide-y px-6">
              {rules.map((section) => (
                <li key={section.title} className="flex gap-3 py-4">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${section.colors}`}
                  >
                    <section.icon size={15} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{section.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {section.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>

          <DialogFooter className="py-3"/>

        </DialogContent>
      </Dialog>
    </>
   
  );
}
