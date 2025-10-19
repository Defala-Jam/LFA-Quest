"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./index.css"

const Index: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const navigate = useNavigate()

  const topics = [
    {
      name: "Autômatos Finitos",
      description: "Modelos computacionais que reconhecem linguagens regulares.",
      complexity: "Determinísticos e não-determinísticos",
      icon: "🔁",
    },
    {
      name: "Autômatos Infinitos",
      description: "Autômatos que processam palavras infinitas, como Büchi e Muller.",
      complexity: "Processamento contínuo",
      icon: "♾️",
    },
    {
      name: "Lema do Bombeamento",
      description: "Ferramenta usada para provar que uma linguagem não é regular.",
      complexity: "Prova por contradição",
      icon: "💣",
    },
    {
      name: "Máquinas de Turing",
      description: "Modelo teórico que define a noção de computabilidade.",
      complexity: "Tese de Church-Turing",
      icon: "🖥️",
    },
  ]

  const features = [
    {
      title: "Aprendizado Interativo",
      description: "Explore conceitos teóricos com animações e simulações visuais.",
      icon: "🎮",
    },
    {
      title: "Acompanhamento de Progresso",
      description: "Monitore seu domínio em tópicos como linguagens formais e autômatos.",
      icon: "📊",
    },
    {
      title: "Experiência Gamificada",
      description: "Ganhe pontos, avance em trilhas e supere desafios teóricos.",
      icon: "🏆",
    },
    {
      title: "Trilha Personalizada",
      description: "Conteúdo adaptado ao seu conhecimento em teoria da computação.",
      icon: "🛤️",
    },
  ]

  return (
    <div className="index-container">
      {/* Seção Principal (Hero) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Domine os <span className="highlight">Fundamentos da Computação</span> como nunca antes
          </h1>
          <p className="hero-subtitle">
            Aprenda teoria da computação por meio de lições visuais, demonstrações interativas e uma abordagem prática.
            Descubra o poder dos autômatos, linguagens formais e máquinas teóricas.
          </p>
          <div className="hero-buttons">
            <button className="cta-primary" onClick={() => navigate("/path")}>
              Começar a Aprender
            </button>
            <button className="cta-secondary">Ver Demonstração</button>
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

      {/* Seção de Tópicos Teóricos */}
      <section className="algorithms-section">
        <h2 className="section-title">Explore os Fundamentos da Computação</h2>
        <p className="section-subtitle">
          Aprofunde-se nos principais conceitos da teoria da computação e compreenda os limites do que é computável.
        </p>
        <div className="algorithms-grid">
          {topics.map((topic, index) => (
            <div
              key={index}
              className={`algorithm-card ${activeTopic === topic.name ? "active" : ""}`}
              onMouseEnter={() => setActiveTopic(topic.name)}
              onMouseLeave={() => setActiveTopic(null)}
            >
              <div className="algorithm-icon">{topic.icon}</div>
              <h3 className="algorithm-name">{topic.name}</h3>
              <p className="algorithm-description">{topic.description}</p>
              <div className="algorithm-complexity">
                <span className="complexity-label">Classificação:</span>
                <span className="complexity-value">{topic.complexity}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Recursos */}
      <section className="features-section">
        <h2 className="section-title">Por que escolher nossa plataforma?</h2>
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

      {/* Estatísticas */}
      <section className="index-stats-section">
        <div className="index-stats-container">
          <div className="index-stat-item">
            <div className="index-stat-number">10 mil+</div>
            <div className="index-stat-label">Estudantes Explorando Teoria</div>
          </div>
          <div className="index-stat-item">
            <div className="index-stat-number">50+</div>
            <div className="index-stat-label">Tópicos e Simulações</div>
          </div>
          <div className="index-stat-item">
            <div className="index-stat-number">95%</div>
            <div className="index-stat-label">Taxa de Compreensão</div>
          </div>
          <div className="index-stat-item">
            <div className="index-stat-number">4.9★</div>
            <div className="index-stat-label">Avaliação dos Estudantes</div>
          </div>
        </div>
      </section>

      {/* Seção Final (Chamada para Ação) */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para mergulhar na Teoria da Computação?</h2>
          <p className="cta-description">
            Junte-se a milhares de estudantes que dominaram os fundamentos teóricos com nossa plataforma interativa.
          </p>
          <button className="cta-primary large" onClick={() => navigate("/path")}>
            Comece Gratuitamente
          </button>
        </div>
      </section>
    </div>
  )
}

export default Index
