"use client"

import type React from "react"
import { useState } from "react"
import "./Lession.css"

interface LessonProps {
  lessonData: {
    title: string
    content: string
    explanation: string
    question: string
    alternatives: string[]
    correctAnswer: number
  }
  onComplete: () => void
  onExit: () => void
}

const Lesson: React.FC<LessonProps> = ({ lessonData, onComplete, onExit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true)
    }
  }

  const handleContinue = () => {
    if (selectedAnswer === lessonData.correctAnswer) {
      onComplete()
    }
  }

  const isCorrect = selectedAnswer === lessonData.correctAnswer

  return (
    <div className="lesson-container">
      {/* Left Half - Educational Content */}
      <div className="lesson-left">
        <div className="lesson-header">
          <button className="lesson-exit" onClick={onExit}>
            ✕
          </button>
          <h1 className="lesson-title">{lessonData.title}</h1>
        </div>

        <div className="lesson-content">
          <div className="content-section">
            <h2 className="content-heading">📚 Conteúdo</h2>
            <p className="content-text">{lessonData.content}</p>
          </div>

          <div className="content-section">
            <h2 className="content-heading">💡 Explicação</h2>
            <p className="content-text">{lessonData.explanation}</p>
          </div>

          <div className="content-visual">
            {/* Este é apenas um exemplo de código que pode ser removido ou alterado conforme necessário */}
            <div className="code-example">
              <pre>
                <code>{`// Exemplo simples de um autômato finito determinístico (DFA)
const dfa = {
  states: ['q0', 'q1'],
  alphabet: ['0', '1'],
  transition: {
    q0: { '0': 'q0', '1': 'q1' },
    q1: { '0': 'q1', '1': 'q0' }
  },
  startState: 'q0',
  acceptStates: ['q0']
}

// Função para verificar se uma string é aceita pelo DFA
function isAccepted(input) {
  let state = dfa.startState;
  for (let symbol of input) {
    state = dfa.transition[state][symbol];
  }
  return dfa.acceptStates.includes(state);
}
`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Question and Alternatives */}
      <div className="lesson-right">
        <div className="question-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "33%" }}></div>
          </div>

          <h2 className="question-title">{lessonData.question}</h2>

          <div className="alternatives-list">
            {lessonData.alternatives.map((alternative, index) => (
              <button
                key={index}
                className={`alternative-button ${selectedAnswer === index ? "selected" : ""} ${
                  isSubmitted
                    ? index === lessonData.correctAnswer
                      ? "correct"
                      : selectedAnswer === index
                        ? "incorrect"
                        : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={isSubmitted}
              >
                <span className="alternative-letter">{String.fromCharCode(65 + index)}</span>
                <span className="alternative-text">{alternative}</span>
                {isSubmitted && index === lessonData.correctAnswer && <span className="check-icon">✓</span>}
                {isSubmitted && selectedAnswer === index && index !== lessonData.correctAnswer && (
                  <span className="cross-icon">✕</span>
                )}
              </button>
            ))}
          </div>

          {isSubmitted && (
            <div className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}>
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎉</span>
                  <p className="feedback-text">Excelente! Você acertou!</p>
                </>
              ) : (
                <>
                  <span className="feedback-icon">💭</span>
                  <p className="feedback-text">Quase lá. Revise a explicação e tente novamente!</p>
                </>
              )}
            </div>
          )}

          <div className="action-buttons">
            {!isSubmitted ? (
              <button className="submit-button" onClick={handleSubmit} disabled={selectedAnswer === null}>
                Verificar Resposta
              </button>
            ) : (
              <button className="continue-button" onClick={handleContinue} disabled={!isCorrect}>
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lesson
