"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../../components/sidebar/Sidebar.tsx"
import Task from "../../components/Task/Taks.tsx"
import Lesson from "../../components/lession/Lession"
import "./Path_player.css"

const Path_player: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("journey")
  const [isTaskOpen, setIsTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isLessonActive, setIsLessonActive] = useState(false)

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

  const handleExitLesson = () => {
    setIsLessonActive(false)
  }

  const handleLessonComplete = () => {
    setIsLessonActive(false)
    // Add logic to mark node as completed, update progress, etc.
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

  if (isLessonActive) {
    return <Lesson lessonData={lessonData} onComplete={handleLessonComplete} onExit={handleExitLesson} />
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
            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
            </div>

            <div className="path-connector"></div>

            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
            </div>

            <div className="path-connector"></div>

            <div className="path-node completed" onClick={handleNodeClick}>
              <div className="node-circle">
                <span className="checkmark">✓</span>
              </div>
            </div>
          </div>
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
            <button className="action-btn">Praticar Áreas de Autômatos</button>
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
          </div>
        </div>
      </div>

      {selectedTask && (
        <Task isOpen={isTaskOpen} onClose={handleCloseTask} taskData={selectedTask} onStartLesson={handleStartLesson} />
      )}
    </div>
  )
}

export default Path_player
