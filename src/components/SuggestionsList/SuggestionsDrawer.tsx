import { useEffect, useState } from 'react'
import BottomSheetModal from '../ModalBase/BottomSheetModal'
import type { Suggestion } from '#/types/Suggestion'
import { updateSuggestion } from '#/api/suggestions'
import { toast } from 'react-toastify'

interface SuggestionsDrawerProps {
  isOpen: boolean
  onClose: (
    edited?: boolean,
    newItemInfo?: {
      id: number
      itemName: string
      itemDescription: string
    } | null,
  ) => void
  selectedSuggestion: Suggestion | null
}

export const SuggestionsDrawer = ({
  isOpen,
  onClose,
  selectedSuggestion,
}: SuggestionsDrawerProps) => {
  const [itemName, setItemName] = useState(selectedSuggestion?.itemName ?? '')
  const [itemDescription, setItemDescription] = useState(
    selectedSuggestion?.itemDescription ?? '',
  )

  useEffect(() => {
    if (!isOpen) {
      setItemName('')
      setItemDescription('')
    } else if (selectedSuggestion) {
      setItemName(selectedSuggestion.itemName)
      setItemDescription(selectedSuggestion.itemDescription)
    }
  }, [isOpen, selectedSuggestion])

  const handleItemDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setItemDescription(e.target.value)
  }

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updateTask = updateSuggestion(
      selectedSuggestion!.id,
      itemName,
      itemDescription,
    )
    const result = await toast.promise(updateTask, {
      pending: 'Updating suggestion...',
      success: 'Suggestion updated successfully!',
      error: 'Failed to update suggestion.',
    })

    if (result) {
      onClose(true, {
        id: selectedSuggestion!.id,
        itemName,
        itemDescription,
      })
      return
    }
    onClose()
  }

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Edit Suggestion"
      desktopMaxWidth="max-w-md"
    >
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          placeholder="Item name"
          className="w-full p-2 border rounded"
          value={itemName}
          onChange={handleItemNameChange}
          autoFocus
        />
        <input
          placeholder="Item description (Optional)"
          className="w-full p-2 border rounded"
          value={itemDescription}
          onChange={handleItemDescriptionChange}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="w-full bg-destructive p-2 border border-border rounded hover:bg-muted transition-colors"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            disabled={!itemName.trim()}
            type="submit"
            className="w-full p-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            Update
          </button>
        </div>
      </form>
    </BottomSheetModal>
  )
}

export default SuggestionsDrawer
