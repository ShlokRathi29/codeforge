import { useState, useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { StudentDashboardView } from './components/views/StudentDashboardView'
import { DailyCheckinView } from './components/views/DailyCheckinView'
import { HistoryView } from './components/views/HistoryView'
import { StaffDashboardView } from './components/views/StaffDashboardView'
import { SettingsView } from './components/views/SettingsView'
import { demoLogin } from './api/client'
import type { NavSection, UserRole } from './types'

export function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard')
  const [currentRole, setCurrentRole] = useState<UserRole>('student')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Initialize with demo login on startup
  useEffect(() => {
    demoLogin(currentRole).catch(() => {})
  }, [currentRole])

  const handleToggleRole = () => {
    const nextRole: UserRole = currentRole === 'student' ? 'staff' : 'student'
    setCurrentRole(nextRole)
    demoLogin(nextRole).then(() => {
      showToast(
        nextRole === 'staff'
          ? 'Switched to Counselor Portal (Dr. Aris Thorne)'
          : 'Switched to Student Portal (Atharva Dev)'
      )
      setActiveSection(nextRole === 'staff' ? 'staff' : 'dashboard')
    })
  }

  const handleSeedComplete = () => {
    showToast('✨ Demo data seeded successfully! 3-day stress streak loaded.')
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/30 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentRole={currentRole}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentRole={currentRole}
          onToggleRole={handleToggleRole}
          onSeedComplete={handleSeedComplete}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto" key={refreshKey}>
          {activeSection === 'dashboard' && (
            <StudentDashboardView onNavigate={setActiveSection} />
          )}
          {activeSection === 'checkin' && (
            <DailyCheckinView
              onCheckinSuccess={() => {
                showToast('Check-in saved successfully! Streak updated.')
                setActiveSection('dashboard')
                setRefreshKey((k) => k + 1)
              }}
              onNavigate={setActiveSection}
            />
          )}
          {activeSection === 'history' && <HistoryView />}
          {activeSection === 'staff' && <StaffDashboardView />}
          {activeSection === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  )
}
export default App
