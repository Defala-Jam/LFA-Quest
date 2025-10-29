"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import {
  lessonsFase1,
  lessonsFase2,
  lessonsFase3,
  lessonsFase4,
  lessonsFase5,
} from "../../components/lession/LessonData"
import "./Statistics.css"

interface DecodedToken {
  id: number
  email: string
  exp: number
}

interface TagAnalytics {
  tag: string
  total_questions: number
  correct: number
  incorrect: number
  accuracy: number
  avg_time: number
}

interface AnalyticsData {
  total_questions: number
  total_correct: number
  total_incorrect: number
  tag_most_errors: string | null
  tags: TagAnalytics[]
}

const Statistics: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("more")
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const navigate = useNavigate()

  const navigator = (item: string) => setActiveNavItem(item)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const decoded: DecodedToken = jwtDecode(token)
      const userId = decoded.id

      Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}`).then((r) => r.json()),
        fetch(`http://localhost:5000/api/users/${userId}/analytics`).then((r) => r.json()),
      ])
        .then(([user, analytics]) => {
          setUserData(user)
          setAnalytics(analytics)
          setLoading(false)
        })
        .catch((err) => console.error("Erro ao carregar dados:", err))
    } catch (error) {
      console.error("Token inválido:", error)
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="loading">Carregando estatísticas...</div>
  if (!analytics)
    return (
      <div className="statistics-container">
        <Sidebar activeItem={activeNavItem} onNavigate={navigator} />
        <div className="statistics-main">
          <h1>Nenhum dado disponível</h1>
          <p>Resolva algumas questões para começar a gerar estatísticas!</p>
        </div>
      </div>
    )

  const accuracy = (analytics.total_correct / analytics.total_questions) * 100 || 0
  const avgTime = analytics.tags.reduce((acc, t) => acc + t.avg_time, 0) / (analytics.tags.length || 1)

  const handleReviewTopic = () => {
    if (!analytics || !analytics.tags || analytics.tags.length === 0) {
      alert("Nenhum dado disponível para revisão")
      return
    }

    const sortedTags = [...analytics.tags].sort((a, b) => a.accuracy - b.accuracy)
    const tagsToReview = sortedTags.slice(0, Math.max(2, Math.ceil(sortedTags.length * 0.3)))
    const tagNames = tagsToReview.map((t) => t.tag)

    console.log("[v0] Tags to review:", tagNames)

    const allLessons = [...lessonsFase1, ...lessonsFase2, ...lessonsFase3, ...lessonsFase4, ...lessonsFase5]

    const reviewQuestions = allLessons.filter(
      (lesson) => lesson.tags && lesson.tags.some((tag) => tagNames.includes(tag)),
    )

    console.log("[v0] Found", reviewQuestions.length, "questions to review")

    if (reviewQuestions.length === 0) {
      alert("Nenhuma questão encontrada para os tópicos com mais dificuldade")
      return
    }

    navigate("/path", {
      state: {
        reviewMode: true,
        reviewQuestions,
        reviewTags: tagNames,
      },
    })
  }

  return (
    <div className="statistics-container">
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      <div className="statistics-main">
        <div className="statistics-header">
          <h1>Estatísticas de Aprendizagem</h1>
          <p>Acompanhe seu progresso e desempenho nas lições.</p>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <h3>Total de Questões</h3>
            <p>{analytics.total_questions}</p>
          </div>
          <div className="overview-card">
            <h3>Taxa de Acerto</h3>
            <p>{accuracy.toFixed(1)}%</p>
          </div>
          <div className="overview-card">
            <h3>Tempo Médio Global</h3>
            <p>{avgTime.toFixed(1)}s</p>
          </div>
          <div className="overview-card warning">
            <h3>Tag com Mais Erros</h3>
            <p>{analytics.tag_most_errors || "Nenhuma ainda 🎉"}</p>
          </div>
        </div>

        <div className="tags-section">
          <h2>Selecione um Tópico</h2>
          <p className="section-description">Escolha uma tag para ver informações detalhadas sobre seu desempenho</p>
          <div className="tags-selector">
            {analytics.tags.map((tag, i) => (
              <button
                key={i}
                className={`tag-selector-btn ${selectedTag === tag.tag ? "active" : ""}`}
                onClick={() => setSelectedTag(tag.tag)}
              >
                <span className="tag-name">{tag.tag}</span>
                <span className="tag-count">{tag.total_questions} questões</span>
              </button>
            ))}
          </div>
        </div>

        {selectedTag ? (
          <div className="tag-details-section">
            <h2>Detalhes: {selectedTag}</h2>
            {analytics.tags
              .filter((tag) => tag.tag === selectedTag)
              .map((tag, i) => (
                <div key={i} className="tag-detail-card">
                  <div className="detail-stats-grid">
                    <div className="detail-stat">
                      <h3>Taxa de Acerto</h3>
                      <p className="stat-value-large">{(tag.accuracy * 100).toFixed(1)}%</p>
                      <div className="tag-progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${tag.accuracy * 100}%`,
                            backgroundColor:
                              tag.accuracy >= 0.8 ? "#10b981" : tag.accuracy >= 0.6 ? "#f59e0b" : "#ef4444",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="detail-stat">
                      <h3>Tempo Médio</h3>
                      <p className="stat-value-large">{tag.avg_time.toFixed(1)}s</p>
                    </div>
                    <div className="detail-stat">
                      <h3>Total de Questões</h3>
                      <p className="stat-value-large">{tag.total_questions}</p>
                    </div>
                    <div className="detail-stat">
                      <h3>Acertos</h3>
                      <p className="stat-value-large correct">{tag.correct}</p>
                    </div>
                    <div className="detail-stat">
                      <h3>Erros</h3>
                      <p className="stat-value-large incorrect">{tag.incorrect}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="no-selection-message">
            <p>👆 Selecione uma tag acima para ver informações detalhadas</p>
          </div>
        )}

        {analytics.tag_most_errors && (
          <div className="suggestion-section">
            <h2>Recomendação</h2>
            <p>
              Você parece ter mais dificuldade em <strong>{analytics.tag_most_errors}</strong>. Que tal revisar as
              lições dessa categoria?
            </p>
            <button className="review-btn" onClick={handleReviewTopic}>
              Revisar esse tópico
            </button>
          </div>
        )}
      </div>

      <div className="right-sidebar">
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">{userData?.streak_count ?? 0}</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">{userData?.diamonds ?? 0}</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">{userData?.xp ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
