import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  role: 'student' | 'tutor';
  children: React.ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F7F6F3]">
      <Sidebar role={role} />

      {/* Main area: offset by sidebar on md+, full width on mobile */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-[220px]">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
