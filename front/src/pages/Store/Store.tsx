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



             {/* Right Sidebar */}
      <div className="right-sidebar">
        {/* Stats */}
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">0</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">9</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">5</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="widget">
          <div className="widget-header">
            <h3>Leaderboard</h3>
            <button className="view-button">View</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>Começe a aprender!! Começe seu Caminho e Ganhe um Lugar no Leaderboard</p>
            </div>
          </div>
        </div>

        {/* Daily Goals */}
        <div className="widget">
          <div className="widget-header">
            <h3>Missões Diárias</h3>
            <button className="view-button">Revisão</button>
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

export default Store
