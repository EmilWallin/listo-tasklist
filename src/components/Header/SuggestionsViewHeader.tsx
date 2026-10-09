import { useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeftIcon, RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'

const SuggestionsViewHeader = () => {
  const navigate = useNavigate()
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleClick = () => {
    navigate({ to: '/' })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await router.invalidate()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 h-16 relative">
      <div
        onClick={handleClick}
        className="h-10 aspect-square flex items-center justify-center hover:bg-highlight cursor-pointer rounded-md"
      >
        <ChevronLeftIcon className="w-6 h-6 -ml-0.5" />
      </div>
      <h1 className="text-2xl font-bold">Suggestions</h1>

      <div className="flex w-12 items-center justify-center">
        <button
          type="button"
          aria-label="Refresh suggestions"
          title="Refresh suggestions"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="size-10 shrink-0 p-0 aspect-square flex items-center justify-center hover:bg-highlight disabled:opacity-50 rounded-md"
        >
          <RefreshCcwIcon
            className={`w-5 h-5 text-text ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    </div>
  )
}

export default SuggestionsViewHeader
