import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AddListItemDrawer } from './AddListItemDrawer'

interface AddListItemProps {
  parentId: number
}

const AddListItem = ({ parentId }: AddListItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      <div
        className="p-2 rounded-full bg-primary hover:bg-secondary transition-colors cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Plus height={40} width={40} />
      </div>
      <AddListItemDrawer
        parentId={parentId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}

export { AddListItem }
