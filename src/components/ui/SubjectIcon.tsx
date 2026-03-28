type Subject = "mathematics" | "science" | "english";

const config: Record<Subject, { gradient: string; icon: React.ReactNode }> = {
  mathematics: {
    gradient: "from-blue-400 to-indigo-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        {/* Bold plus / function symbol */}
        <path d="M12 4v16M4 12h16" stroke="white" strokeWidth={2.8} strokeLinecap="round"/>
        <path d="M7 7l10 10M17 7L7 17" stroke="white" strokeWidth={1.6} strokeLinecap="round" opacity={0.5}/>
      </svg>
    ),
  },
  science: {
    gradient: "from-emerald-400 to-teal-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        {/* Flask / beaker */}
        <path d="M9 3h6" stroke="white" strokeWidth={2} strokeLinecap="round"/>
        <path d="M10 3v5.5L6.5 14c-.8 1.4-.9 3 0 4.2A3.5 3.5 0 0 0 9.5 20h5a3.5 3.5 0 0 0 3-1.8c.9-1.2.8-2.8 0-4.2L14 8.5V3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10.5" cy="15.5" r="1" fill="white" opacity={0.8}/>
        <circle cx="13.5" cy="17" r="0.7" fill="white" opacity={0.6}/>
      </svg>
    ),
  },
  english: {
    gradient: "from-violet-400 to-purple-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        {/* Open book */}
        <path d="M12 6C10 4.5 7 4 4 4.5v14c3-.5 6 0 8 1.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6c2-1.5 5-2 8-1.5v14c-3-.5-6 0-8 1.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6v15" stroke="white" strokeWidth={1.5} strokeLinecap="round" opacity={0.7}/>
      </svg>
    ),
  },
};

export default function SubjectIcon({ subject }: { subject: Subject }) {
  const { gradient, icon } = config[subject];
  return (
    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
      {icon}
    </div>
  );
}
