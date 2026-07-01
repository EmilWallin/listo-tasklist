import {
  deleteAllListEntriesForList,
  deleteListEntry,
  updateListEntry,
  updateListEntryPosition,
} from '#/api/listEntries'
import type { List } from '#/types/List'
import { useState, useEffect } from 'react'
import { AddListItem } from '../AddListItem/AddListItem'
import { ListEntryItem } from './ListEntry/ListEntryItem'
import { ListEntryItemInfoDrawer } from './ListEntry/ListIEntrytemInfoDrawer'
import type { ListEntry } from '#/types/ListEntry'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { generateKeyBetween } from 'jittered-fractional-indexing'
import { ClipLoader } from 'react-spinners'
import { cn } from '#/utils/cn'
import { ChevronDownCircleIcon, TrashIcon } from 'lucide-react'
import { useLists } from '#/stores/ListsStore'
import { AnimatePresence, motion } from 'framer-motion'
import { AddListItemButton } from '../AddListItem/AddListItemButton'
import { toast } from 'react-toastify'

interface ListProps {
  list: List
}

const sortByPosition = (items: ListEntry[]) =>
  [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (a.position === null) return 1
    if (b.position === null) return -1
    return a.position < b.position ? -1 : 1
  })

export const ListView = ({ list }: ListProps) => {
  const {
    updateListEntry: updateLocalListEntry,
    deleteListEntry: deleteLocalListEntry,
  } = useLists()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<ListEntry | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [completingIds, setCompletingIds] = useState<Set<number>>(new Set())
  const [hideCompletedItems, setHideCompletedItems] = useState(false)

  useEffect(() => {
    if (completingIds.size === 0) return
    const stillPending = new Set<number>()
    completingIds.forEach((id) => {
      const entry = list.items.find((item) => item.id === id)
      if (!entry?.completed) stillPending.add(id)
    })
    if (stillPending.size !== completingIds.size) {
      setCompletingIds(stillPending)
    }
  }, [list.items])

  const sortedItems = sortByPosition(list.items)

  const handleEntryClick = (entry: ListEntry) => {
    setSelectedEntry(entry)
    setIsDrawerOpen(true)
  }

  const handleListItemCheckedChanged = async (id: number) => {
    const entry = list.items.find((item) => item.id === id)
    if (!entry) return

    if (!entry.completed) {
      setCompletingIds((prev) => new Set(prev).add(id))
      await new Promise((resolve) => setTimeout(resolve, 600))
      await updateListEntry({ ...entry, completed: true })
    } else {
      await updateListEntry({ ...entry, completed: false })
    }
  }

  const handleEntryUpdate = async (updatedEntry: ListEntry) => {
    const result = await updateListEntry(updatedEntry)

    if (result) {
      updateLocalListEntry(list.id, result)
      setSelectedEntry(result)
    }
  }

  const handleEntryDelete = async (id: number) => {
    const result = await deleteListEntry(id)
    if (result) {
      deleteLocalListEntry(list.id, id)
    }
  }

  const handleDeleteCompletedEntries = async () => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete all completed entries?',
    )
    if (!shouldDelete) return
    setIsLoading(true)
    const deletePromise = deleteAllListEntriesForList(list.id, true)
    toast.promise(deletePromise, {
      pending: 'Deleting all completed entries...',
      success: 'All completed entries deleted!',
      error: 'Failed to delete completed entries',
    })

    await deletePromise
    setIsLoading(false)
  }

  const handleDragEnd = async (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return
    }
    setIsLoading(true)

    const items = [...sortedItems]
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)

    const destIndex = result.destination.index
    const before = destIndex > 0 ? items[destIndex - 1].position : null
    const after =
      destIndex < items.length - 1 ? items[destIndex + 1].position : null

    const newPosition = generateKeyBetween(before, after)
    await updateListEntryPosition(Number(result.draggableId), newPosition)
    setIsLoading(false)
  }

  const activeItems = sortedItems.filter((e) => !e.completed)
  const completedItems = sortedItems.filter((e) => e.completed)

  return (
    <>
      <div
        className={cn(
          'absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center transition-all',
          {
            'pointer-events-none opacity-0': !isLoading,
            'pointer-events-auto opacity-100': isLoading,
          },
        )}
      >
        <ClipLoader size={64} color="white" />
      </div>
      <div className="relative flex flex-col flex-1 overflow-y-auto gap-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="list-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col relative px-2 gap-1"
              >
                <AnimatePresence>
                  {activeItems.length > 0 &&
                    activeItems.map((entry, index) => (
                      <Draggable
                        key={entry.id}
                        draggableId={String(entry.id)}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <li
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                          >
                            <motion.div
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3 },
                              }}
                              initial={{ opacity: 0, y: -10 }}
                              exit={{ opacity: 0, y: 10 }}
                            >
                              <ListEntryItem
                                entry={entry}
                                dragHandleProps={
                                  draggableProvided.dragHandleProps
                                }
                                isCompleting={completingIds.has(entry.id)}
                                handleCheckedChanged={() =>
                                  handleListItemCheckedChanged(entry.id)
                                }
                                handleClick={() => handleEntryClick(entry)}
                                handleDelete={() => handleEntryDelete(entry.id)}
                              />
                            </motion.div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                </AnimatePresence>

                {activeItems.length === 0 && (
                  <>
                    <div className="p-4">
                      {list.items.length === 0
                        ? 'No items in the list'
                        : 'No active items remaining'}
                    </div>
                    {list.items.length === 0 && (
                      <AddListItemButton parentId={list.id} />
                    )}
                  </>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {completedItems.length > 0 && (
            <div className="px-2 pt-4 flex justify-center items-center w-full">
              <div
                className="size-8 flex items-center justify-center absolute left-2 rounded-md cursor-pointer hover:bg-highlight"
                onClick={handleDeleteCompletedEntries}
              >
                <TrashIcon className="h-5 w-5 text-text" />
              </div>
              <div
                className="flex items-center rounded-md px-2 py-1 cursor-pointer hover:bg-highlight"
                onClick={() => setHideCompletedItems(!hideCompletedItems)}
              >
                <h2 className="text-lg font-semibold">Hide Completed Items</h2>
                <ChevronDownCircleIcon
                  className={cn('ml-2 h-5 w-5 text-text', {
                    'rotate-180': hideCompletedItems,
                  })}
                />
              </div>
            </div>
          )}
          <Droppable droppableId="completed-list-items" isDropDisabled={true}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col relative px-2 gap-1 opacity-50 pb-20"
              >
                <AnimatePresence>
                  {!hideCompletedItems &&
                    completedItems.map((entry, index) => (
                      <Draggable
                        key={entry.id}
                        draggableId={String(entry.id)}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <li
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                          >
                            <motion.div
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3 },
                              }}
                              initial={{ opacity: 0, y: -10 }}
                              exit={{ opacity: 0, y: 10 }}
                            >
                              <ListEntryItem
                                entry={entry}
                                dragHandleProps={
                                  draggableProvided.dragHandleProps
                                }
                                isCompleting={completingIds.has(entry.id)}
                                handleCheckedChanged={() =>
                                  handleListItemCheckedChanged(entry.id)
                                }
                                handleClick={() => handleEntryClick(entry)}
                                handleDelete={() => handleEntryDelete(entry.id)}
                              />
                            </motion.div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                </AnimatePresence>
                {!hideCompletedItems &&
                  completedItems.length === 0 &&
                  list.items.length > 0 && (
                    <div className="p-4">No completed items</div>
                  )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <ListEntryItemInfoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entry={selectedEntry}
        updateEntry={handleEntryUpdate}
      />
      <div className="absolute bottom-4 right-4">
        <AddListItem parentId={list.id} />
      </div>
    </>
  )
}
