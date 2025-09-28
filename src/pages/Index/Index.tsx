"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./index.css"

const Index: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<string | null>(null)
  const navigate = useNavigate()


  
  const algorithms = [
    {
      name: "Bubble Sort",
      description: "Simple comparison-based sorting algorithm",
      complexity: "O(n²)",
      icon: "🫧",
    },
    {
      name: "Merge Sort",
      description: "Divide-and-conquer sorting algorithm",
      complexity: "O(n log n)",
      icon: "🔀",
    },
    {
      name: "Insertion Sort",
      description: "Builds sorted array one element at a time",
      complexity: "O(n²)",
      icon: "📥",
    },
    {
      name: "Selection Sort",
      description: "Finds minimum element and places it at beginning",
      complexity: "O(n²)",
      icon: "🎯",
    },
  ]

  const features = [
    {
      title: "Interactive Learning",
      description: "Learn algorithms through hands-on practice and visual demonstrations",
      icon: "🎮",
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed statistics and achievements",
      icon: "📊",
    },
    {
      title: "Gamified Experience",
      description: "Earn streaks, gems, and compete on leaderboards while learning",
      icon: "🏆",
    },
    {
      title: "Personalized Path",
      description: "Adaptive learning paths tailored to your skill level and pace",
      icon: "🛤️",
    },
  ]

  return (
    <div className="index-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master <span className="highlight">Sorting Algorithms</span> Like Never Before
          </h1>
          <p className="hero-subtitle">
            Learn computer science fundamentals through interactive lessons, visual demonstrations, and gamified
            challenges. Start your coding journey today.
          </p>
          <div className="hero-buttons">
            <button className="cta-primary" onClick={() => {navigate("/path")}}>Start Learning</button>
            <button className="cta-secondary">Watch Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="algorithm-preview">
            <div className="sorting-bars">
              {[40, 20, 60, 30, 80, 10, 50].map((height, index) => (
                <div key={index} className="bar" style={{ height: `${height}px` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="algorithms-section">
        <h2 className="section-title">Explore Sorting Algorithms</h2>
        <p className="section-subtitle">
          Dive deep into the most important sorting algorithms used in computer science
        </p>
        <div className="algorithms-grid">
          {algorithms.map((algorithm, index) => (
            <div
              key={index}
              className={`algorithm-card ${activeAlgorithm === algorithm.name ? "active" : ""}`}
              onMouseEnter={() => setActiveAlgorithm(algorithm.name)}
              onMouseLeave={() => setActiveAlgorithm(null)}
            >
              <div className="algorithm-icon">{algorithm.icon}</div>
              <h3 className="algorithm-name">{algorithm.name}</h3>
              <p className="algorithm-description">{algorithm.description}</p>
              <div className="algorithm-complexity">
                <span className="complexity-label">Time Complexity:</span>
                <span className="complexity-value">{algorithm.complexity}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Platform?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="index-stats-section">
        <div className="index-stats-container">
          <div className="index-stat-item">
            <div className="index-stat-number">10K+</div>
            <div className="index-stat-label">Students Learning</div>
          </div>
          <div className="index-stat-item">
            <div className="index-stat-number">50+</div>
            <div className="index-stat-label">Interactive Lessons</div>
          </div>
          <div className="index-stat-item">
            <div className="index-stat-number">95%</div>
            <div className="index-stat-label">Success Rate</div>
          </div>
          <div className="index-stat-item">
            <div className="index-stat-number">4.9★</div>
            <div className="index-stat-label">Student Rating</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Algorithm Journey?</h2>
          <p className="cta-description">
            Join thousands of students who have mastered sorting algorithms through our interactive platform
          </p>
          <button className="cta-primary large" onClick={() => {navigate("/path")}}>Get Started for Free</button>
        </div>
      </section>
    </div>
  )
}

export default Index
