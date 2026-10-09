import { convertFromModel } from '#/types/Suggestion'
import { supabase } from './supabase'

export const getSuggestions = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .ilike('item_name', `%${searchTerm}%`)
    .limit(10)

  if (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }

  return data.map(convertFromModel)
}

export const deleteSuggestion = async (id: number) => {
  const { error } = await supabase.from('suggestions').delete().eq('id', id)

  if (error) {
    console.error('Error deleting suggestion:', error)
    return false
  }

  return true
}

export const SUGGESTIONS_PAGE_SIZE = 20

export const getSuggestionsPage = async (offset = 0) => {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('id', { ascending: true })
    .range(offset, offset + SUGGESTIONS_PAGE_SIZE - 1)

  if (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }

  return data.map(convertFromModel)
}

export const updateSuggestion = async (
  id: number,
  itemName: string,
  itemDescription: string,
) => {
  const { error } = await supabase
    .from('suggestions')
    .update({ item_name: itemName, item_description: itemDescription })
    .eq('id', id)

  if (error) {
    console.error('Error updating suggestion:', error)
    return false
  }

  return true
}
