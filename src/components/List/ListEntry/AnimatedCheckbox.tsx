import { motion } from 'framer-motion'
import { cn } from '#/utils/cn'
import { Check } from 'lucide-react'

interface AnimatedCheckboxProps {
  checked: boolean
  onChange: () => void
}

export const AnimatedCheckbox = ({
  checked,
  onChange,
}: AnimatedCheckboxProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={onChange}
    className={cn(
      'w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors duration-200',
      checked ? 'bg-primary border-primary' : 'bg-transparent border-border',
    )}
  >
    <motion.span
      initial={false}
      animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </motion.span>
  </button>
)
