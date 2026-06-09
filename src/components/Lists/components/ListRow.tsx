import type { List } from '#/types/List'
import { cn } from '#/utils/cn'
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useState } from 'react'
import { ProgressBar } from './ProgressBar'
import { EllipsisVerticalIcon } from 'lucide-react'

interface ListRowProps {
  list?: List
  isSelected?: boolean
  onClick: () => void
  handleEdit: () => void
  handleDelete: () => void
}

export const ListRow = ({
  list,
  isSelected = false,
  onClick,
  handleEdit,
  handleDelete,
}: ListRowProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const totalItems = list?.items.length ?? 0
  const completedItems =
    list?.items.filter((item) => item.completed).length ?? 0

  const DELETE_THRESHOLD = -80

  const x = useMotionValue(0)
  const controls = useAnimation()
  const opacity = useTransform(x, [0, DELETE_THRESHOLD], [0, 1])

  const handleClick = () => {
    if (isDragging) return
    onClick()
  }

  const handleDragEnd = async () => {
    setIsDragging(false)
    if (x.get() <= DELETE_THRESHOLD) {
      await controls.start({
        x: '-100%',
        opacity: 0.5,
        transition: { duration: 0.2 },
      })
      handleDelete()
    } else {
      controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      })
    }
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleEdit()
  }

  return (
    <div className="relative flex w-full h-fit bg-destructive rounded-md overflow-hidden">
      <motion.span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-destructive-foreground pointer-events-none"
        style={{ opacity }}
      >
        Delete
      </motion.span>
      <motion.div
        className={cn(
          'pl-4 pr-2 py-2 h-12 w-full flex items-center justify-between cursor-pointer transition-all rounded-md border-tertiary bg-card hover:bg-highlight',
        )}
        onClick={handleClick}
        drag="x"
        dragConstraints={{ left: DELETE_THRESHOLD * 1.5, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        style={{ x }}
        animate={controls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <span className={cn('text-xl truncate', isSelected && 'font-bold')}>
          {list?.name}
        </span>
        <div className="flex items-center gap-2">
          <ProgressBar
            progress={totalItems === 0 ? 0 : completedItems / totalItems}
          />
          <span className="text-sm text-tertiary truncate">
            {completedItems} / {totalItems}
          </span>

          <div
            className="h-full py-0.5 aspect-square hover:border-primary hover:bg-tertiary rounded-md flex items-center justify-center"
            onClick={handleOptionsClick}
          >
            <EllipsisVerticalIcon className="h-full" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
