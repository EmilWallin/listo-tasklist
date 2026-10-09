import { ForceReloadButton } from '../ForceReloadButton/ForceReloadButton'
import { SettingsButton } from '../Settings/SettingsButton'

export const IndexHeader = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-4 h-16 relative">
        <div className="pl-2">
          <SettingsButton />
        </div>

        <h1 className="text-2xl font-bold">Lists</h1>

        <div className="pr-2">
          <ForceReloadButton />
        </div>
      </div>
    </>
  )
}
