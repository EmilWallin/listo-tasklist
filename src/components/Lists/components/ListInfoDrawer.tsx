import BottomSheetModal from '#/components/ModalBase/BottomSheetModal'
import type { List } from '#/types/List'
import { TrashIcon } from 'lucide-react'

interface ListInfoDrawerProps {
  isOpen: boolean
  onClose: () => void
  onDelete: (listId: number) => Promise<boolean>
  onUpdate: (updatedList: List) => Promise<boolean>
  list?: List
}

export const ListInfoDrawer = ({
  isOpen,
  onClose,
  onDelete,
  onUpdate,
  list,
}: ListInfoDrawerProps) => {
  const handleClose = () => {
    onClose()
  }

  const handleSave = async () => {
    const updatedList: List = {
      ...list!,
      name: list?.name || '',
      description: list?.description || '',
    }

    const result = await onUpdate(updatedList)

    if (result) {
      onClose()
    }
  }

  const handleDelete = async () => {
    const result = await onDelete(list!.id)

    if (result) {
      onClose()
    }
  }

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 pt-0 flex flex-col gap-1">
        <div className="flex flex-row w-full items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">List Information</h2>

          <button
            className="p-2 rounded bg-background border border-destructive hover:bg-destructive/10 transition-colors"
            disabled={!list}
            onClick={handleDelete}
          >
            <TrashIcon className="text-destructive h-4 w-4" />
          </button>
        </div>

        <input
          type="text"
          value={list?.name || ''}
          className="w-full mb-2 p-2 border rounded"
        />

        <textarea
          value={list?.description || ''}
          className="w-full mb-2 p-2 border rounded"
        />

        <p className="text-sm text-muted-foreground">
          Created at:{' '}
          {list ? new Date(list.created_at).toLocaleString() : 'N/A'}
        </p>

        <div className="flex flex-row gap-2">
          <button
            className="px-4 py-2 w-full bg-destructive text-white rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 w-full text-white rounded"
            disabled={!list}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </BottomSheetModal>
  )
}
