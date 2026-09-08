import { useState } from 'react'
import { LandingPage } from './components/landing/LandingPage'
import { AuthModal } from './components/auth/AuthModal'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { StudentDashboardView } from './components/views/StudentDashboardView'
import { DailyCheckinView } from './components/views/DailyCheckinView'
import { HistoryView } from './components/views/HistoryView'
import { StaffDashboardView, type StaffTab } from './components/views/StaffDashboardView'
import { SettingsView } from './components/views/SettingsView'
import { InsightsView } from './components/views/InsightsView'
import { ProfilePrivacyView } from './components/views/ProfilePrivacyView'
import { demoLogin } from './api/client'
import type { NavSection, UserRole, User } from './types'

const STUDENT_SECTIONS: NavSection[] = ['dashboard', 'checkin', 'insights', 'history', 'profile']
const STAFF_SECTIONS: NavSection[] = [
  'staff',
  'staff-insights',
  'staff-students',
  'staff-privacy',
  'settings',
]

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('student')
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard')
  const [currentRole, setCurrentRole] = useState<UserRole>('student')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Strict route sanitizer ensuring student cannot view staff routes and vice-versa
  const currentActiveSection: NavSection =
    currentRole === 'student'
      ? STUDENT_SECTIONS.includes(activeSection)
        ? activeSection
        : 'dashboard'
      : STAFF_SECTIONS.includes(activeSection)
      ? activeSection
      : 'staff'

  // Open Auth Modal
  const handleOpenAuth = (role: UserRole = 'student') => {
    setAuthDefaultRole(role)
    setIsAuthModalOpen(true)
  }

  // Handle successful login
  const handleAuthSuccess = (user: User, role: UserRole) => {
    setCurrentUser(user)
    setCurrentRole(role)
    setIsAuthenticated(true)
    setIsAuthModalOpen(false)
    setActiveSection(role === 'staff' ? 'staff' : 'dashboard')
    showToast(
      `Welcome back, ${user.name || (role === 'staff' ? 'Dr. Radhika Sharma' : 'Atharva Dev')}!`
    )
  }

  // Handle one-click quick demo login from landing page
  const handleQuickDemo = async (role: UserRole) => {
    // Set immediate synchronous session to prevent role or user mismatch flicker
    setCurrentRole(role)
    setCurrentUser({
      id: role === 'staff' ? 'usr-staff-01' : 'usr-student-01',
      name: role === 'staff' ? 'Dr. Radhika Sharma' : 'Atharva Dev',
      email: role === 'staff' ? 'staff@codeforge.local' : 'student@codeforge.local',
      role,
    })
    setIsAuthenticated(true)
    setActiveSection(role === 'staff' ? 'staff' : 'dashboard')

    try {
      const res = await demoLogin(role)
      if (res?.user) setCurrentUser(res.user)
      showToast(
        role === 'staff'
          ? '🛡️ Counselor Command Center active (Dr. Radhika Sharma)'
          : '🎓 Student Portal active (Atharva Dev)'
      )
    } catch {
      showToast(
        role === 'staff'
          ? '🛡️ Counselor Command Center active'
          : '🎓 Student Portal active'
      )
    }
  }

  // Handle sign out / back to startup landing page
  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveSection('dashboard')
    showToast('Signed out. Returned to WellTrack home.')
  }

  // Toggle role inside the app
  const handleToggleRole = () => {
    const nextRole: UserRole = currentRole === 'student' ? 'staff' : 'student'
    setCurrentRole(nextRole)
    // Synchronously set matching user to guarantee zero mismatch
    setCurrentUser({
      id: nextRole === 'staff' ? 'usr-staff-01' : 'usr-student-01',
      name: nextRole === 'staff' ? 'Dr. Radhika Sharma' : 'Atharva Dev',
      email: nextRole === 'staff' ? 'staff@codeforge.local' : 'student@codeforge.local',
      role: nextRole,
    })
    setActiveSection(nextRole === 'staff' ? 'staff' : 'dashboard')

    demoLogin(nextRole)
      .then((res) => {
        if (res?.user) setCurrentUser(res.user)
        showToast(
          nextRole === 'staff'
            ? 'Switched to Counselor Portal (Dr. Radhika Sharma)'
            : 'Switched to Student Portal (Atharva Dev)'
        )
      })
      .catch(() => {
        showToast(
          nextRole === 'staff'
            ? 'Switched to Counselor Portal'
            : 'Switched to Student Portal'
        )
      })
  }

  const handleSeedComplete = () => {
    showToast('✨ Demo data seeded successfully! 3-day stress streak loaded.')
    setRefreshKey((k) => k + 1)
  }

  // Helper to map staff nav section to staff tab
  const getStaffTab = (section: NavSection): StaffTab => {
    if (section === 'staff-insights') return 'insights'
    if (section === 'staff-students') return 'students'
    if (section === 'staff-privacy') return 'privacy'
    return 'alerts'
  }

  const handleStaffTabChange = (tab: StaffTab) => {
    if (tab === 'alerts') setActiveSection('staff')
    else if (tab === 'insights') setActiveSection('staff-insights')
    else if (tab === 'students') setActiveSection('staff-students')
    else if (tab === 'privacy') setActiveSection('staff-privacy')
  }

  // If unauthenticated: Display Venture Startup Landing Page
  if (!isAuthenticated) {
    return (
      <>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#1A1A1A] text-xs font-semibold flex items-center gap-2">
            <span>🔔</span>
            <span>{toastMessage}</span>
          </div>
        )}

        <LandingPage
          onOpenAuth={handleOpenAuth}
          onQuickDemo={handleQuickDemo}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          defaultRole={authDefaultRole}
        />
      </>
    )
  }

  // If authenticated: Display Protected Portal (Student or Counselor strictly isolated)
  return (
    <div className="flex min-h-screen bg-[#F8FCFF] text-[#111111] selection:bg-[#FFD84D] selection:text-[#111111]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#1A1A1A] text-xs font-semibold flex items-center gap-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        activeSection={currentActiveSection}
        setActiveSection={setActiveSection}
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentRole={currentRole}
          currentUser={currentUser}
          onToggleRole={handleToggleRole}
          onSeedComplete={handleSeedComplete}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto" key={refreshKey}>
          {currentActiveSection === 'dashboard' && (
            <StudentDashboardView onNavigate={setActiveSection} />
          )}
          {currentActiveSection === 'checkin' && (
            <DailyCheckinView
              onCheckinSuccess={() => {
                showToast('Check-in saved successfully! Streak updated.')
                setRefreshKey((k) => k + 1)
              }}
              onNavigate={setActiveSection}
            />
          )}
          {currentActiveSection === 'insights' && (
            <InsightsView onNavigate={setActiveSection} />
          )}
          {currentActiveSection === 'history' && <HistoryView />}
          {currentActiveSection === 'profile' && (
            <ProfilePrivacyView currentUser={currentUser} />
          )}
          {(currentActiveSection === 'staff' ||
            currentActiveSection === 'staff-insights' ||
            currentActiveSection === 'staff-students' ||
            currentActiveSection === 'staff-privacy') && (
            <StaffDashboardView
              initialTab={getStaffTab(currentActiveSection)}
              onTabChange={handleStaffTabChange}
            />
          )}
          {currentActiveSection === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Auth Modal for re-authenticating if desired */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultRole={authDefaultRole}
      />
    </div>
  )
}

export default App
