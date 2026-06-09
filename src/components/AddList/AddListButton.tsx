import { useState } from 'react'
import { AddListDrawer } from './AddListDrawer'

const AddListButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button className="text-md" onClick={() => setIsModalOpen(true)}>
        Add List
      </button>
      <AddListDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export { AddListButton }
