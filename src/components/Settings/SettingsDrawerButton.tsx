import React from 'react'

interface SettingsDrawerButtonProps {
  onClick: () => void
  label: string
  icon: React.ReactNode
}

const SettingsDrawerButton = ({
  onClick,
  label,
  icon,
}: SettingsDrawerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-2 w-full  rounded-md"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default SettingsDrawerButton
