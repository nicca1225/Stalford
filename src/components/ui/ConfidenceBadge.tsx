export default function ConfidenceBadge({ score }: { score: number }) {
  // Smooth red → orange → yellow → green spectrum based on score
  // hue: 0 (red) → 38 (orange) → 60 (yellow) → 120 (green)
  const hue = Math.round((score / 100) * 120);
  const saturation = score < 20 ? 78 : 72;
  const lightness = score >= 60 ? 36 : score >= 35 ? 42 : 48;

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
      style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
    >
      {score}/100
    </span>
  );
}
