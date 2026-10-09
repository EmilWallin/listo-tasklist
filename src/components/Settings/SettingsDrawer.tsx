import BottomSheetModal from '#/components/ModalBase/BottomSheetModal'
import { useNavigate } from '@tanstack/react-router'
import SettingsDrawerButton from './SettingsDrawerButton'
import { LightbulbIcon } from 'lucide-react'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const navigate = useNavigate()

  const openSuggestions = () => {
    navigate({ to: '/Suggestions' })
  }

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      desktopMaxWidth="max-w-sm"
    >
      <SettingsDrawerButton
        onClick={openSuggestions}
        label="Suggestions"
        icon={<LightbulbIcon className="size-5" />}
      />
    </BottomSheetModal>
  )
}

export default SettingsDrawer
