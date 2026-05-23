import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NAV } from '../config/nav'
import {
  ChevronRight, ChevronDown, User,
} from 'lucide-react'

// Map each child path (/parentId/childId) → parent group id, for auto-expanding the active group
const PATH_TO_GROUP = {}
for (const item of NAV) {
  if (item.children) {
    for (const child of item.children) {
      if (child.id) {
        PATH_TO_GROUP['/' + item.id + '/' + child.id] = item.id
      }
    }
  }
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [openGroup, setOpenGroup] = useState(() => PATH_TO_GROUP[pathname] ?? null)

  // Sync open group when navigating via browser back/forward or velson:navigate events
  useEffect(() => {
    const group = PATH_TO_GROUP[pathname]
    if (group) setOpenGroup(group)
  }, [pathname])

  const toggle = id => setOpenGroup(p => (p === id ? null : id))

  return (
    <div className="flex h-screen bg-[#f4f6f8] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-[210px] flex-shrink-0 bg-[#2c3e50] flex flex-col overflow-y-auto scrollbar-thin">
        {/* Brand */}
        <div className="px-4 py-[8.9px] bg-[#1a252f] border-b border-white/10 flex-shrink-0">
          <p className="text-white font-extrabold text-[13px] tracking-wide leading-tight">VELSON</p>
          <p className="text-white/40 text-[9px] font-medium tracking-widest uppercase">ERP WEB APPLICATION</p>
        </div>

        <nav className="flex-1 py-1">
          {NAV.map(item => {
            const hasChildren = item.children && item.children.length > 0
            const isOpen = openGroup === item.id
            const Icon = item.icon

            if (!hasChildren) {
              const topPath = item.page
                ? '/' + item.id.replace(/-top$/, '')
                : null
              const isActive = topPath && pathname === topPath

              return (
                <button
                  key={item.id}
                  onClick={() => topPath && navigate(topPath)}
                  className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] transition-colors
                    ${isActive ? 'bg-[#0097A7] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {item.label}
                </button>
              )
            }

            return (
              <div key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 text-[12.5px] transition-colors
                    ${isOpen ? 'bg-[#0097A7] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={14} className="flex-shrink-0" />
                    {item.label}
                  </span>
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>

                {isOpen && item.children.map(child => {
                  const childPath = '/' + item.id + '/' + child.id
                  const isChildActive = pathname === childPath

                  return (
                    <button
                      key={child.id + '-' + item.id}
                      onClick={() => navigate(childPath)}
                      className={`w-full text-left flex items-center gap-2 pl-8 pr-3 py-2 text-[12px] border-l-[3px] transition-colors
                        ${isChildActive
                          ? 'border-[#00BCD4] bg-[#0097A7]/25 text-white font-semibold'
                          : 'border-transparent text-white/55 hover:bg-white/8 hover:text-white/90'}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
                      {child.label}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* ── Right panel ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-[46px] bg-[#2c3e50] flex items-center justify-between px-6 flex-shrink-0 shadow-md z-10">
          <span className="text-white font-bold text-[13px] tracking-wider uppercase select-none">
            VELSON - ERP WEB APPLICATION
          </span>
          <div className="flex items-center gap-3">
            <span className="text-white/75 text-[13px]">
              Hi <span className="font-semibold text-white">superadmin</span> !
            </span>
            <div className="w-8 h-8 bg-[#0097A7] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#007a87] transition-colors">
              <User size={15} className="text-white" />
            </div>
            <ChevronDown size={13} className="text-white/50" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f4f6f8]">
          {children}
        </main>
      </div>
    </div>
  )
}
