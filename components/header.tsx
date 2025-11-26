"use client"

import { Search, Bell, Plus, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onCreateClick?: () => void
}

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative group">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mocks, tests, endpoints..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
            title="Notifications"
          >
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2 pl-4 border-l border-gray-200">
            <Button
              onClick={onCreateClick}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Create New Mock
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Play className="w-4 h-4" />
              Run Tests
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
