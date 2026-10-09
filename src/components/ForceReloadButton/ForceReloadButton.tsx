import { useLists } from '#/stores/ListsStore'
import { cn } from '#/utils/cn'
import { RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'

export const ForceReloadButton = () => {
  const { refresh } = useLists()
  const [isLoading, setIsLoading] = useState(false)

  const handleReload = async () => {
    setIsLoading(true)
    await refresh()

    setTimeout(() => {
      setIsLoading(false)
    }, 900)
  }

  return (
    <button
      className="p-2 rounded-md"
      disabled={isLoading}
      onClick={handleReload}
    >
      <RefreshCcwIcon size={24} className={cn(isLoading && 'animate-spin')} />
    </button>
  )
}
