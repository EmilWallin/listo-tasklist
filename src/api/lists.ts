import { convertFromModel as convertFromListModel } from '#/types/List'
import type { List } from '#/types/List'
import type {
  ListChangeEvent,
  ListEntryChangeEvent,
} from '#/types/ChangeEvents'
import { convertFromModel as convertFromListEntryModel } from '#/types/ListEntry'
import type { Tables } from '#/types/supabase'
import { supabase } from './supabase'

export const getLists = async () => {
  const { data, error } = await supabase
    .from('lists')
    .select(
      `
      *,
      items:list_entries(*)
    `,
    )
    .order('position', {
      referencedTable: 'list_entries',
      ascending: true,
      nullsFirst: false,
    })

  if (error) {
    console.error('Error fetching lists:', error)
    return []
  }

  return data.map((list) => convertFromListModel(list, list.items))
}

export const createList = async (name: string, description: string) => {
  const { data, error } = await supabase
    .from('lists')
    .insert({ name, description })
    .select('*')
    .single()

  if (error) {
    console.error('Error creating list:', error)
    return null
  }

  console.log('Created list:', data.id, data.name)
  return convertFromListModel(data, [])
}

export const deleteList = async (id: number) => {
  const { error } = await supabase.from('lists').delete().eq('id', id)

  if (error) {
    console.error('Error deleting list:', error)
    return false
  }

  return true
}

export const updateList = async (entry: List) => {
  const { data, error } = await supabase
    .from('lists')
    .update({ name: entry.name, description: entry.description })
    .eq('id', entry.id)
    .select(
      `
      *,
      items:list_entries(*)
    `,
    )
    .single()

  if (error) {
    console.error('Error updating list:', error)
    return null
  }

  return convertFromListModel(data, data.items)
}

interface SubscribeToListChangesCallbacks {
  onListChange: (event: ListChangeEvent) => void
  onListEntryChange: (event: ListEntryChangeEvent) => void
}

export const subscribeToListChanges = ({
  onListChange,
  onListEntryChange,
}: SubscribeToListChangesCallbacks) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on<List>(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'lists' },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          onListChange({ eventType: payload.eventType, record: payload.new })
        } else {
          onListChange({ eventType: 'DELETE', record: payload.old })
        }
      },
    )
    .on<Tables<'list_entries'>>(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'list_entries' },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          onListEntryChange({
            eventType: payload.eventType,
            record: convertFromListEntryModel(payload.new),
          })
        } else {
          onListEntryChange({
            eventType: 'DELETE',
            record: {
              id: payload.old.id,
            },
          })
        }
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
