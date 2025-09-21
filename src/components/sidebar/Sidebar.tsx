"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import "./Sidebar.css"

interface SidebarProps {
  activeItem: string
  onNavigate: (item: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate }) => {
  const navigate = useNavigate()

  const navItems = [
    { id: "journey", label: "Journey", icon: "📖", path: "/" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆", path: "/leaderboard" },
    { id: "store", label: "Store", icon: "🏪", path: "/store" },
    { id: "profile", label: "Perfil", icon: "👤", path: "/profile" },
    { id: "more", label: "More", icon: "⋯", path: "/more" },
  ]

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon">{"</>"}</div>
        <span className="logo-text">CodePath</span>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => {
              onNavigate(item.id)       // mantém seu estado de ativo
              navigate(item.path)       // faz o roteamento real
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar