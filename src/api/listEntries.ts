import type { ListEntry, ListEntryDTO } from '#/types/ListEntry'
import { supabase } from './supabase'
import {
  convertToModel as convertToListEntryModel,
  convertFromModel as convertFromListEntryModel,
} from '#/types/ListEntry'

export const createListEntry = async (entry: ListEntryDTO) => {
  const { data, error } = await supabase
    .from('list_entries')
    .insert(entry)
    .select('*')
    .single()

  if (error) {
    console.error('Error creating list entry:', error)
    return null
  }

  return convertFromListEntryModel(data)
}

export const updateListEntry = async (entry: ListEntry) => {
  const entryModel = convertToListEntryModel(entry)
  const { data, error } = await supabase
    .from('list_entries')
    .update(entryModel)
    .eq('id', entry.id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating list entry:', error)
    return null
  }

  return convertFromListEntryModel(data)
}

export const updateListEntryPosition = async (id: number, position: string) => {
  const { error } = await supabase
    .from('list_entries')
    .update({ position })
    .eq('id', id)

  if (error) {
    console.error('Error updating list entry position:', error)
    return false
  }

  return true
}

export const deleteListEntry = async (id: number) => {
  const { error } = await supabase.from('list_entries').delete().eq('id', id)

  if (error) {
    console.error('Error deleting list entry:', error)
    return false
  }

  return true
}

export const deleteAllListEntriesForList = async (
  parentId: number,
  onlyDeleteCompleted: boolean = false,
) => {
  let query = supabase.from('list_entries').delete().eq('parent_id', parentId)
  if (onlyDeleteCompleted) {
    query = query.eq('completed', true)
  }
  const { error } = await query

  if (error) {
    console.error('Error deleting list entries for list:', error)
    return false
  }

  return true
}
