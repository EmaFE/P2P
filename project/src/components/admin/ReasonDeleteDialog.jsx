
import React from 'react'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'


export default function ReasonDialog({ open, onOpenChange, title, description, confirmText, onConfirm}){

  const [reason, setReason] = React.useState("");

  const handleConfirm = () =>{
    console.log("Confirming with reason: ", reason)
    onConfirm(reason)
    setReason("")
    onOpenChange()
  }

  return(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Reason for action"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[80px]"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button 
            variant="destructive" 
            disabled={!reason.trim()} 
            onClick={handleConfirm}
            >
              {confirmText}
            </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}