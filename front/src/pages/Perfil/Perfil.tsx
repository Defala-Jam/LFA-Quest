"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import Sidebar from "../../components/sidebar/Sidebar"
import "./Perfil.css"

interface PerfilProps {
  onNavigate?: (section: string) => void
}

interface DecodedToken {
  id: number
  email: string
  exp: number
}

const Perfil: React.FC<PerfilProps> = ({ onNavigate }) => {
  const [activeItem, setActiveItem] = useState("profile")
  const [selectedAvatar, setSelectedAvatar] = useState(0)
  const [selectedBackground, setSelectedBackground] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // 🔹 Buscar dados do usuário logado
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const decoded: DecodedToken = jwtDecode(token)
      fetch(`http://localhost:5000/api/users/${decoded.id}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Erro ao carregar usuário:", err))
    } catch (error) {
      console.error("Token inválido:", error)
    }
  }, [])

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/path"
  }

  // Avatares disponíveis
  const avatarPresets = [
    { id: 0, name: "Padrão", emoji: "👤" },
    { id: 1, name: "Programador", emoji: "👨‍💻" },
    { id: 2, name: "Estudante", emoji: "🎓" },
    { id: 3, name: "Ninja", emoji: "🥷" },
    { id: 4, name: "Robô", emoji: "🤖" },
    { id: 5, name: "Mago", emoji: "🧙‍♂️" },
  ]

  // Fundos disponíveis
  const backgroundPresets = [
    { id: 0, name: "Padrão", gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" },
    { id: 1, name: "Oceano", gradient: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)" },
    { id: 2, name: "Floresta", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
    { id: 3, name: "Pôr do Sol", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
    { id: 4, name: "Roxo", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
    { id: 5, name: "Noite", gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" },
  ]

  // Conquistas
  const badges = [
    { id: 1, name: "Perfil Básico", description: "Adicionou uma bio ao perfil", progress: "0/3", icon: "❓", completed: false },
    { id: 2, name: "O Começo", description: "Resolveu 3 problemas de programação", progress: "1/5", icon: "💡", completed: true },
    { id: 3, name: "Codificador Diário", description: "Manteve uma sequência de 3 dias", progress: "0/5", icon: "❓", completed: false },
  ]

  const navigator = (item: string) => {
    setActiveItem(item)
    onNavigate?.(item)
  }

  return (
    <div className="perfil-layout">
      <Sidebar activeItem={activeItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="perfil-main">
        {/* Cabeçalho e avatar */}
        <div
          className="widget perfil-header"
          style={{ background: backgroundPresets[selectedBackground].gradient }}
        >
          <div className="avatar-silhouette">
            <div className="avatar-display">{avatarPresets[selectedAvatar].emoji}</div>
          </div>
          <button className="edit-button">✏️</button>
        </div>

        {/* Informações do usuário */}
        <div className="widget user-info-section">
          <h1 className="username">{userData ? userData.name : "Carregando..."}</h1>
          <p className="user-subtitle">{userData ? userData.email : ""}</p>
        </div>

        {/* Estatísticas principais */}
        <div className="widget-stats-cards">
          <div className="stat-card">
            <div className="stat-icon-large">🔥</div>
            <div className="stat-info">
              <div className="stat-number">0</div>
              <div className="stat-label">Sequência</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-large">⚡</div>
            <div className="stat-info">
              <div className="stat-number">{userData ? userData.xp : 0}</div>
              <div className="stat-label">XP Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-large">💎</div>
            <div className="stat-info">
              <div className="stat-number">{userData ? userData.diamonds : 0}</div>
              <div className="stat-label">Diamantes</div>
            </div>
          </div>
        </div>

        {/* Conquistas */}
        <div className="widget badges-section">
          <h2 className="section-title">Conquistas</h2>
          <div className="badges-list">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`badge-item ${badge.completed ? "completed" : ""}`}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                </div>
                <div className="badge-progress">{badge.progress}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalização */}
        <div className="widget customization-section">
          <div className="customization-group">
            <h3 className="customization-title">Escolher Avatar</h3>
            <div className="avatar-presets">
              {avatarPresets.map((avatar) => (
                <button
                  key={avatar.id}
                  className={`avatar-preset ${selectedAvatar === avatar.id ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  title={avatar.name}
                >
                  <span className="preset-emoji">{avatar.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="customization-group">
            <h3 className="customization-title">Tema de Fundo</h3>
            <div className="background-presets">
              {backgroundPresets.map((bg) => (
                <button
                  key={bg.id}
                  className={`background-preset ${selectedBackground === bg.id ? "selected" : ""}`}
                  onClick={() => setSelectedBackground(bg.id)}
                  style={{ background: bg.gradient }}
                  title={bg.name}
                >
                  <span className="preset-name">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        {/* Estatísticas rápidas */}
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">0</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">{userData ? userData.diamonds : 0}</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">{userData ? userData.xp : 0}</span>
          </div>
        </div>

        {/* Ranking */}
        <div className="widget">
          <div className="widget-header">
            <h3>Ranking</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>Comece a aprender e ganhe XP para entrar no ranking desta semana!</p>
            </div>
          </div>
        </div>

        {/* Metas Diárias */}
        <div className="widget">
          <div className="widget-header">
            <h3>Metas Diárias</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="goal-item">
              <div className="goal-text">
                <span>Concluir 5 lições</span>
                <span className="goal-progress">0/5</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Resolver 3 desafios na primeira tentativa</span>
                <span className="goal-progress">0/3</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
          </div>
        </div>

        {/* 🧩 Widget de Logout */}
        <div className="widget logout-widget">
          <div className="widget-header">
            <h3>Encerrar Sessão</h3>
          </div>
          <div className="widget-content">
            <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up de Confirmação de Logout */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal logout-modal">
            <h2>Deseja realmente sair?</h2>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleLogout}>
                Sim, sair
              </button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Perfil
