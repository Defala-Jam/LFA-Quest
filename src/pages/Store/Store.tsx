"use client"

import { useState } from "react"
import Sidebar from "../../components/sidebar/Sidebar"
import "./Store.css"

interface StoreItem {
  id: number
  name: string
  type: "avatar" | "background" | "item"
  cost: number
  unlocked: boolean
  emoji?: string
  gradient?: string
}

const Store: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("store")
  const [diamonds, setDiamonds] = useState(17) // saldo do jogador

  // Lista de itens da loja
  const storeItems: StoreItem[] = [
    { id: 1, name: "Coder", type: "avatar", cost: 5, unlocked: true, emoji: "👨‍💻" },
    { id: 2, name: "Student", type: "avatar", cost: 10, unlocked: false, emoji: "🎓" },
    { id: 3, name: "Ninja", type: "avatar", cost: 12, unlocked: false, emoji: "🥷" },
    { id: 4, name: "Robot", type: "avatar", cost: 15, unlocked: false, emoji: "🤖" },
    { id: 5, name: "Forest", type: "background", cost: 8, unlocked: true, gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
    { id: 6, name: "Sunset", type: "background", cost: 12, unlocked: false, gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
    { id: 7, name: "Purple", type: "background", cost: 15, unlocked: false, gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
    { id: 8, name: "Shield", type: "item", cost: 20, unlocked: false, emoji: "🛡️" },
  ]

  const handlePurchase = (item: StoreItem) => {
    if (item.unlocked) return
    if (diamonds >= item.cost) {
      setDiamonds(diamonds - item.cost)
      alert(`✅ Você comprou ${item.name}!`)
      // aqui você pode salvar no backend que o item foi desbloqueado
    } else {
      alert("❌ Diamantes insuficientes!")
    }
  }

  return (
    <div className="store-layout">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={setActiveNavItem} />

      {/* Conteúdo central */}
      <div className="store-main">
        <h1 className="store-title">Game Store</h1>
        <p className="store-balance">💎 Seus diamantes: {diamonds}</p>

        {/* Avatares */}
        <div className="store-section">
          <h2>Avatares</h2>
          <div className="store-grid">
            {storeItems.filter(i => i.type === "avatar").map(item => (
              <div 
                key={item.id} 
                className={`store-item ${item.unlocked ? "unlocked" : "locked"}`} 
                onClick={() => handlePurchase(item)}
              >
                <div className="store-icon">{item.emoji}</div>
                <p>{item.name}</p>
                <span>{item.unlocked ? "✅ Desbloqueado" : `💎 ${item.cost}`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Backgrounds */}
        <div className="store-section">
          <h2>Backgrounds</h2>
          <div className="store-grid">
            {storeItems.filter(i => i.type === "background").map(item => (
              <div 
                key={item.id} 
                className={`store-item ${item.unlocked ? "unlocked" : "locked"}`} 
                style={{ background: item.gradient }}
                onClick={() => handlePurchase(item)}
              >
                <p>{item.name}</p>
                <span>{item.unlocked ? "✅ Desbloqueado" : `💎 ${item.cost}`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Itens */}
        <div className="store-section">
          <h2>Itens</h2>
          <div className="store-grid">
            {storeItems.filter(i => i.type === "item").map(item => (
              <div 
                key={item.id} 
                className={`store-item ${item.unlocked ? "unlocked" : "locked"}`} 
                onClick={() => handlePurchase(item)}
              >
                <div className="store-icon">{item.emoji}</div>
                <p>{item.name}</p>
                <span>{item.unlocked ? "✅ Desbloqueado" : `💎 ${item.cost}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar direita (igual ao Perfil) */}
      <div className="perfil-right-sidebar">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💎</span>
            <span className="stat-value">{diamonds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span className="stat-value">5</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button className="action-btn">Practice Weak Areas</button>
          <button className="action-btn">Review Mistakes</button>
          <button className="action-btn">Take Quiz</button>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-text">
                <div>Purchased Coder Avatar</div>
                <div className="activity-time">Today</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🛡️</div>
              <div className="activity-text">
                <div>Unlocked Shield</div>
                <div className="activity-time">Yesterday</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💎</div>
              <div className="activity-text">
                <div>Earned 5 Diamonds</div>
                <div className="activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Store
