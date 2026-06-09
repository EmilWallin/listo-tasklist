import type { List } from './List'
import type { ListEntry } from './ListEntry';

export type ListChangeEvent =
  | { eventType: 'INSERT'; record: List }
  | { eventType: 'UPDATE'; record: List }
  | { eventType: 'DELETE'; record: Partial<List> }

export type ListEntryChangeEvent =
  | { eventType: 'INSERT'; record: ListEntry }
  | { eventType: 'UPDATE'; record: ListEntry }
  | { eventType: 'DELETE'; record: Partial<ListEntry> }
