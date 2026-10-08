import type { ListEntry, ListEntryDTO } from '#/types/ListEntry'
import { useEffect, useState } from 'react'
import BottomSheetModal from '../ModalBase/BottomSheetModal'
import { createListEntry, updateListEntry } from '#/api/listEntries'
import { toast } from 'react-toastify'
import { useLists } from '#/stores/ListsStore'
import { generateKeyBetween } from 'jittered-fractional-indexing'
import { ComboBox } from '../ComboBox/ComboBox'
import { getSuggestions } from '#/api/suggestions'
import type { Suggestion } from '#/types/Suggestion'

interface AddListItemDrawerProps {
  parentId: number
  isOpen: boolean
  onClose: () => void
}

export const AddListItemDrawer = ({
  parentId,
  isOpen,
  onClose,
}: AddListItemDrawerProps) => {
  const [itemName, setItemName] = useState('')
  const [comboValue, setComboValue] = useState<string | undefined>(undefined)
  const [itemDescription, setItemDescription] = useState('')
  const [itemQuantity, setItemQuantity] = useState<number | undefined>(
    undefined,
  )
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    if (!isOpen) {
      setItemName('')
      setComboValue(undefined)
      setItemDescription('')
      setItemQuantity(undefined)
      setSuggestions([])
    }
  }, [isOpen])

  const { addListEntry, lists } = useLists()
  const currentList = lists.find((l) => l.id === parentId)
  const lastPosition =
    [...(currentList?.items ?? [])]
      .sort((a, b) => {
        if (a.position === null) return 1
        if (b.position === null) return -1
        return a.position < b.position ? -1 : 1
      })
      .at(-1)?.position ?? null

  const handleItemDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setItemDescription(e.target.value)
  }

  const handleItemQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (!value || Number(value) < 0 || isNaN(Number(value))) return

    setItemQuantity(Number(value))
  }

  const createCurrentTask = async (item?: Suggestion) => {
    const newEntry = {
      parent_id: parentId,
      item_name: item?.itemName ?? itemName,
      item_description: item?.itemDescription ?? itemDescription,
      item_quantity: itemQuantity,
      position: generateKeyBetween(lastPosition, null),
    } as ListEntryDTO

    const task = createListEntry(newEntry)
    toast.promise(task, {
      pending: 'Creating list entry...',
      error: 'Failed to create list entry.',
    })
    const resultEntry = await task

    if (resultEntry) {
      addListEntry(parentId, resultEntry)
      onClose()
    } else {
      toast.error('Failed to create list entry.')
    }
  }

  const handleCreate = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const existingItem = currentList?.items.find(
      (item) => item.itemName.toLowerCase() === itemName.trim().toLowerCase(),
    )

    if (existingItem) {
      if (existingItem.completed) {
        const updateTask = updateListEntry({
          ...existingItem,
          completed: false,
        })
        toast.promise(updateTask, {
          pending: 'Updating list entry...',
          error: 'Failed to update list entry.',
        })
        await updateTask
      }
      onClose()
      return
    }

    await createCurrentTask()
  }

  const handleQueryChange = async (query: string) => {
    setItemName(query)
    setComboValue(undefined)
    const incomingSuggestions = await getSuggestions(query)
    setSuggestions(incomingSuggestions)
  }

  const handleComboChange = (value: string | undefined) => {
    if (value === undefined) {
      setItemName('')
      setComboValue(undefined)
    } else {
      const match = suggestions.find((s) => s.id === Number(value))
      setItemName(match?.itemName ?? '')
      setItemDescription(match?.itemDescription ?? '')
      setComboValue(value)
    }
  }

  const handleItemSelected = async (value: string | undefined) => {
    if (value === undefined) return

    const match = suggestions.find((s) => s.id === Number(value))
    setItemName(match?.itemName ?? '')
    setItemDescription(match?.itemDescription ?? '')
    setComboValue(value)

    const existingItem = currentList?.items.find(
      (item) => item.itemName.toLowerCase() === itemName.trim().toLowerCase(),
    )

    if (existingItem) {
      if (existingItem.completed) {
        const updateTask = updateListEntry({
          ...existingItem,
          completed: false,
        })
        toast.promise(updateTask, {
          pending: 'Updating list entry...',
          error: 'Failed to update list entry.',
        })
        await updateTask
      }
      onClose()
      return
    }

    await createCurrentTask(match)
  }

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add List Item"
      desktopMaxWidth="max-w-md"
    >
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <ComboBox
          options={suggestions.map((s) => ({
            label: s.itemName,
            value: s.id.toString(),
          }))}
          value={comboValue}
          onChange={handleComboChange}
          onQueryChange={handleQueryChange}
          onItemSelected={handleItemSelected}
          displayValue={itemName}
          placeholder="Enter item name"
          autoFocus
        />
        <input
          placeholder="Item description (Optional)"
          className="w-full p-2 border rounded"
          value={itemDescription}
          onChange={handleItemDescriptionChange}
        />
        <input
          type="number"
          placeholder="Quantity (Optional)"
          className="w-full p-2 border rounded"
          value={itemQuantity !== undefined ? itemQuantity : ''}
          onChange={handleItemQuantityChange}
          min={0}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="w-full bg-destructive p-2 border border-border rounded hover:bg-muted transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!itemName.trim()}
            type="submit"
            className="w-full p-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </BottomSheetModal>
  )
}
