"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../../components/sidebar/Sidebar.tsx"
import Task from "../../components/Task/Taks.tsx"
import Lesson from "../../components/lession/LessonTemplate.tsx"
import "./Path_player.css"

const Path_player: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("journey")
  const [isTaskOpen, setIsTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isLessonActive, setIsLessonActive] = useState(false)
  const [currentLessonType, setCurrentLessonType] = useState<"normal" | "automaton">("normal") // Novo estado

  const navigator = (item: string) => {
    setActiveNavItem(item)
    console.log(`[v0] Navigating to: ${item}`)
  }

  // Alterando as informações da tarefa para o tema de autômatos
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
      "Exemplo de implementação de DFA em JavaScript"
    ],
  }

  const handleNodeClick = () => {
    setSelectedTask(taskData)
    setIsTaskOpen(true)
  }

  const handleCloseTask = () => {
    setIsTaskOpen(false)
    setSelectedTask(null)
  }

  const handleStartLesson = () => {
    console.log("[v0] Starting lesson...")
    setIsLessonActive(true)
    handleCloseTask()
  }

  // NOVA FUNÇÃO: Iniciar lição de autômato
  const handleStartAutomatonLesson = () => {
    console.log("[v0] Starting automaton lesson...")
    setCurrentLessonType("automaton")
    setIsLessonActive(true)
    handleCloseTask()
  }

  const handleExitLesson = () => {
    setIsLessonActive(false)
    setCurrentLessonType("normal") // Resetar para o tipo normal ao sair
  }

  const handleLessonComplete = () => {
    setIsLessonActive(false)
    setCurrentLessonType("normal") // Resetar para o tipo normal ao completar
    // Add logic to mark node as completed, update progress, etc.
  }

  const handleIncorrectAnswer = () => {
    // Lógica para quando a resposta estiver incorreta
    console.log("Resposta incorreta - fornecer feedback adicional")
  }

  // Alterando as informações da lição para o tema de autômatos
  const lessonData = {
    title: "Introdução aos Autômatos Finitos Determinísticos",
    content:
      "Autômatos finitos determinísticos (DFA) são máquinas teóricas que podem ser usadas para reconhecer padrões em uma sequência de símbolos. Eles possuem um número finito de estados e transições determinísticas baseadas em um alfabeto.",
    explanation:
      "Um DFA possui um conjunto de estados, um alfabeto de entrada, uma função de transição determinística e um estado inicial. A cada símbolo lido da entrada, o DFA transita entre seus estados, eventualmente aceitando ou rejeitando a entrada dependendo do estado final.",
    question: "Qual das alternativas é verdadeira sobre um autômato finito determinístico?",
    alternatives: [
      "Um DFA pode ter transições não determinísticas.",
      "Um DFA tem um número infinito de estados.",
      "Um DFA pode ser usado para reconhecer apenas linguagens regulares.",
      "Um DFA não pode ter um estado inicial."
    ],
    correctAnswer: 2,
  }

  // Dados específicos para a lição de autômato
  const automatonLessonData = {
    title: "Construção de Autômato Finito Determinístico",
    content:
      "Nesta lição prática, você irá construir um autômato finito determinístico arrastando estados e criando transições.",
    explanation:
      "Use os 8 estados disponíveis (1, 2, 3, 1,2, 1,3, 2,3, 1,2,3) para construir seu autômato. Marque o estado inicial com a seta (→) e os estados finais com o círculo duplo (⦻). Crie transições entre os estados e defina os caracteres de transição.",
    question: "Construa o autômato finito determinístico conforme as instruções:",
    alternatives: [
      "Estado 1 como inicial",
      "Estado 1,2,3 como final", 
      "Transições com caracteres 'a' e 'b'",
      "Todos os estados conectados adequadamente"
    ],
    correctAnswer: 0,
  }

  if (isLessonActive) {
    return (
      <Lesson 
        lessonData={currentLessonType === "automaton" ? automatonLessonData : lessonData} 
        onComplete={handleLessonComplete} 
        onExit={handleExitLesson}
        onIncorrect={handleIncorrectAnswer}
        isAutomaton={currentLessonType === "automaton"} // Passando o parâmetro isAutomaton
      />
    )
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
            <h2>Sessão 1, Capítulo 1 </h2>
            <p>Fundamentos dos Autômatos Finitos Determinísticos</p>
          </div>
        </div>

        {/* Learning Path */}
        <div className="learning-path">
          <div className="path-title">Autômatos Finitos Determinísticos</div>

          <div className="path-nodes">
            {/* Nó 1 - Lição Normal */}
            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
              <div className="node-label">Teoria Básica</div>
            </div>

            <div className="path-connector"></div>

            {/* Nó 2 - Lição Normal */}
            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
              <div className="node-label">Exemplos</div>
            </div>

            <div className="path-connector"></div>

            {/* Nó 3 - Lição de Autômato (Prática) */}
            <div className="path-node active" onClick={() => {
              setSelectedTask({
                ...taskData,
                title: "Prática: Construção de Autômato",
                description: "Construa seu próprio autômato finito determinístico arrastando estados e criando transições.",
                learningPoints: [
                  "Arraste e posicione os 8 estados disponíveis",
                  "Defina estado inicial e estados finais",
                  "Crie transições entre estados",
                  "Configure caracteres de transição"
                ]
              })
              setIsTaskOpen(true)
            }}>
              <div className="node-circle">
                <span className="node-icon">⚡</span>
              </div>
              <div className="node-label">Prática Interativa</div>
            </div>

            <div className="path-connector"></div>

            {/* Nó 4 - Quiz */}
            <div className="path-node upcoming" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="node-icon">?</span>
              </div>
              <div className="node-label">Quiz Final</div>
            </div>
          </div>
        </div>

        {/* Botão de Ação Rápida para Autômato */}
        <div className="quick-actions">
          <button 
            className="automaton-quick-btn"
            onClick={handleStartAutomatonLesson}
          >
            🎮 Iniciar Prática de Autômato
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        {/* Stats */}
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">0</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">9</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">5</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="widget">
          <div className="widget-header">
            <h3>Ações Rápidas</h3>
          </div>
          <div className="widget-content">
            <button 
              className="action-btn"
              onClick={handleStartAutomatonLesson}
            >
              Praticar Construção de Autômatos
            </button>
            <button className="action-btn">Rever Erros</button>
            <button className="action-btn">Quizz de DFA</button>
          </div>
        </div>

        {/* Daily Goals */}
        <div className="widget">
          <div className="widget-header">
            <h3>Atividades Recentes</h3>
          </div>
          <div className="widget-content">
            <div className="goal-item">
              <div className="goal-text">
                <span>Complete 5 lições</span>
                <span className="goal-progress">0/5</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Complete 3 lições na primeira tentativa</span>
                <span className="goal-progress">0/3</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Construa um autômato completo</span>
                <span className="goal-progress">0/1</span>
              </div>
              <span className="trophy-icon">🎮</span>
            </div>
          </div>
        </div>
      </div>

      {selectedTask && (
        <Task 
          isOpen={isTaskOpen} 
          onClose={handleCloseTask} 
          taskData={selectedTask} 
          onStartLesson={
            // Verifica se é a tarefa de autômato para chamar a função correta
            selectedTask.title.includes("Construção de Autômato") 
              ? handleStartAutomatonLesson 
              : handleStartLesson
          } 
        />
      )}
    </div>
  )
}

export default Path_player