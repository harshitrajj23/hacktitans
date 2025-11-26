"use client"
import DashboardContent from "./dashboard-content"
import MockAPIsContent from "./mock-apis-content"
import CreateMockAPIContent from "./create-mock-api-content"
import TestSuitesContent from "./test-suites-content"
import SettingsContent from "./settings-content"

interface MainContentProps {
  activeNav: string
}

export default function MainContent({ activeNav }: MainContentProps) {
  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="p-8">
        {activeNav === "dashboard" && <DashboardContent />}
        {activeNav === "mock-apis" && <MockAPIsContent />}
        {activeNav === "create-mock-api" && <CreateMockAPIContent />}
        {(activeNav === "test-suites" || activeNav === "ci-integration") && <TestSuitesContent />}
        {activeNav === "settings" && <SettingsContent />}
      </div>
    </main>
  )
}
