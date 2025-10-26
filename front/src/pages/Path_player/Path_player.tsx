"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar.tsx";
import Task from "../../components/Task/Taks.tsx";
import Lesson from "../../components/lession/LessonTemplate.tsx";
import {
  lessonsFase1,
  lessonsFase2,
} from "../../components/lession/LessonData.ts";

import "./path_player.css"  

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
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(1); // 1 ou 2
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0-4 para as 5 questões
  const [showPhaseSummary, setShowPhaseSummary] = useState(false); // Nova state para controlar o resumo da fase
  const [phaseAnswers, setPhaseAnswers] = useState<boolean[]>([]); // Armazenar respostas da fase

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

  // Dados das fases (nós principais)
  const phaseData = [
    {
      phase: 1,
      title: "Fase 1: Fundamentos dos Autômatos",
      description: "Aprenda os conceitos básicos de autômatos finitos e gramáticas regulares.",
      icon: "🧠",
      difficulty: "Iniciante",
      xp: 75,
      progress: 60,
      questionsCount: 5,
      learningPoints: [
        "Autômatos Finitos Não Determinísticos (AFND)",
        "Gramáticas Regulares e Derivações",
        "Conversão de AFN para AFD",
        "Propriedades dos Autômatos",
        "Expressões Aritméticas e Gramáticas"
      ]
    },
    {
      phase: 2,
      title: "Fase 2: Aplicações Avançadas",
      description: "Aprofunde seus conhecimentos com questões mais complexas sobre autômatos.",
      icon: "⚡",
      difficulty: "Intermediário",
      xp: 75,
      progress: 30,
      questionsCount: 5,
      learningPoints: [
        "Análise de Autômatos e Cadeias",
        "Autômatos JFLAP e Transições",
        "Autômatos Determinísticos vs Não Determinísticos",
        "Linguagens Aceitas por AFD",
        "Tipos de Gramática e Hierarquia de Chomsky"
      ]
    }
  ];

  const handleNodeClick = (phase: number) => {
    const phaseInfo = phaseData.find(p => p.phase === phase);
    setSelectedTask(phaseInfo);
    setCurrentPhase(phase);
    setCurrentQuestionIndex(0); // Começar na primeira questão
    setPhaseAnswers([]); // Resetar respostas
    setShowPhaseSummary(false); // Resetar resumo
    setIsTaskOpen(true);
  };

  const handleCloseTask = () => {
    setIsTaskOpen(false);
    setSelectedTask(null);
  };

  const handleStartLesson = () => {
    console.log(`[v0] Starting lesson - Phase ${currentPhase}, Question ${currentQuestionIndex}`);
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

  const handleLessonComplete = async (isCorrect: boolean) => {
    // Salvar a resposta atual
    const updatedAnswers = [...phaseAnswers, isCorrect];
    setPhaseAnswers(updatedAnswers);

    const currentPhaseQuestions = currentPhase === 1 ? lessonsFase1 : lessonsFase2;
    const isLastQuestion = currentQuestionIndex >= currentPhaseQuestions.length - 1;

    if (isLastQuestion) {
      // Última questão - mostrar resumo da fase
      console.log(`🎉 Fase ${currentPhase} concluída!`);
      setShowPhaseSummary(true);
      setIsLessonActive(false);

      // Verificar conquistas apenas quando a fase for completada
      if (!userData) return;

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
    } else {
      // Próxima questão - continuar sem mostrar resumo
      setCurrentQuestionIndex(prev => prev + 1);
      // A lição continua ativa para a próxima questão
    }
  };

  const handlePhaseSummaryContinue = () => {
    setShowPhaseSummary(false);
    setCurrentQuestionIndex(0);
    setPhaseAnswers([]);
  };

  const handleIncorrectAnswer = () => {
    console.log("Resposta incorreta - fornecer feedback adicional");
  };

  // Obter lição atual baseada na fase e índice da questão
  const getCurrentLesson = () => {
    if (currentLessonType === "automaton") {
      return {
        isAutomaton: true,
        title: "Construção de Autômato Finito Determinístico",
        explanation: "Marque o estado inicial com → e estados finais com ⦻.",
        alternatives: [],
        correctAnswer: 0,
        correctAutomaton: {
          conexoes: [
            { de: 2, para: 3, caractere: "b" },
            { de: 2, para: 6, caractere: "a" },
            { de: 3, para: 5, caractere: "a" },
            { de: 5, para: 2, caractere: "b" },
            { de: 5, para: 5, caractere: "a" },
            { de: 6, para: 7, caractere: "a" },
            { de: 7, para: 6, caractere: "b" },
            { de: 7, para: 7, caractere: "a" }
          ],
        },
      };
    }

    // Lições normais baseadas na fase e questão atual
    const lessons = currentPhase === 1 ? lessonsFase1 : lessonsFase2;
    const currentLesson = lessons[currentQuestionIndex];
    
    // Adicionar indicador de progresso no título
    if (currentLesson) {
      return {
        ...currentLesson,
        title: `${currentLesson.title} (Questão ${currentQuestionIndex + 1} de ${lessons.length})`
      };
    }
    
    return lessonsFase1[0]; // Fallback
  };

  // -------------------------
  // 🔹 TELA DE RESUMO DA FASE
  // -------------------------
  if (showPhaseSummary) {
    const totalQuestions = currentPhase === 1 ? lessonsFase1.length : lessonsFase2.length;
    const correctAnswers = phaseAnswers.filter(answer => answer).length;
    const phaseTitle = currentPhase === 1 ? "Fundamentos dos Autômatos" : "Aplicações Avançadas";

    return (
      <div className="summary-container">
        <div className="summary-card">
          <h1>🎉 Fase Concluída!</h1>
          <h2>Fase {currentPhase}: {phaseTitle}</h2>

          <p>
            Você respondeu <b>{totalQuestions}</b> pergunta{totalQuestions > 1 ? "s" : ""} nesta fase.
          </p>
          <p>
            ✅ Acertos: <b>{correctAnswers}</b> &nbsp;&nbsp; ❌ Erros: <b>{totalQuestions - correctAnswers}</b>
          </p>

          <p className="performance-text">
            {correctAnswers === totalQuestions ? "🎯 Performance Perfeita!" :
             correctAnswers >= totalQuestions * 0.7 ? "🌟 Excelente desempenho!" :
             correctAnswers >= totalQuestions * 0.5 ? "👍 Bom trabalho!" :
             "💪 Continue praticando!"}
          </p>

          <button
            className="continue-button"
            onClick={handlePhaseSummaryContinue}
          >
            Continuar Jornada →
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // 🔹 LIÇÃO ATIVA
  // -------------------------
  if (isLessonActive) {
    return (
      <Lesson
        lessonData={getCurrentLesson()}
        onComplete={() => handleLessonComplete(true)}
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
          <div className="path-title">Jornada de Autômatos Finitos</div>

          <div className="path-nodes">
            {/* Nó da Fase 1 */}
            <div className="path-node completed" onClick={() => handleNodeClick(1)}>
              <div className="node-circle">
                <span className="node-icon">🧠</span>
              </div>
              <div className="node-label">Fase 1: Fundamentos</div>
              <div className="node-subtitle">5 questões</div>
            </div>

            <div className="path-connector"></div>

            {/* Nó da Fase 2 */}
            <div className="path-node active" onClick={() => handleNodeClick(2)}>
              <div className="node-circle">
                <span className="node-icon">⚡</span>
              </div>
              <div className="node-label">Fase 2: Aplicações</div>
              <div className="node-subtitle">5 questões</div>
            </div>

            <div className="path-connector"></div>

            {/* Prática Interativa (separada) */}
            <div
              className="path-node upcoming"
              onClick={() => {
                setSelectedTask({
                  title: "Prática: Construção de Autômato",
                  description: "Construa seu próprio autômato finito determinístico arrastando estados e criando transições.",
                  icon: "🎮",
                  difficulty: "Prática",
                  xp: 25,
                  progress: 0,
                  learningPoints: [
                    "Construção de autômatos do zero",
                    "Definição de estados iniciais e finais",
                    "Criação de transições com caracteres",
                    "Validação de autômatos construídos"
                  ]
                });
                setIsTaskOpen(true);
              }}
            >
              <div className="node-circle">
                <span className="node-icon">🎮</span>
              </div>
              <div className="node-label">Prática Interativa</div>
              <div className="node-subtitle">Autômatos</div>
            </div>
          </div>
        </div>

        {/* Ação rápida */}
        <div className="quick-actions">
          <button className="automaton-quick-btn" onClick={handleStartAutomatonLesson}>
            🎮 Iniciar Prática de Autômato
          </button>
        </div>

        {/* Progresso das Fases */}
        <div className="phases-progress">
          <div className="phase-card">
            <h3>🧠 Fase 1: Fundamentos</h3>
            <p>Conceitos básicos de autômatos e gramáticas</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
            <button className="phase-btn" onClick={() => handleNodeClick(1)}>
              Continuar Fase 1
            </button>
          </div>

          <div className="phase-card">
            <h3>⚡ Fase 2: Aplicações</h3>
            <p>Questões avançadas e análise de autômatos</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '30%' }}></div>
            </div>
            <button className="phase-btn" onClick={() => handleNodeClick(2)}>
              Iniciar Fase 2
            </button>
          </div>
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
            <button className="action-btn" onClick={() => handleNodeClick(1)}>
              Continuar Fase 1
            </button>
            <button className="action-btn" onClick={() => handleNodeClick(2)}>
              Iniciar Fase 2
            </button>
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
            selectedTask.title.includes("Prática") 
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