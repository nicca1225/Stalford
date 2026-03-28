type Subject = 'mathematics' | 'science' | 'english';

const styles: Record<Subject, string> = {
  mathematics: 'bg-blue-50 text-blue-700 border-blue-200',
  science:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  english:     'bg-violet-50 text-violet-700 border-violet-200',
};

interface ClassBadgeProps {
  subject: Subject;
  label: string;
  size?: 'sm' | 'md';
}

export default function ClassBadge({ subject, label, size = 'sm' }: ClassBadgeProps) {
  const sizeClass = size === 'md'
    ? 'text-xs px-3 py-1'
    : 'text-[10px] px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${sizeClass} ${styles[subject]}`}>
      {label}
    </span>
  );
}
