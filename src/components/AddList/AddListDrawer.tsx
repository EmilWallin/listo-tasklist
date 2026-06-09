import { useEffect, useState } from 'react'
import { createList } from '#/api/lists'
import { useLists } from '#/stores/ListsStore'
import { toast } from 'react-toastify'
import BottomSheetModal from '../ModalBase/BottomSheetModal'

interface AddListDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const AddListDrawer = ({ isOpen, onClose }: AddListDrawerProps) => {
  const [listName, setListName] = useState('')
  const [listDescription, setListDescription] = useState('')
  const { addList } = useLists()

  useEffect(() => {
    if (!isOpen) {
      setListName('')
      setListDescription('')
    }
  }, [isOpen])

  const handleCreateList = async () => {
    const creationPromise = createList(listName, listDescription)

    toast.promise(creationPromise, {
      pending: 'Creating list...',
      success: 'List created successfully!',
      error: 'Failed to create list.',
    })

    const response = await creationPromise

    if (response) {
      onClose()
    } else {
      // Handle error (e.g., show a notification)
      console.error('Failed to create list')
    }
  }

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New List"
      desktopMaxWidth="max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">Add New List</h2>
      <input
        type="text"
        placeholder="List Name"
        onChange={(e) => setListName(e.target.value)}
        value={listName}
        className="mb-4 p-2 border border-border rounded-md w-full"
      />
      <input
        type="text"
        placeholder="List Description"
        onChange={(e) => setListDescription(e.target.value)}
        value={listDescription}
        className="mb-4 p-2 border border-border rounded-md w-full"
      />
      <div className="flex justify-between gap-2">
        <button
          className="bg-destructive text-white px-4 py-2 w-full rounded-md"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          disabled={listName === ''}
          className=" text-white w-full px-4 py-2 rounded-md"
          onClick={handleCreateList}
        >
          Create List
        </button>
      </div>
    </BottomSheetModal>
  )
}
