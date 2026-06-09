import type { Tables } from './supabase'

export interface ListEntry {
  id: number
  createdAt: string
  parentId: number
  itemName: string
  itemQuantity: number | null
  itemDescription: string
  completed: boolean
  addedBy: string
  position: string | null
}

export const convertFromModel = (data: Tables<'list_entries'>): ListEntry => ({
  id: data.id,
  createdAt: data.created_at,
  parentId: data.parent_id,
  itemName: data.item_name,
  itemQuantity: data.item_quantity,
  itemDescription: data.item_description ?? '',
  completed: data.completed ?? false,
  addedBy: data.added_by ?? '',
  position: data.position,
})

export const convertToModel = (entry: ListEntry): Tables<'list_entries'> => ({
  id: entry.id,
  created_at: entry.createdAt,
  parent_id: entry.parentId,
  item_name: entry.itemName,
  item_quantity: entry.itemQuantity,
  item_description: entry.itemDescription,
  completed: entry.completed,
  added_by: entry.addedBy,
  position: entry.position,
})

export interface ListEntryDTO {
  parent_id: number
  item_name: string
  item_quantity?: number
  item_description?: string
  position?: string | null
}
