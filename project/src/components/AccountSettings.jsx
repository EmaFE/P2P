
// import React from "react";

// export function AccountSettings () {

//   return(
//     <div>Account Settings</div>
//   )
// }



import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ChevronDown, Check, Loader } from "lucide-react";
import { toast } from "sonner";
import { reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail, getAuth, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";


function UpdateEmail({ user }) {
  const [open, setOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [loadingInput, setloadingInput] = useState(false);  
  const [currentPassword, setCurrentPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState(false);


  const handleVerifyEmail = () => {
    if (currentEmail.trim().toLowerCase() === user.email?.toLowerCase()) {
      setVerifiedEmail(true);
    }
  };

  const reauthenticate = async () => {
    if(!currentPassword.trim()) return;
    setloadingInput(true);
    try{
      const credential = EmailAuthProvider.credential(user.email, currentPassword.trim());
      await reauthenticateWithCredential(user, credential);
      setVerifiedPassword(true);
      console.log("reauth")
    } catch(error){
      console.log(error)
    } finally {
      setloadingInput(false);
    }
  }

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) return;
    setloadingInput(true);
    
    try{
      await verifyBeforeUpdateEmail(user, newEmail.trim());
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { email: newEmail.trim() });
      toast.success("Email updated!");
      setOpen(false);
      setVerifiedEmail(false);
      setVerifiedPassword(false);
      setCurrentPassword("");
      setCurrentEmail("");
      setNewEmail("");
    } catch (error) {
      console.log("error updating email: ", error);
      toast.error("Could not update email");
    } finally {
      setloadingInput(false);
    }
  };

  //everytime the colappsable element reopens, these inputs will be empty
  const checkNewVal = (newVal) =>{
    if(!newVal){
      setVerifiedEmail(false);
      setCurrentEmail("");
      setNewEmail("");
    }
  };

  return (
    <Collapsible open={open} onOpenChange={(newVal) => { setOpen(newVal);  checkNewVal(newVal);}}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground hover:bg-accent/50 transition-colors">
        <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Update Email</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1 rounded-lg border border-border bg-card p-2">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Current Email</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="email"
              placeholder="your@email.com"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              disabled={verifiedEmail}
            />
            {verifiedEmail ? (
              <Check className="h-5 w-5 text-primary self-center shrink-0" />
            ): <Button size="sm" onClick={handleVerifyEmail} className="shrink-0">Verify</Button>}
          </div>
        </div>
        {verifiedEmail && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Current Password</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={verifiedPassword}
              />
              {verifiedPassword ? (
                <Check className="h-5 w-5 text-primary self-center shrink-0" />
              ) : <Button size="sm" onClick={reauthenticate} disabled={loadingInput} className="shrink-0">
                  {loadingInput ? <Loader className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button> }
            </div>
        </div>
        )}
        {verifiedPassword && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            <label className="text-xs font-medium text-muted-foreground">New Email</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="new@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button size="sm" onClick={handleUpdateEmail} disabled={loadingInput} className="shrink-0">
                {loadingInput ? <Loader className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </div>
        )}
        
      </CollapsibleContent>
    </Collapsible>
  );
}

function ChangePassword({ user }) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingInput, setloadingInput] = useState(false);


  const reauthenticate = async () => {
    if(!currentPassword.trim()) return;
    setloadingInput(true);
    try{
      const credential = EmailAuthProvider.credential(user.email, currentPassword.trim());
      await reauthenticateWithCredential(user, credential);
      setVerifiedPassword(true);
      console.log("reauth")
    } catch(error){
      console.log(error)
    } finally {
      setloadingInput(false);
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.message("Password too short", {description: "Must be at least 6 characters." });
      return;
    }
    setloadingInput(true);
    
    try{
      await updatePassword(getAuth().currentUser, newPassword);
      toast("Password updated!");
      setOpen(false);
      setVerifiedPassword(false);
      setConfirmPassword("");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      toast.error("password not updated.")
    } finally {
      setloadingInput(false);
    }
  };

  //everytime the colappsable element reopens, these inputs will be empty
  const checkNewVal = (newVal) =>{
    if(!newVal){
      setVerifiedPassword(false);
      setConfirmPassword("");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <Collapsible open={open} onOpenChange={(newVal) => { setOpen(newVal); checkNewVal(newVal); }}>
      <CollapsibleTrigger open={open} onOpenChange={(newVal) => { setOpen(newVal); checkNewVal(newVal); }} className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground hover:bg-accent/50 transition-colors">
        <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-muted-foreground" /> Change Password</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1 rounded-lg border border-border bg-card p-2">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Current Password</label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={verifiedPassword}
            />
            {verifiedPassword ? (
              <Check className="h-5 w-5 text-primary self-center shrink-0" />
            ) : <Button size="sm" onClick={reauthenticate} disabled={loadingInput} className="shrink-0">
                {loadingInput ? <Loader className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button> }
          </div>
        </div>
        {verifiedPassword && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdatePassword} disabled={loadingInput} className="w-full">
              {loadingInput ? <Loader className="h-4 w-4 animate-spin" /> : "Update Password"}
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

  export default function AccountSettings({ user }) {
  return (
    <div className="space-y-3">
      <div>Account Settings</div>
      <UpdateEmail user={user}/>
      <ChangePassword user={user}/>
    </div>
  );
}
