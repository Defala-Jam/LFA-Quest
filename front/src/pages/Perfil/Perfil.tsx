"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Perfil.css";

interface PerfilProps {
  onNavigate?: (section: string) => void;
}

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

interface Purchase {
  item_name: string;
  type: string;
}

const Perfil: React.FC<PerfilProps> = ({ onNavigate }) => {
  const [activeItem, setActiveItem] = useState("profile");
  const [userData, setUserData] = useState<any>(null);
  const [purchasedItems, setPurchasedItems] = useState<Purchase[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // =====================================
  // 🧠 Buscar dados do usuário + compras
  // =====================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      // 🔹 Dados do usuário
      fetch(`http://localhost:5000/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          console.log("✅ Perfil carregado:", data);
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err));

      // 🔹 Compras realizadas
      fetch(`http://localhost:5000/api/store/purchases/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setPurchasedItems(data);
          console.log("🛒 Compras do usuário:", data);
        })
        .catch((err) => console.error("Erro ao carregar compras:", err));
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, []);

  // =====================================
  // 🧩 Avatares e fundos disponíveis
  // =====================================
  const avatarPresets = [
    { id: 0, name: "Padrão", emoji: "👤" },
    { id: 1, name: "Coder", emoji: "👨‍💻" },
    { id: 2, name: "Student", emoji: "🎓" },
    { id: 3, name: "Ninja", emoji: "🥷" },
    { id: 4, name: "Robot", emoji: "🤖" },
  ];

  const backgroundPresets = [
    { id: 0, name: "Padrão", gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" },
    { id: 1, name: "Forest", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
    { id: 2, name: "Sunset", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
    { id: 3, name: "Purple", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
  ];

  // =====================================
  // 🟢 Filtra desbloqueados (com base nas compras)
  // =====================================
  const unlockedAvatars = avatarPresets.filter(
    (a) => a.id === 0 || purchasedItems.some((p) => p.item_name === a.name && p.type === "avatar")
  );

  const unlockedBackgrounds = backgroundPresets.filter(
    (b) => b.id === 0 || purchasedItems.some((p) => p.item_name === b.name && p.type === "background")
  );

  // =====================================
  // 💾 Carrega/salva avatar e fundo selecionados
  // =====================================
  useEffect(() => {
    const savedAvatar = localStorage.getItem("selectedAvatar");
    const savedBackground = localStorage.getItem("selectedBackground");
    if (savedAvatar) setSelectedAvatar(Number(savedAvatar));
    if (savedBackground) setSelectedBackground(Number(savedBackground));
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedAvatar", String(selectedAvatar));
    localStorage.setItem("selectedBackground", String(selectedBackground));
  }, [selectedAvatar, selectedBackground]);

  // =====================================
  // 🚪 Logout
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedAvatar");
    localStorage.removeItem("selectedBackground");
    window.location.href = "/path";
  };

  const navigator = (item: string) => {
    setActiveItem(item);
    onNavigate?.(item);
  };

  // =====================================
  // 🏅 Conquistas
  // =====================================
  const badges = [
    { id: 1, name: "Perfil Básico", description: "Adicionou uma bio ao perfil", progress: "0/3", icon: "🧩", completed: false },
    { id: 2, name: "O Começo", description: "Resolveu 3 problemas de programação", progress: "3/5", icon: "💡", completed: true },
    { id: 3, name: "Codificador Diário", description: "Manteve uma sequência de 3 dias", progress: "2/5", icon: "🔥", completed: false },
  ];

  // =====================================
  // 🖼️ Renderização Completa
  // =====================================
  return (
    <div className="perfil-layout">
      <Sidebar activeItem={activeItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="perfil-main">
        {/* Cabeçalho e avatar */}
        <div
          className="widget perfil-header"
          style={{ background: unlockedBackgrounds[selectedBackground]?.gradient }}
        >
          <div className="avatar-silhouette">
            <div className="avatar-display">
              {unlockedAvatars[selectedAvatar]?.emoji}
            </div>
          </div>
          <button className="edit-button">✏️</button>
        </div>

        {/* Informações do usuário */}
        <div className="widget user-info-section">
          <h1 className="username">{userData ? userData.name : "Carregando..."}</h1>
          <p className="user-subtitle">{userData ? userData.email : ""}</p>
        </div>


        {/* Conquistas */}
        <div className="widget badges-section">
          <h2 className="section-title">Conquistas</h2>
          <div className="badges-list">
            {badges.map((badge) => (
              <div key={badge.id} className={`badge-item ${badge.completed ? "completed" : ""}`}>
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                </div>
                <div className="badge-progress">{badge.progress}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalização */}
        <div className="widget customization-section">
          <div className="customization-group">
            <h3 className="customization-title">Escolher Avatar</h3>
            <div className="avatar-presets">
              {unlockedAvatars.map((avatar, index) => (
                <button
                  key={avatar.id}
                  className={`avatar-preset ${selectedAvatar === index ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(index)}
                  title={avatar.name}
                >
                  <span className="preset-emoji">{avatar.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="customization-group">
            <h3 className="customization-title">Tema de Fundo</h3>
            <div className="background-presets">
              {unlockedBackgrounds.map((bg, index) => (
                <button
                  key={bg.id}
                  className={`background-preset ${selectedBackground === index ? "selected" : ""}`}
                  onClick={() => setSelectedBackground(index)}
                  style={{ background: bg.gradient }}
                  title={bg.name}
                >
                  <span className="preset-name">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        {/* Estatísticas rápidas */}
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

        {/* Ranking */}
        <div className="widget">
          <div className="widget-header">
            <h3>Ranking</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>Comece a aprender e ganhe XP para entrar no ranking desta semana!</p>
            </div>
          </div>
        </div>

        {/* Metas Diárias */}
        <div className="widget">
          <div className="widget-header">
            <h3>Metas Diárias</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="goal-item">
              <div className="goal-text">
                <span>Concluir 5 lições</span>
                <span className="goal-progress">0/5</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Resolver 3 desafios na primeira tentativa</span>
                <span className="goal-progress">0/3</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="widget logout-widget">
          <div className="widget-header">
            <h3>Encerrar Sessão</h3>
          </div>
          <div className="widget-content">
            <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Logout */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal logout-modal">
            <h2>Deseja realmente sair?</h2>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleLogout}>
                Sim, sair
              </button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
