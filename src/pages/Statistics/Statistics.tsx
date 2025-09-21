"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../../components/sidebar/Sidebar"
import "./Statistics.css"

interface TagStats {
  name: string
  averageTime: number
  successRate: number
  totalQuestions: number
  color: string
}

interface Journey {
  id: string
  name: string
  progress: number
  description: string
}

const Statistics: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("more")
  const [selectedJourney, setSelectedJourney] = useState("algorithms")

  const navigator = (item: string) => {
    setActiveNavItem(item)
    console.log(`[v0] Navigating to: ${item}`)
    // Add your navigation logic here (e.g., routing, content switching)
  }

  const journeys: Journey[] = [
    {
      id: "algorithms",
      name: "Sorting Algorithms",
      progress: 75,
      description: "Master fundamental sorting techniques",
    },
    { id: "datastructures", name: "Data Structures", progress: 45, description: "Learn essential data organization" },
    { id: "advanced", name: "Advanced Concepts", progress: 20, description: "Complex algorithmic patterns" },
  ]

  const tagStats: TagStats[] = [
    { name: "Bubble Sort", averageTime: 12.5, successRate: 85, totalQuestions: 24, color: "#4f46e5" },
    { name: "Merge Sort", averageTime: 18.2, successRate: 72, totalQuestions: 18, color: "#3b82f6" },
    { name: "Insertion Sort", averageTime: 9.8, successRate: 91, totalQuestions: 32, color: "#10b981" },
    { name: "Selection Sort", averageTime: 14.1, successRate: 78, totalQuestions: 21, color: "#f59e0b" },
    { name: "Quick Sort", averageTime: 22.3, successRate: 65, totalQuestions: 15, color: "#ef4444" },
  ]

  const currentJourney = journeys.find((j) => j.id === selectedJourney) || journeys[0]

  return (
    <div className="statistics-container">
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      <div className="statistics-main">
        <div className="statistics-header">
          <h1>Learning Statistics</h1>
          <p>Track your progress and performance across different topics</p>
        </div>

        {/* Journey Selection */}
        <div className="journey-section">
          <h2>Select Journey</h2>
          <div className="journey-cards">
            {journeys.map((journey) => (
              <div
                key={journey.id}
                className={`journey-card ${selectedJourney === journey.id ? "active" : ""}`}
                onClick={() => setSelectedJourney(journey.id)}
              >
                <div className="journey-info">
                  <h3>{journey.name}</h3>
                  <p>{journey.description}</p>
                </div>
                <div className="journey-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${journey.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{journey.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Journey Overview */}
        <div className="journey-overview">
          <h2>Current Journey: {currentJourney.name}</h2>
          <div className="overview-stats">
            <div className="overview-card">
              <div className="overview-value">75%</div>
              <div className="overview-label">Overall Progress</div>
            </div>
            <div className="overview-card">
              <div className="overview-value">110</div>
              <div className="overview-label">Total Questions</div>
            </div>
            <div className="overview-card">
              <div className="overview-value">15.2s</div>
              <div className="overview-label">Avg Response Time</div>
            </div>
            <div className="overview-card">
              <div className="overview-value">78%</div>
              <div className="overview-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Tag Statistics */}
        <div className="tags-section">
          <h2>Performance by Topic</h2>
          <div className="tags-grid">
            {tagStats.map((tag, index) => (
              <div key={index} className="tag-card">
                <div className="tag-header">
                  <div className="tag-indicator" style={{ backgroundColor: tag.color }}></div>
                  <h3>{tag.name}</h3>
                </div>
                <div className="tag-stats">
                  <div className="stat-item">
                    <div className="stat-value">{tag.averageTime}s</div>
                    <div className="stat-label">Avg Time</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{tag.successRate}%</div>
                    <div className="stat-label">Success Rate</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{tag.totalQuestions}</div>
                    <div className="stat-label">Questions</div>
                  </div>
                </div>
                <div className="tag-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${tag.successRate}%`,
                        backgroundColor: tag.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="statistics-right-sidebar">
        {/* Stats */}
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💎</span>
            <span className="stat-value">17</span>
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
  )
}

export default Statistics
