import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
const PopUp = ({onClose, title, text, button1Text = null, button1Action = null, button2Text = null, button2Action = null, button3Text = null, button3Action = null}) =>{
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/10"/>

      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">

          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-sm mt-1">{text}</DialogDescription>
          </DialogHeader>

          {button1Text && <DialogFooter className=" flex items-center justify-between border-t px-4 py-3">
            {button1Text && (
              <button
                className="px-4 py-2 bg-[var(--color-six)] text-white rounded-lg hover:bg-[var(--color-secondary)]"
                onClick={button1Action}
              >
                {button1Text}
              </button>
            )}
            {button2Text && (
              <button
                className="px-4 py-2 bg-[var(--color-six)] text-white rounded-lg hover:bg-[var(--color-secondary)]"
                onClick={button2Action}
              >
                {button2Text}
              </button>
            )}
            {button3Text && (
              <button
                className="px-4 py-2 bg-[var(--color-six)] text-white rounded-lg hover:bg-[var(--color-secondary)]"
                onClick={button3Action}
              >
                {button3Text}
              </button>
            )}
          </DialogFooter>}

        </DialogContent>
      </Dialog>
    </>

  )
}

export default PopUp