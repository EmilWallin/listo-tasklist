import {
  deleteSuggestion,
  getSuggestionsPage,
  SUGGESTIONS_PAGE_SIZE,
} from '#/api/suggestions'
import type { Suggestion } from '#/types/Suggestion'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import SuggestionsListRow from './SuggestionsListRow'
import SuggestionsDrawer from './SuggestionsDrawer'

const SuggestionsList = ({
  suggestions: initialSuggestions,
}: {
  suggestions: Suggestion[]
}) => {
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [hasMore, setHasMore] = useState(
    initialSuggestions.length === SUGGESTIONS_PAGE_SIZE,
  )
  const [isLoading, setIsLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)
  const requestVersionRef = useRef(0)

  const [selectedSuggestionId, setSelectedSuggestionId] = useState<
    number | null
  >(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const handleOpenDrawer = () => setIsDrawerOpen(true)
  const handleCloseDrawer = (
    isEdited?: boolean,
    newItemInfo?: {
      id: number
      itemName: string
      itemDescription: string
    } | null,
  ) => {
    console.log('Drawer closed', isEdited, newItemInfo)

    setIsDrawerOpen(false)
    if (isEdited && newItemInfo) {
      setSuggestions((current) =>
        current.map((suggestion) =>
          suggestion.id === newItemInfo.id
            ? {
                ...suggestion,
                itemName: newItemInfo.itemName,
                itemDescription: newItemInfo.itemDescription,
              }
            : suggestion,
        ),
      )
    }
  }

  useEffect(() => {
    requestVersionRef.current += 1
    setSuggestions(initialSuggestions)
    setHasMore(initialSuggestions.length === SUGGESTIONS_PAGE_SIZE)
    isLoadingRef.current = false
    setIsLoading(false)
  }, [initialSuggestions])

  useEffect(() => {
    const container = scrollContainerRef.current
    const sentinel = sentinelRef.current
    if (!container || !sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries.some((entry) => entry.isIntersecting) ||
          isLoadingRef.current
        ) {
          return
        }

        isLoadingRef.current = true
        setIsLoading(true)
        const requestVersion = requestVersionRef.current
        void getSuggestionsPage(suggestions.length)
          .then((nextSuggestions) => {
            if (requestVersion !== requestVersionRef.current) return
            setSuggestions((current) => [...current, ...nextSuggestions])
            setHasMore(nextSuggestions.length === SUGGESTIONS_PAGE_SIZE)
          })
          .finally(() => {
            if (requestVersion === requestVersionRef.current) {
              isLoadingRef.current = false
              setIsLoading(false)
            }
          })
      },
      { root: container },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, suggestions.length])

  const handlePressSuggestion = (suggestionId: number) => {
    setSelectedSuggestionId(suggestionId)
    handleOpenDrawer()
  }

  const handleDeleteSuggestion = (suggestionId: number) => {
    const deleteSuggestionTask = deleteSuggestion(suggestionId).then(
      (deleted) => {
        if (!deleted) throw new Error('Failed to delete suggestion')
        setSuggestions((current) =>
          current.filter((suggestion) => suggestion.id !== suggestionId),
        )
      },
    )

    toast.promise(deleteSuggestionTask, {
      pending: 'Deleting suggestion...',
      success: 'Suggestion deleted successfully!',
      error: 'Failed to delete suggestion.',
    })
  }

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-3 h-full overflow-auto px-4"
      >
        {suggestions.map((suggestion) => (
          <SuggestionsListRow
            suggestion={suggestion}
            onPress={handlePressSuggestion}
            onDelete={handleDeleteSuggestion}
            key={suggestion.id}
          />
        ))}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="min-h-8 text-center"
            aria-live="polite"
          >
            {isLoading ? 'Loading...' : null}
          </div>
        )}
      </div>
      <SuggestionsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedSuggestion={
          suggestions.find((s) => s.id === selectedSuggestionId) ?? null
        }
      />
    </>
  )
}

export default SuggestionsList
