import BottomSheetModal from '#/components/ModalBase/BottomSheetModal'
import type { ListEntry } from '#/types/ListEntry'
import { useEffect, useState } from 'react'

interface ListEntryItemInfoDrawerProps {
  isOpen: boolean
  onClose: () => void
  entry?: ListEntry
  updateEntry: (entry: ListEntry) => void
}

export const ListEntryItemInfoDrawer = ({
  isOpen,
  onClose,
  entry,
  updateEntry,
}: ListEntryItemInfoDrawerProps) => {
  const [itemName, setItemName] = useState(entry?.itemName || '')
  const [itemDescription, setItemDescription] = useState(
    entry?.itemDescription || '',
  )
  const [itemQuantity, setItemQuantity] = useState(entry?.itemQuantity || null)

  useEffect(() => {
    if (entry) {
      setItemName(entry.itemName)
      setItemDescription(entry.itemDescription)
      setItemQuantity(entry.itemQuantity)
    }
  }, [entry])

  if (!entry) return null

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value)
  }

  const handleItemDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setItemDescription(e.target.value)
  }

  const handleItemQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0 || isNaN(Number(e.target.value))) return
    setItemQuantity(Number(e.target.value))
  }

  const handleConfirm = () => {
    const updatedEntry = {
      ...entry,
      itemName: itemName,
      itemDescription: itemDescription,
      itemQuantity: itemQuantity,
    }

    updateEntry(updatedEntry)
    onClose()
  }

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={entry.itemName + ' Details'}
    >
      <div className="p-4">
        <input
          className="text-lg font-bold mb-2"
          value={itemName}
          onChange={handleItemNameChange}
        />
        <textarea
          className="w-full mb-2"
          value={itemDescription}
          onChange={handleItemDescriptionChange}
        />
        <input
          type="number"
          className="w-full mb-4"
          value={itemQuantity?.toString() || ''}
          onChange={handleItemQuantityChange}
        />
        <button
          disabled={itemName.trim().length === 0}
          onClick={handleConfirm}
          className="px-4 py-2 bg-primary text-content rounded"
        >
          Confirm
        </button>
      </div>
    </BottomSheetModal>
  )
}
