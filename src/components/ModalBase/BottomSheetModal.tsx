import { XIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  /** Max width of the desktop modal. Defaults to "max-w-lg" */
  desktopMaxWidth?: string
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  desktopMaxWidth = 'max-w-lg',
}: BottomSheetModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'sheet-modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet on mobile, centered modal on sm+ */}
      <div
        ref={contentRef}
        className={[
          // Shared
          'relative z-10 bg-surface shadow-xl',
          'flex flex-col max-h-[90dvh] w-full',
          'focus:outline-none',
          // Mobile: bottom sheet
          'rounded-t-2xl sm:rounded-2xl',
          // Desktop: constrained width & centered
          `sm:${desktopMaxWidth} sm:mx-4`,
          // Animate up on mobile, scale in on desktop
          'animate-slide-up sm:animate-scale-in',
        ].join(' ')}
        tabIndex={-1}
      >
        {/* Drag handle (mobile only) */}
        <div
          className="flex justify-center pt-3 pb-1 sm:hidden"
          aria-hidden="true"
        >
          <div className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2
              id="sheet-modal-title"
              className="text-base font-semibold text-content"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full border border-border p-1.5 text-text hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto overscroll-contain px-5 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
