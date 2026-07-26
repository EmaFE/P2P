
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Database, UserCog,TriangleAlert, ScrollText, FileLock2, RefreshCw, UserCheck, BookOpen } from "lucide-react";

const sections = [
  {
    icon: UserCheck,
    colors: "bg-blue-50 text-blue-700",
    number: "1",
    title: "Acceptance",
    body: "By creating an account or using this platform you agree to these terms. If you do not agree, you  cannot use the platform.",
  },
  {
    icon: BookOpen,
    number: "2",
    colors: "bg-amber-50 text-amber-700",
    title: "Who can use this platform",
    body: "You must be at least 16 years old to register. By signing up you confirm that the information you provide is accurate and that you are not prohibited from using the platform under applicable law.",
  },
  {
    icon: Database,
    number: "3",
    colors: "bg-green-50 text-green-700",
    title: "Data storage & infrastructure",
    body: "Your data, including account details, posts, and activity, is stored securely on Google Firebase. Firebase infrastructure is governed by Google's security and compliance standards. Data may be stored on servers located outside your country of residence.",
  },
  {
    icon: FileLock2,
    number: "4",
    colors: "bg-teal-50 text-teal-700",
    title: "Data use & privacy",
    body: "We collect only the data necessary to operate and improve the platform. Your personal data will never be sold, rented, or shared with third parties for commercial purposes. We may share data only when required by law or to protect the safety of our users.",
  },
  {
    icon: UserCog,
    number: "5",
    colors: "bg-rose-50 text-rose-700",
    title: "Account & moderation",
    body: "Platform administrators have the authority to suspend, restrict, or permanently remove any account that violates these terms or our community guidelines. Administrators may also edit or delete content where necessary to maintain a safe environment. You may request deletion of your account and associated data at any time by contacting support. Deletion is processed within 30 days.",
  },
  {
    icon: ShieldCheck,
    number: "6",
    colors: "bg-green-50 text-green-700",
    title: "Your responsibilities",
    body: "You are responsible for keeping your login credentials confidential. You agree not to impersonate others, post harmful or illegal content, or attempt to interfere with the platform's operation.",
  },
  {
    icon: ScrollText,
    number: "7",
    colors: "bg-rose-50 text-rose-700",
    title: "Intellectual property",
    body: "Content you post remains yours. By posting you grant us a limited licence to display it within the platform. We do not claim ownership of your content.",
  },
  {
    icon: TriangleAlert,
    number: "8",
    colors: "bg-amber-50 text-amber-700",
    title: "Disclaimers",
    body: "This platform provides peer support and is not a substitute for professional medical, psychological, or legal advice. We are not liable for the accuracy of user-generated content or for decisions made based on it.",
  },
  {
    icon: RefreshCw,
    number: "9",
    colors: "bg-violet-50 text-violet-700",
    title: "Changes to these terms",
    body: "We may update these terms from time to time. If changes are significant, we will notify you via email or an in-app notice. Continued use after notification constitutes acceptance.",
  },
]

export default function TermsAndConditions({ open, onOpenChange }) {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/10"/>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">

          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Terms and Conditions
                </DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Last updated: June 2026
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[380px]">
            <ul className="divide-y px-6">
              {sections.map((section) => (
                <li key={section.number} className="flex gap-3 py-4">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${section.colors}`}
                  >
                    <section.icon size={15}/>
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      <span className="mr-1.5">{section.number}.</span>
                      {section.title}
                    </p>
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
   
  )
}