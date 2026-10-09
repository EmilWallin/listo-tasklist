import type { Suggestion } from '#/types/Suggestion'
import { TrashIcon } from 'lucide-react'

interface SuggestionsListRowProps {
  suggestion: Suggestion
  onPress: (suggestionId: number) => void
  onDelete: (suggestionId: number) => void
}

const SuggestionsListRow = ({
  suggestion,
  onPress,
  onDelete,
}: SuggestionsListRowProps) => {
  return (
    <div
      onClick={() => onPress(suggestion.id)}
      className="flex items-center cursor-pointer hover:bg-muted justify-between border-text border py-1 px-2 bg-background rounded-md"
    >
      <span>{suggestion.itemName}</span>

      <div>
        <button
          type="button"
          aria-label={`Delete ${suggestion.itemName}`}
          className="size-6 shrink-0 p-0 flex items-center justify-center bg-none rounded-md cursor-pointer hover:bg-highlight"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(suggestion.id)
          }}
        >
          <TrashIcon className="h-4 w-4 text-text" />
        </button>
      </div>
    </div>
  )
}

export default SuggestionsListRow
