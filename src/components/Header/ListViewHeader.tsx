import type { List } from '#/types/List'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeftIcon } from 'lucide-react'

interface ListViewHeaderProps {
  list?: List
}

export const ListViewHeader = ({ list }: ListViewHeaderProps) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="flex items-center justify-center gap-4 h-16 relative">
      <div
        onClick={handleClick}
        className="absolute left-2 top-1/2 transform -translate-y-1/2  h-10 aspect-square flex items-center justify-center hover:bg-highlight cursor-pointer rounded-md"
      >
        <ChevronLeftIcon className="w-6 h-6 -ml-0.5" />
      </div>
      <h1 className="text-2xl font-bold">{list?.name}</h1>
    </div>
  )
}
