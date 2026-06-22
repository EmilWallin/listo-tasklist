import { useLists } from '#/stores/ListsStore'
import { RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'

export const ForceReloadButton = () => {
  const { init } = useLists()
  const [isLoading, setIsLoading] = useState(false)

  const handleReload = async () => {
    setIsLoading(true)
    await init()
    setIsLoading(false)
  }

  return (
    <button
      className="p-2 rounded-md hover:bg-gray-200"
      disabled={isLoading}
      onClick={handleReload}
    >
      <RefreshCcwIcon size={24} />
    </button>
  )
}
