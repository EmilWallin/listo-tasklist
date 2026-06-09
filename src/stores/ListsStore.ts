import { create } from 'zustand'
import type { List } from '#/types/List'
import type { ListEntry } from '#/types/ListEntry'
import { getLists, subscribeToListChanges } from '#/api/lists'
import type {
  ListChangeEvent,
  ListEntryChangeEvent,
} from '#/types/ChangeEvents'

interface ListsState {
  lists: List[]
  init: () => Promise<() => void>
  setLists: (lists: List[]) => void
  addList: (list: List) => void
  updateList: (updatedList: List) => void
  deleteList: (id: number) => void
  addListEntry: (listId: number, entry: ListEntry) => void
  updateListEntry: (listId: number, entry: ListEntry) => void
  deleteListEntry: (listId: number, entryId: number) => void

  selectedListId: number | null
  setSelectedListId: (id: number | null) => void
}

export const useLists = create<ListsState>((set) => ({
  lists: [],
  selectedListId: null,
  setSelectedListId: (id) => set({ selectedListId: id }),
  init: async () => {
    const lists = await getLists()
    set({ lists })
    set({ selectedListId: lists.length > 0 ? lists[0].id : null })

    const onListChange = (event: ListChangeEvent) => {
      if (event.eventType === 'INSERT') {
        if (lists.some((list) => list.id === event.record.id)) return
        set((state) => ({
          lists: [...state.lists, { ...event.record, items: [] }],
        }))
      } else if (event.eventType === 'UPDATE') {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === event.record.id
              ? { ...event.record, items: list.items }
              : list,
          ),
        }))
      } else {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== event.record.id),
        }))
      }
    }

    const onListEntryChange = (event: ListEntryChangeEvent) => {
      if (event.eventType === 'INSERT' || event.eventType === 'UPDATE') {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id === event.record.parentId) {
              const existingEntryIndex = list.items.findIndex(
                (item) => item.id === event.record.id,
              )

              if (existingEntryIndex !== -1) {
                // Update existing entry
                const updatedItems = [...list.items]
                updatedItems[existingEntryIndex] = event.record
                return { ...list, items: updatedItems }
              } else {
                // Add new entry
                return { ...list, items: [...list.items, event.record] }
              }
            }
            return list
          }),
        }))
      } else {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.items.some((item) => item.id === event.record.id)) {
              return {
                ...list,
                items: list.items.filter((item) => item.id !== event.record.id),
              }
            }
            return list
          }),
        }))
      }
    }

    const unsubscribe = subscribeToListChanges({
      onListChange,
      onListEntryChange,
    })
    return unsubscribe
  },
  setLists: (lists) => set({ lists }),
  addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
  updateList: (updatedList) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === updatedList.id ? updatedList : list,
      ),
    })),
  deleteList: (id) =>
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
    })),
  addListEntry: (listId, entry) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, items: [...list.items, entry] } : list,
      ),
    })),
  updateListEntry: (listId, entry) =>
    set((state) => ({
      lists: state.lists.map((list) => {
        if (list.id === listId) {
          const updatedItems = list.items.map((item) =>
            item.id === entry.id ? entry : item,
          )
          return { ...list, items: updatedItems }
        }
        return list
      }),
    })),
  deleteListEntry: (listId, entryId) =>
    set((state) => ({
      lists: state.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item.id !== entryId),
          }
        }
        return list
      }),
    })),
}))
