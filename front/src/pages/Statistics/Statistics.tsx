"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Statistics.css";

interface TagStats {
  name: string;
  averageTime: number;
  successRate: number;
  totalQuestions: number;
  color: string;
}

interface Journey {
  id: string;
  name: string;
  progress: number;
  description: string;
}

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

const Statistics: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("more");
  const [selectedJourney, setSelectedJourney] = useState("afd-intro");
  const [userData, setUserData] = useState<any>(null);

  const navigator = (item: string) => {
    setActiveNavItem(item);
    console.log(`[v0] Navigating to: ${item}`);
  };

  // ================================
  // 🧠 Buscar dados do backend (usuário logado)
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      fetch(`http://localhost:5000/api/users/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar usuário");
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          console.log("✅ Dados do usuário carregados:", data);
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err));
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, []);

  // ================================
  // 🔹 Dados simulados de jornadas e tópicos
  // ================================
  const journeys: Journey[] = [
    {
      id: "afd-intro",
      name: "Introdução aos AFDs",
      progress: 75,
      description: "Conceitos básicos e definições de autômatos finitos",
    },
    {
      id: "afd-construction",
      name: "Construção de AFDs",
      progress: 45,
      description:
        "Métodos para construir autômatos determinísticos a partir de expressões regulares",
    },
    {
      id: "afd-minimization",
      name: "Minimização de AFDs",
      progress: 20,
      description:
        "Técnicas para simplificar autômatos mantendo a linguagem reconhecida",
    },
  ];

  const tagStats: TagStats[] = [
    {
      name: "Definições e Estados",
      averageTime: 10.5,
      successRate: 85,
      totalQuestions: 24,
      color: "#4f46e5",
    },
    {
      name: "Transições",
      averageTime: 12.2,
      successRate: 78,
      totalQuestions: 18,
      color: "#3b82f6",
    },
    {
      name: "Linguagem Reconhecida",
      averageTime: 9.8,
      successRate: 91,
      totalQuestions: 32,
      color: "#10b981",
    },
    {
      name: "Construção de AFD",
      averageTime: 14.1,
      successRate: 80,
      totalQuestions: 21,
      color: "#f59e0b",
    },
    {
      name: "Minimização",
      averageTime: 18.3,
      successRate: 70,
      totalQuestions: 15,
      color: "#ef4444",
    },
  ];

  const currentJourney =
    journeys.find((j) => j.id === selectedJourney) || journeys[0];

  // ================================
  // 🧩 Renderização
  // ================================
  return (
    <div className="statistics-container">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="statistics-main">
        <div className="statistics-header">
          <h1>Estatísticas de Aprendizagem</h1>
          <p>
            Acompanhe seu progresso e desempenho em Autômatos Finitos
            Determinísticos (AFD)
          </p>
        </div>

        {/* 🔹 Seção de Jornadas */}
        <div className="journey-section">
          <h2>Selecione a Jornada</h2>
          <div className="journey-cards">
            {journeys.map((journey) => (
              <div
                key={journey.id}
                className={`journey-card ${
                  selectedJourney === journey.id ? "active" : ""
                }`}
                onClick={() => setSelectedJourney(journey.id)}
              >
                <div className="journey-info">
                  <h3>{journey.name}</h3>
                  <p>{journey.description}</p>
                </div>
                <div className="journey-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${journey.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{journey.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 Visão geral da Jornada atual */}
        <div className="journey-overview">
          <h2>Jornada Atual: {currentJourney.name}</h2>
          <div className="overview-stats">
            <div className="overview-card">
              <div className="overview-value">{currentJourney.progress}%</div>
              <div className="overview-label">Progresso Geral</div>
            </div>
            <div className="overview-card">
              <div className="overview-value">110</div>
              <div className="overview-label">Total de Questões</div>
            </div>
            <div className="overview-card">
              <div className="overview-value">15.2s</div>
              <div className="overview-label">Tempo Médio de Resposta</div>
            </div>
            <div className="overview-card">
              <div className="overview-value">78%</div>
              <div className="overview-label">Taxa de Sucesso</div>
            </div>
          </div>
        </div>

        {/* 🔹 Desempenho por Tópico */}
        <div className="tags-section">
          <h2>Desempenho por Tópico</h2>
          <div className="tags-grid">
            {tagStats.map((tag, index) => (
              <div key={index} className="tag-card">
                <div className="tag-header">
                  <div
                    className="tag-indicator"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <h3>{tag.name}</h3>
                </div>
                <div className="tag-stats">
                  <div className="stat-item">
                    <div className="stat-value">{tag.averageTime}s</div>
                    <div className="stat-label">Tempo Médio</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{tag.successRate}%</div>
                    <div className="stat-label">Taxa de Sucesso</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{tag.totalQuestions}</div>
                    <div className="stat-label">Questões</div>
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

      {/* 🔹 Barra lateral direita */}
      <div className="right-sidebar">
        {/* Estatísticas do usuário logado */}
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">
              {userData ? userData.streak_count ?? 0 : 0}
            </span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">
              {userData ? userData.diamonds ?? 0 : 0}
            </span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">
              {userData ? userData.xp ?? 0 : 0}
            </span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="widget">
          <div className="widget-header">
            <h3>Leaderboard</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>
                Continue estudando para acumular XP e subir no ranking de
                aprendizado!
              </p>
            </div>
          </div>
        </div>

        {/* Missões Diárias */}
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

        {/* Caso o usuário não esteja logado */}
        {!userData && (
          <div className="widget login-widget">
            <div className="widget-header">
              <h3>Entre para ver suas estatísticas!</h3>
            </div>
            <div className="widget-content">
              <p style={{ textAlign: "center" }}>
                Faça login para acompanhar seu progresso em tempo real.
              </p>
              <button
                className="login-btn login-btn-alt"
                onClick={() => (window.location.href = "/path")}
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
