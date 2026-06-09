interface ProgressBarProps {
  progress: number // value between 0 and 1
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="h-2 bg-muted w-20 relative rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-tertiary rounded-r-full transition-all duration-300"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
