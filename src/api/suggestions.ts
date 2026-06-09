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
