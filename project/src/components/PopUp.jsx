import React from 'react'
import { Card, CardHeader } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
const PopUp = ({onClose, title, text}) =>{
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/10"/>

      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">

          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-sm mt-1">{text}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="py-3"/>

        </DialogContent>
      </Dialog>
    </>
  
  );
}

export default PopUp