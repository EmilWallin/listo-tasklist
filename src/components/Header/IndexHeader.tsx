import { CogIcon } from 'lucide-react'
import { ForceReloadButton } from '../ForceReloadButton/ForceReloadButton'
import { useNavigate } from '@tanstack/react-router'

export const IndexHeader = () => {
  const navigate = useNavigate()

  const handleCogClick = () => {
    navigate({ to: '/Suggestions' })
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 h-16 relative">
        <div className="w-10 flex items-center justify-center cursor-pointer">
          <CogIcon width={24} height={24} onClick={handleCogClick} />
        </div>

        <h1 className="text-2xl font-bold">Lists</h1>

        <div className="pr-2">
          <ForceReloadButton />
        </div>
      </div>
    </>
  )
}
