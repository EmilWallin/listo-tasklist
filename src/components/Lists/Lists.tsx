import { deleteList, updateList } from '#/api/lists'
import { useLists } from '#/stores/ListsStore'
import { useState } from 'react'
import { ListRow } from './components/ListRow'
import { useNavigate } from '@tanstack/react-router'
import { ListInfoDrawer } from './components/ListInfoDrawer'
import { toast } from 'react-toastify'
import type { List } from '#/types/List'

export const Lists = () => {
  const {
    lists,
    selectedListId,
    setSelectedListId,
    updateList: updateListInStore,
    deleteList: deleteListFromStore,
  } = useLists()
  const navigate = useNavigate()
  const [showListInfo, setShowListInfo] = useState(false)

  const handleListClick = (listId: number) => {
    setSelectedListId(listId)

    navigate({ to: `/List/${listId}` })
  }

  const handleUpdateList = async (updatedList: List) => {
    const result = await updateList(updatedList)

    if (result) {
      updateListInStore(result)
      toast.success('List updated successfully.')
      return true
    } else {
      toast.error('Failed to update the list. Please try again.')
      return false
    }
  }

  const handleDeleteList = async (listId: number) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) return false
    if (window.confirm(`Are you sure you want to delete ${list.name}?`)) {
      setSelectedListId(null)
      const result = await deleteList(listId)
      if (result) {
        deleteListFromStore(listId)

        toast.success('List deleted successfully.')

        return true
      } else {
        toast.error('Failed to delete the list. Please try again.')
      }
    }
    return false
  }

  const handleEditList = (listId: number) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) return
    setSelectedListId(listId)
    setShowListInfo(true)
  }

  return (
    <>
      <div className="flex flex-col px-2 overflow-y-auto gap-1">
        {lists.map((list) => (
          <ListRow
            key={list.id}
            list={list}
            onClick={() => handleListClick(list.id)}
            handleDelete={() => handleDeleteList(list.id)}
            handleEdit={() => handleEditList(list.id)}
          />
        ))}
      </div>

      <ListInfoDrawer
        isOpen={showListInfo}
        onClose={() => setShowListInfo(false)}
        onDelete={handleDeleteList}
        onUpdate={handleUpdateList}
        list={
          selectedListId
            ? lists.find((l) => l.id === selectedListId)
            : undefined
        }
      />
    </>
  )
}
