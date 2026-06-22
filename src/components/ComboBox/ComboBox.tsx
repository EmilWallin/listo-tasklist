import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '#/utils/cn'

export interface ComboBoxOption {
  label: string
  value: string
}

interface ComboBoxProps {
  options: ComboBoxOption[]
  /** The selected option's value */
  value?: string
  /** Called when an option is selected or the clear button is pressed */
  onChange: (value: string | undefined) => void
  /** Called on every keystroke; use for async option fetching */
  onQueryChange?: (query: string) => void
  /** Text shown in the input when closed and no option is selected */
  displayValue?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
}

export const ComboBox = ({
  options,
  value,
  onChange,
  onQueryChange,
  displayValue,
  placeholder = 'Search...',
  disabled = false,
  className,
  autoFocus = false,
}: ComboBoxProps) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const selectedLabel = options.find((o) => o.value === value)?.label
  const inputDisplayValue = isOpen
    ? query
    : (selectedLabel ?? displayValue ?? '')

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const handleOpen = () => {
    if (disabled) return
    setQuery('')
    setIsOpen(true)
    inputRef.current?.focus()
  }

  const handleSelect = (option: ComboBoxOption) => {
    onChange(option.value)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(undefined)
    setQuery('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onQueryChange?.(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  useEffect(() => {
    if (!autoFocus) return
    const timer = setTimeout(() => {
      setIsOpen(true)
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={handleOpen}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-surface text-content',
          'cursor-pointer transition-colors',
          isOpen && 'border-muted ring-1 ring-muted',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input
          aria-selected={true}
          ref={inputRef}
          type="text"
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-content placeholder:text-text/50 p-0"
          value={inputDisplayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!isOpen}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listboxId}
        />
        {value && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-0 bg-transparent text-text/50 hover:text-content transition-colors shrink-0"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown
            size={16}
            className={cn(
              'text-text/50 shrink-0 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        )}
      </div>

      {isOpen && (options.length > 0 || query.length > 0) && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg max-h-60 overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-text/50 select-none">
              No results found
            </li>
          ) : (
            filtered.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option)}
                className={cn(
                  'px-3 py-2 text-sm cursor-pointer transition-colors',
                  option.value === value
                    ? 'bg-primary text-content'
                    : 'text-text hover:bg-highlight',
                )}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
