"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar.tsx";
import Task from "../../components/Task/Taks.tsx";
import Lesson from "../../components/lession/LessonTemplate.tsx";
import "./Path_player.css";

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

const Path_player: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("journey");
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [currentLessonType, setCurrentLessonType] = useState<"normal" | "automaton">("normal");
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showAchievementsPopup, setShowAchievementsPopup] = useState(false);


  // 🔹 Dados do usuário vindos do backend
  const [userData, setUserData] = useState<any>(null);

  // -------------------------
  // 🔐 LOGIN E REGISTRO
  // -------------------------
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  // ================================
  // 🧠 Buscar dados do backend
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

  // Função de Login
  const handleLogin = async () => {
    setLoginError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro no login");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("✅ Login realizado com sucesso!");
      setShowLogin(false);
      window.location.reload();
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  // Função de Registro
  const handleRegister = async () => {
    setRegisterError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro no cadastro");
      alert("✅ Cadastro realizado com sucesso!");
      setShowRegister(false);
      setShowLogin(true);
    } catch (err: any) {
      setRegisterError(err.message);
    }
  };

  // -------------------------
  // 🔹 FUNÇÕES PRINCIPAIS
  // -------------------------
  const navigator = (item: string) => {
    setActiveNavItem(item);
    console.log(`[v0] Navigating to: ${item}`);
  };

  const taskData = {
    icon: "🧠",
    title: "Introdução aos Autômatos Finitos Determinísticos",
    description: "Entenda o que são autômatos finitos determinísticos (DFA) e como eles funcionam.",
    difficulty: "Intermediário",
    xp: 15,
    progress: 60,
    learningPoints: [
      "Estrutura e funcionamento de autômatos finitos determinísticos",
      "Transições e estados em autômatos",
      "Reconhecimento de padrões com DFA",
      "Exemplo de implementação de DFA em JavaScript",
    ],
  };

  const handleNodeClick = () => {
    setSelectedTask(taskData);
    setIsTaskOpen(true);
  };

  const handleCloseTask = () => {
    setIsTaskOpen(false);
    setSelectedTask(null);
  };

  const handleStartLesson = () => {
    console.log("[v0] Starting lesson...");
    setIsLessonActive(true);
    handleCloseTask();
  };

  const handleStartAutomatonLesson = () => {
    console.log("[v0] Starting automaton lesson...");
    setCurrentLessonType("automaton");
    setIsLessonActive(true);
    handleCloseTask();
  };

  const handleExitLesson = () => {
    setIsLessonActive(false);
    setCurrentLessonType("normal");
  };

  const handleLessonComplete = async () => {
    setIsLessonActive(false);
    setCurrentLessonType("normal");

    if (!userData) return; // só faz sentido se o usuário estiver logado

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userData.id}/checkAchievements`);
      const data = await res.json();

      if (data.newAchievements && data.newAchievements.length > 0) {
        setNewAchievements(data.newAchievements);
        setShowAchievementsPopup(true);
        console.log("🏅 Novas conquistas desbloqueadas:", data.newAchievements);
      } else {
        console.log("Nenhuma nova conquista.");
      }
    } catch (err) {
      console.error("Erro ao verificar conquistas:", err);
    }
  };


  const handleIncorrectAnswer = () => {
    console.log("Resposta incorreta - fornecer feedback adicional");
  };

  // Dados das lições
  const lessonData = {
    title: "Introdução aos Autômatos Finitos Determinísticos",
    content:
      "Autômatos finitos determinísticos (DFA) são máquinas teóricas que reconhecem padrões em uma sequência de símbolos.",
    explanation:
      "Um DFA possui estados, alfabeto de entrada e transições determinísticas. Ele aceita ou rejeita a entrada com base no estado final.",
    question: "Qual das alternativas é verdadeira sobre um autômato finito determinístico?",
    alternatives: [
      "Um DFA pode ter transições não determinísticas.",
      "Um DFA tem um número infinito de estados.",
      "Um DFA pode ser usado para reconhecer apenas linguagens regulares.",
      "Um DFA não pode ter um estado inicial.",
    ],
    correctAnswer: 2,
  };

  const automatonLessonData = {
    isAutomaton: true,
    title: "Construção de Autômato Finito Determinístico",
    explanation: "Marque o estado inicial com → e estados finais com ⦻.",
    alternatives: [],
    correctAnswer: 0,
    correctAutomaton: {
      conexoes: [
        { de: 2, para: 3, caractere: "a" },
        { de: 2, para: 6, caractere: "b" },
        { de: 3, para: 5, caractere: "a" },
        { de: 5, para: 2, caractere: "b" },
        { de: 5, para: 5, caractere: "a" },
        { de: 6, para: 7, caractere: "a" },
        { de: 7, para: 6, caractere: "b" },
        { de: 7, para: 7, caractere: "a" },
      ],
    },
  };

  // -------------------------
  // 🔹 LIÇÃO ATIVA
  // -------------------------
  if (isLessonActive) {
    return (
      <Lesson
        lessonData={currentLessonType === "automaton" ? automatonLessonData : lessonData}
        onComplete={handleLessonComplete}
        onExit={handleExitLesson}
        onIncorrect={handleIncorrectAnswer}
        isAutomaton={currentLessonType === "automaton"}
      />
    );
  }

  // -------------------------
  // 🔹 INTERFACE PRINCIPAL
  // -------------------------
  return (
    <div className="app-container">
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="main-content">
        <div className="learning-path">
          <div className="path-title">Autômatos Finitos Determinísticos</div>

          <div className="path-nodes">
            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
              <div className="node-label">Teoria Básica</div>
            </div>

            <div className="path-connector"></div>

            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
              <div className="node-label">Exemplos</div>
            </div>

            <div className="path-connector"></div>

            <div
              className="path-node active"
              onClick={() => {
                setSelectedTask({
                  ...taskData,
                  title: "Prática: Construção de Autômato",
                  description:
                    "Construa seu próprio autômato finito determinístico arrastando estados e criando transições.",
                });
                setIsTaskOpen(true);
              }}
            >
              <div className="node-circle">
                <span className="node-icon">⚡</span>
              </div>
              <div className="node-label">Prática Interativa</div>
            </div>

            <div className="path-connector"></div>

            <div className="path-node upcoming" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="node-icon">?</span>
              </div>
              <div className="node-label">Quiz Final</div>
            </div>
          </div>
        </div>

        {/* Ação rápida */}
        <div className="quick-actions">
          <button className="automaton-quick-btn" onClick={handleStartAutomatonLesson}>
            🎮 Iniciar Prática de Autômato
          </button>
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">{userData ? userData.streak_count ?? 0 : 0}</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">{userData ? userData.diamonds ?? 0 : 0}</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">{userData ? userData.xp ?? 0 : 0}</span>
          </div>
        </div>

        {/* Widgets e login */}
        <div className="widget">
          <div className="widget-header">
            <h3>Ações Rápidas</h3>
          </div>
          <div className="widget-content">
            <button className="action-btn" onClick={handleStartAutomatonLesson}>
              Praticar Construção de Autômatos
            </button>
            <button className="action-btn">Rever Erros</button>
            <button className="action-btn">Quiz de DFA</button>
          </div>
        </div>

        {/* Widget de login se não estiver logado */}
        {!userData && (
          <div className="widget login-widget">
            <div className="widget-header">
              <h3>Crie seu perfil e salve seu progresso!</h3>
            </div>
            <div className="widget-content">
              <button className="login-btn create-btn" onClick={() => setShowRegister(true)}>
                Criar Conta
              </button>
              <button className="login-btn login-btn-alt" onClick={() => setShowLogin(true)}>
                Entrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POP-UP LOGIN */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <h2>Entrar</h2>
            <input
              type="email"
              placeholder="E-mail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button className="confirm-btn-jorney" onClick={handleLogin}>
              Entrar
            </button>
          </div>
        </div>
      )}

      {/* POP-UP CADASTRO */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowRegister(false)}>
              ✕
            </button>
            <h2>Criar Conta</h2>
            <input
              type="text"
              placeholder="Nome"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <input
              type="email"
              placeholder="E-mail"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            {registerError && <p style={{ color: "red" }}>{registerError}</p>}
            <button className="confirm-btn-jorney" onClick={handleRegister}>
              Cadastrar
            </button>
          </div>
        </div>
      )}

      {/* Modal da Tarefa */}
      {selectedTask && (
        <Task
          isOpen={isTaskOpen}
          onClose={handleCloseTask}
          taskData={selectedTask}
          onStartLesson={
            selectedTask.title.includes("Construção de Autômato")
              ? handleStartAutomatonLesson
              : handleStartLesson
          }
        />
      )}
      {showAchievementsPopup && (
        <div className="modal-overlay">
          <div className="modal achievements-modal">
            <h2>🏆 Novas Conquistas!</h2>
            <div className="achievement-list">
              {newAchievements.map((ach) => (
                <div key={ach.id} className="achievement-item">
                  <span className="achievement-icon">{ach.icon || "✨"}</span>
                  <div className="achievement-info">
                    <strong>{ach.name}</strong>
                    <p>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="confirm-btn-jorney"
              onClick={() => setShowAchievementsPopup(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Path_player;
