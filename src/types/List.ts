import type { ListEntry } from './ListEntry'
import { convertFromModel as convertFromModelEntry, convertToModel as convertToModelEntry } from './ListEntry'
import type { Tables } from './supabase'

export interface List {
  id: number
  created_at: string
  is_public: boolean
  name: string
  description: string
  owner_id: string | null
  items: ListEntry[]
}

export const convertFromModel = (data: Tables<'lists'>, items: Tables<'list_entries'>[] | null): List => ({
  id: data.id,
  created_at: data.created_at,
  is_public: data.is_public,
  name: data.name,
  description: data.description ?? "",
  owner_id: data.owner_id,
  items: items
    ? items.map((item) => convertFromModelEntry(item))
    : [],
})

export const convertToModel = (list: List) => ({
  id: list.id,
  created_at: list.created_at,
  is_public: list.is_public,
  name: list.name,
  description: list.description,
  owner_id: list.owner_id,
  items: list.items.length > 0 ? list.items.map((item) => convertToModelEntry(item)) : null,
})
