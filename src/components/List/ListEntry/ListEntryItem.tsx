import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import type { ListEntry } from '#/types/ListEntry'
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { GripVertical } from 'lucide-react'
import { AnimatedCheckbox } from './AnimatedCheckbox'
import { useState } from 'react'

interface ListEntryItemProps {
  entry: ListEntry
  dragHandleProps?: DraggableProvidedDragHandleProps | null
  handleCheckedChanged: () => void
  handleClick: () => void
  handleDelete: () => void
  isCompleting?: boolean
}

export const ListEntryItem = ({
  entry,
  dragHandleProps,
  handleCheckedChanged,
  handleClick,
  handleDelete,
  isCompleting = false,
}: ListEntryItemProps) => {
  const isStruck = entry.completed || isCompleting
  const [isDragging, setIsDragging] = useState(false)

  const DELETE_THRESHOLD = -80

  const x = useMotionValue(0)
  const controls = useAnimation()
  const opacity = useTransform(x, [0, DELETE_THRESHOLD], [0, 1])

  const getTextWidthPercentage = () => {
    return `${Math.min((entry.itemName.length / 32) * 100, 100)}%`
  }

  const handlePress = () => {
    if (isDragging) return
    handleClick()
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

  return (
    <div className="relative flex w-full h-fit bg-destructive rounded-md overflow-hidden">
      <motion.span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-destructive-foreground pointer-events-none"
        style={{ opacity }}
      >
        Delete
      </motion.span>
      <motion.div
        className="flex items-center h-12 w-full rounded-md justify-between py-2 px-4 bg-card hover:bg-highlight"
        drag="x"
        dragConstraints={{ left: DELETE_THRESHOLD * 1.5, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        style={{ x }}
        animate={controls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {!entry.completed && (
          <div
            {...dragHandleProps}
            className="cursor-grab mr-2 text-border hover:text-text transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}
        <span
          onClick={handlePress}
          className="flex-1 cursor-pointer text-lg relative"
        >
          {entry.itemName}
          <span
            className="absolute left-0 top-1/2 h-px bg-current rounded-full translate-y-0.5 transition-[width] duration-350 ease-in-out"
            style={{ width: isStruck ? getTextWidthPercentage() : '0%' }}
          />
        </span>
        <AnimatedCheckbox checked={isStruck} onChange={handleCheckedChanged} />
      </motion.div>
    </div>
  )
}
