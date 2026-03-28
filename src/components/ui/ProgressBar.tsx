interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export default function ProgressBar({ value, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-zinc-400 w-8 text-right">{clamped}%</span>
      )}
    </div>
  );
}
