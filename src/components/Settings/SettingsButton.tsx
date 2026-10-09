import { CogIcon } from 'lucide-react'
import { useState } from 'react'
import SettingsDrawer from './SettingsDrawer'

export const SettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Open settings"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="p-2 rounded-md "
        onClick={() => setIsOpen(true)}
      >
        <CogIcon size={24} />
      </button>
      <SettingsDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
