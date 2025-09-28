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
            <p>Fundamentos teóricos da computação</p>
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

      {/* Sidebar direita estilo path_player */}
      <div className="right-sidebar">
        {/* Stats */}
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">0</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">17</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">5</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="widget">
          <div className="widget-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="widget-content">
            <button className="action-btn">Practice Weak Areas</button>
            <button className="action-btn">Review Mistakes</button>
            <button className="action-btn">Take Quiz</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="widget">
          <div className="widget-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="widget-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-text">
                  <div>Bubble Sort Quiz</div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📚</div>
                <div className="activity-text">
                  <div>Merge Sort Lesson</div>
                  <div className="activity-time">1 day ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🎯</div>
                <div className="activity-text">
                  <div>Quick Sort Challenge</div>
                  <div className="activity-time">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Path_player
