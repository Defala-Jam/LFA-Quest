"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../../components/sidebar/Sidebar"
import "./path_player.css"

const Path_player: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("journey")

  const navigator = (item: string) => {
    setActiveNavItem(item)
    console.log(`[v0] Navigating to: ${item}`)
    // Add your navigation logic here (e.g., routing, content switching)
  }

  return (
    <div className="app-container">
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <button className="back-button">←</button>
          <div className="header-info">
            <h2>Section 1, Chapter 1</h2>
            <p>Sorting Algorithms Fundamentals</p>
          </div>
        </div>

        {/* Learning Path */}
        <div className="learning-path">
          <div className="path-title">Sorting Algorithms Fundamentals</div>

          <div className="path-nodes">
            <div className="path-node completed">
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
            </div>

            <div className="path-connector"></div>

            <div className="path-node completed">
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
            </div>

            <div className="path-connector"></div>

            <div className="path-node completed">
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
            </div>
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
              <p>Start learning and earning XP to join this week's leaderboard!</p>
            </div>
          </div>
        </div>

        {/* Daily Goals */}
        <div className="widget">
          <div className="widget-header">
            <h3>Daily Goals</h3>
            <button className="view-button">View</button>
          </div>
          <div className="widget-content">
            <div className="goal-item">
              <div className="goal-text">
                <span>Complete 5 lessons</span>
                <span className="goal-progress">0/5</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Solve 3 challenges on first try</span>
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

export default Path_player
