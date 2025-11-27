"use client"

import { useEffect, useState } from "react"
import { LayoutDashboard, Zap, TestTube2, GitBranch, Settings, ChevronDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  activeNav: string
  setActiveNav: (nav: string) => void
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // 🔹 Profile coming from API / Supabase
  const [profileName, setProfileName] = useState("Harshit Raj")
  const [profileEmail, setProfileEmail] = useState("harshit@bmsit.in")

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (!res.ok) return

        const data = await res.json()
        if (!data) return

        setProfileName(data.name || "Harshit Raj")
        setProfileEmail(data.email || "harshit@bmsit.in")
      } catch (err) {
        console.error("Failed to load profile for sidebar", err)
      }
    }

    loadProfile()
  }, [])

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mock-apis", label: "Mock APIs", icon: Zap },
    { id: "test-suites", label: "Test Suites", icon: TestTube2 },
    { id: "ci-integration", label: "CI Integration", icon: GitBranch },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const initials = profileName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } flex flex-col shadow-xl`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            AT
          </div>
          {isExpanded && (
            <div>
              <div className="font-bold text-lg tracking-tight">API TITAN</div>
              <div className="text-xs text-slate-400">Smart Mocking</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              {isExpanded && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
              {isExpanded && isActive && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className={`flex items-center gap-3 ${!isExpanded && "justify-center"}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileName)}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{profileName}</div>
              <div className="text-xs text-slate-400 truncate">{profileEmail}</div>
            </div>
          )}
        </div>

        <div className={`flex gap-2 ${isExpanded ? "flex-row" : "flex-col"}`}>
          {isExpanded && (
            <button
              onClick={() => setActiveNav("settings")}
              className="flex-1 text-xs px-3 py-2 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Profile
            </button>
          )}
          <button
            className={`${
              isExpanded ? "flex-1" : "w-full"
            } text-xs px-3 py-2 rounded hover:bg-slate-800 text-slate-300 transition-colors flex items-center justify-center gap-2`}
          >
            <LogOut className="w-4 h-4" />
            {isExpanded && "Logout"}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-4 py-3 border-t border-slate-800">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>
    </aside>
  )
}