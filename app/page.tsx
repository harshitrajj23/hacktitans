"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import MainContent from "@/components/main-content"

export default function Home() {
  const [activeNav, setActiveNav] = useState("dashboard")

  const handleCreateClick = () => {
    setActiveNav("create-mock-api")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCreateClick={handleCreateClick} />
        <MainContent activeNav={activeNav} />
      </div>
    </div>
  )
}
