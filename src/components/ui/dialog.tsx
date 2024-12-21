'use client'

import React, { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-semibold">{children}</h2>
  )
}

export function DialogContent({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
      {children}
    </div>
  )
}

export function Dialog({ open, onClose, onOpenChange, children }: DialogProps): JSX.Element {
  if (!open) return <></>

  const handleClose = () => {
    onClose()
    onOpenChange?.(false)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/30" 
          onClick={handleClose}
        />
        {children}
      </div>
    </div>
  )
}

// Example usage:
/*
<Dialog open={isOpen} onClose={handleClose}>
  <DialogContent>
    <DialogTitle>Dialog Title</DialogTitle>
    <div>Dialog content goes here...</div>
  </DialogContent>
</Dialog>
*/ 