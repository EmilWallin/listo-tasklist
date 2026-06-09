import { useState } from 'react'
import { AddListDrawer } from './AddListDrawer'
import { Plus } from 'lucide-react'

export const AddListPlusButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <div
        className="p-2 rounded-full bg-primary hover:bg-secondary transition-colors cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Plus height={40} width={40} />
      </div>
      <AddListDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
