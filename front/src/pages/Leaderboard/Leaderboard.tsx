"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../../components/sidebar/Sidebar"
import "./leaderboard.css"

const Leaderboard: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("leaderboard")

  // 🔹 Dados do usuário logado (mesmo esquema do PathPlayer)
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const navigator = (item: string) => {
    setActiveNavItem(item)
  }

  // 🔹 Ranking de exemplo (poderá vir da API futuramente)
  const ranking = [
    { id: 1, name: "Alice", xp: 120, avatar: "👩" },
    { id: 2, name: "Bruno", xp: 95, avatar: "🧑" },
    { id: 3, name: "Carla", xp: 80, avatar: "👩‍🦱" },
    { id: 4, name: "Daniel", xp: 60, avatar: "👨" },
    {
      id: user?.id || 999,
      name: user?.name || "Você",
      xp: user?.xp ?? 0,
      avatar: "🙂",
    },
  ]

  // Ordena o ranking pelo XP (maior primeiro)
  const sortedRanking = [...ranking].sort((a, b) => b.xp - a.xp)

  return (
    <div className="leaderboard-layout">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="leaderboard-main">
        <div className="leaderboard-header">
          <h2>Leaderboard</h2>
          <p>Veja sua posição no ranking!</p>
        </div>

        <div className="leaderboard-list">
          {sortedRanking.map((userItem, index) => (
            <div
              key={userItem.id}
              className={`leaderboard-item ${
                userItem.id === user?.id ? "me" : ""
              }`}
            >
              <span className="position">#{index + 1}</span>
              <span className="avatar">{userItem.avatar}</span>
              <span className="name">{userItem.name}</span>
              <span className="xp">{userItem.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        {/* 🔹 Estatísticas do usuário */}
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">{user?.streak ?? 0}</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">{user?.diamonds ?? 0}</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">{user?.xp ?? 0}</span>
          </div>
        </div>

        {/* Leaderboard info */}
        <div className="widget">
          <div className="widget-header">
            <h3>Leaderboard</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>
                Continue aprendendo para ganhar XP e subir no ranking semanal!
              </p>
            </div>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="widget">
          <div className="widget-header">
            <h3>Missões Diárias</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="goal-item">
              <div className="goal-text">
                <span>Complete 5 missões</span>
                <span className="goal-progress">0/5</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Resolva 3 questões na primeira tentativa</span>
                <span className="goal-progress">0/3</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
