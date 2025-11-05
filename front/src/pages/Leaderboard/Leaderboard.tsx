"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./leaderboard.css";

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

const Leaderboard: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("leaderboard");
  const [userData, setUserData] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);

  const navigator = (item: string) => setActiveNavItem(item);

  // ================================
  // 🧠 Buscar dados do backend
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      // Busca o usuário logado
      fetch(`http://localhost:5000/api/users/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar usuário");
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          console.log("✅ Usuário carregado:", data);
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err));
    } catch (error) {
      console.error("Token inválido:", error);
    }

    // Busca ranking geral (caso tenha endpoint futuro)
    // Por enquanto simula usuários
    const fakeRanking = [
      { id: 1, name: "Alice", xp: 120, avatar: "👩" },
      { id: 5, name: "Bruno", xp: 95, avatar: "🧑" },
      { id: 3, name: "Carla", xp: 80, avatar: "👩‍🦱" },
      { id: 4, name: "Daniel", xp: 60, avatar: "👨" },
    ];
    setRanking(fakeRanking);
  }, []);

  // Adiciona o próprio usuário ao ranking (dinamicamente)
  const completeRanking = userData
    ? [
        ...ranking,
        {
          id: userData.id,
          name: userData.name,
          xp: userData.xp,
          avatar: "🙂",
        },
      ]
    : ranking;

  // Ordena por XP (maior primeiro)
  const sortedRanking = [...completeRanking].sort((a, b) => b.xp - a.xp);

  return (
    <div className="leaderboard-layout">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="leaderboard-main">
        <div className="leaderboard-header">
          <h2>Leaderboard</h2>
          <p>Veja sua posição no ranking!</p>
        </div>

        <div className="leaderboard-list">
          {sortedRanking.map((userItem, index) => (
            <div
              key={userItem.id}
              className={`leaderboard-item ${
                userData && userItem.id === userData.id ? "me" : ""
              }`}
            >
              <span className="position">#{index + 1}</span>
              <span className="avatar">{userItem.avatar}</span>
              <span className="name">{userItem.name}</span>
              <span className="xp">{userItem.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        {/* 🔹 Estatísticas do usuário */}
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

        {/* Leaderboard info */}
        <div className="widget">
          <div className="widget-header">
            <h3>Leaderboard</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>
                Continue aprendendo para ganhar XP e subir no ranking semanal!
              </p>
            </div>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="widget">
          <div className="widget-header">
            <h3>Missões Diárias</h3>
            <button className="view-button">Ver</button>
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
              <h3>Entre para aparecer no ranking!</h3>
            </div>
            <div className="widget-content">
              <p style={{ textAlign: "center" }}>
                Faça login para ver seu progresso e competir!
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

export default Leaderboard;
