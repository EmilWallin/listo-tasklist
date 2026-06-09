import type { Tables } from './supabase'

export interface Suggestion {
  id: number
  created_at: string

  itemName: string
  itemDescription: string
}

export const convertFromModel = (data: Tables<'suggestions'>): Suggestion => ({
  id: data.id,
  created_at: data.created_at,
  itemName: data.item_name,
  itemDescription: data.item_description ?? '',
})
