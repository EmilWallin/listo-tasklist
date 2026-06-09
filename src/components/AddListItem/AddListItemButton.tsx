import { useState } from 'react'
import { AddListItemDrawer } from './AddListItemDrawer'

interface AddListItemProps {
  parentId: number
}

export const AddListItemButton = ({ parentId }: AddListItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      <button
        className="p-2 bg-primary hover:bg-secondary transition-colors cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        Add Item!
      </button>
      <AddListItemDrawer
        parentId={parentId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
