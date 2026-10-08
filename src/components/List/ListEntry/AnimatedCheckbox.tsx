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
    <span
      className={cn(
        'transition-[transform,opacity] duration-200 ease-out',
        checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
      )}
    >
      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </span>
  </button>
)
