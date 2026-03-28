type Status =
  | "pending-review"
  | "processing"
  | "approved"
  | "not-submitted"
  | "grading"
  | "correct"
  | "incorrect";

const config: Record<Status, { label: string; className: string }> = {
  "pending-review":  { label: "Pending Review",  className: "bg-yellow-100 text-yellow-800" },
  "processing":      { label: "Processing",       className: "bg-blue-100 text-blue-800" },
  "approved":        { label: "Approved",         className: "bg-green-100 text-green-800" },
  "not-submitted":   { label: "Not Submitted",    className: "bg-red-100 text-red-700" },
  "grading":         { label: "Grading...",        className: "bg-blue-100 text-blue-800" },
  "correct":         { label: "Correct",           className: "bg-green-100 text-green-800" },
  "incorrect":       { label: "Incorrect",         className: "bg-red-100 text-red-700" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
