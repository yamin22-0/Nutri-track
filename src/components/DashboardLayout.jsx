import Sidebar from './Sidebar'

export default function DashboardLayout({ children, theme, toggleTheme }) {
  return (
    <>
      <style>{`
        .dash-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-cream);
        }
        .dark .dash-layout { background: #0f0f0f; }
        .dash-layout-content {
          flex: 1;
          margin-left: 240px;
          min-height: 100vh;
          transition: margin-left 0.25s ease;
        }
        @media (max-width: 768px) {
          .dash-layout-content {
            margin-left: 0;
            padding-top: 56px;
          }
        }
      `}</style>
      <div className="dash-layout">
        <Sidebar theme={theme} toggleTheme={toggleTheme} />
        <main className="dash-layout-content">
          {children}
        </main>
      </div>
    </>
  )
}