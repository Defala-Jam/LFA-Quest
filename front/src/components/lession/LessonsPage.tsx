"use client"

import React, { useState, useEffect } from "react"
import LessonTemplate from "./LessonTemplate"
import { lessonsData } from "./lessionsData"
import "./LessonsPage.css"

console.log("%c🚀 lessonsData.ts carregado com sucesso!", "color: #38bdf8; font-weight: bold;")

const LessonsPage: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [showSummary, setShowSummary] = useState(false)

  // --- LOG DE INICIALIZAÇÃO ---
  console.log("%c✅ lessonsData carregado:", "color: #10b981;", lessonsData)

  const currentPhase = lessonsData[currentLesson]
  const totalQuestions = currentPhase.questions.length
  const currentQuestionData = currentPhase.questions[currentQuestion]

  useEffect(() => {
    console.log("%c🔄 Resetando lição para nova fase...", "color: #facc15;")
    setCurrentQuestion(0)
    setAnswers([])
    setStartTime(Date.now())
    setShowSummary(false)
  }, [currentLesson])

  // ==============================
  // Lógica de respostas
  // ==============================
  const handleAnswerComplete = (isCorrect: boolean) => {
    console.log("%c🧩 Resposta registrada:", "color: #60a5fa;", isCorrect ? "✅ Correta" : "❌ Errada")

    setAnswers((prev) => [...prev, isCorrect])

    // Verifica se é a última pergunta
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        console.log(`➡️ Indo para a próxima pergunta (${currentQuestion + 2}/${totalQuestions})`)
        setCurrentQuestion((prev) => prev + 1)
      } else {
        console.log("%c🏁 Fim da fase atingido → Exibindo resumo!", "color: #f472b6; font-weight: bold;")
        setShowSummary(true)
      }
    }, 500)
  }

  // ==============================
  // Avançar para próxima fase
  // ==============================
  const handlePhaseComplete = () => {
    console.log("%c⏭️ Avançando para próxima fase...", "color: #38bdf8;")
    if (currentLesson < lessonsData.length - 1) {
      setCurrentLesson((prev) => prev + 1)
    } else {
      alert("🎉 Você concluiu todas as fases do curso!")
    }
  }

  // ==============================
  // Repetir a lição
  // ==============================
  const handleRepeatLesson = () => {
    console.log("%c🔁 Repetindo a lição atual...", "color: #10b981; font-weight: bold;")
    setCurrentQuestion(0)
    setAnswers([])
    setStartTime(Date.now())
    setShowSummary(false)
  }

  // ==============================
  // Sair da lição
  // ==============================
  const handleExit = () => {
    alert("Saindo da fase atual...")
  }

  // ==============================
  // Tela de resumo
  // ==============================
  if (showSummary) {
    console.log("%c🟩 Entrou no modo RESUMO!", "color: #4ade80; font-weight: bold;")

    const total = answers.length
    const correct = answers.filter((a) => a).length
    const wrong = total - correct
    const timeTaken = Math.round((Date.now() - startTime) / 1000)

    return (
      <div className="summary-container">
        <div className="summary-card">
          <h1> Fase Concluída!</h1>
          <h2>{currentPhase.title}</h2>

          <p>
            Você respondeu <b>{total}</b> perguntas em <b>{timeTaken}</b> segundos.
          </p>
          <p>
            ✅ Acertos: <b>{correct}</b> &nbsp;&nbsp; ❌ Erros: <b>{wrong}</b>
          </p>

          <div className="summary-buttons">
            <button className="continue-button" onClick={handlePhaseComplete}>
              {currentLesson < lessonsData.length - 1
                ? "Avançar para a próxima fase →"
                : "Finalizar Jornada 🎯"}
            </button>

            <button className="repeat-button" onClick={handleRepeatLesson}>
              🔁 Repetir Lição
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==============================
  // Tela principal (lições)
  // ==============================
  console.log("%c📘 currentQuestionData recebido:", "color: #facc15;", currentQuestionData)

  return (
    <LessonTemplate
      key={`${currentLesson}-${currentQuestion}-${currentQuestionData.question}`}
      lessonData={{
        title: `${currentPhase.title} — Pergunta ${currentQuestion + 1}/${totalQuestions}`,
        question: currentQuestionData.question,
        alternatives: [...currentQuestionData.alternatives],
        correctAnswer: currentQuestionData.correctAnswer,
        explanation: currentQuestionData.explanation ?? "",
      }}
      onComplete={() => handleAnswerComplete(true)}
      onIncorrect={() => handleAnswerComplete(false)}
      onExit={handleExit}
    />
  )
}

export default LessonsPage
