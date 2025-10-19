"use client"

import React, { useState } from "react"
import "./LessonTemplate.css"

interface LessonData {
  title: string
  question: string
  alternatives: string[]
  correctAnswer: number
  explanation?: string
}

interface LessonTemplateProps {
  lessonData: LessonData
  onComplete: () => void
  onExit: () => void
  onIncorrect: () => void
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  lessonData,
  onComplete,
  onExit,
  onIncorrect,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  console.log("lessonData recebido:", lessonData)

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setIsSubmitted(true)
    const correct = selectedAnswer === lessonData.correctAnswer
    setIsCorrect(correct)
  }

  const handleContinue = () => {
    if (isCorrect) onComplete()
    else onIncorrect()

    // resetar estado da próxima questão
    setSelectedAnswer(null)
    setIsCorrect(null)
    setIsSubmitted(false)
  }

  return (
    <div className="lesson-container">
      {/* Lado esquerdo — explicação da pergunta atual */}
      <div className="lesson-left">
        <div className="lesson-header">
          <button className="lesson-exit" onClick={onExit}>
            ✕
          </button>
          <h1 className="lesson-title">{lessonData.title}</h1>
        </div>

        <div className="lesson-content">
          <h2 className="content-heading">📘 Explicação / Teoria</h2>
          {lessonData.explanation ? (
            <p>{lessonData.explanation}</p>
          ) : (
            <p style={{ color: "#64748b" }}>
              Nenhuma explicação disponível para esta pergunta.
            </p>
          )}
        </div>
      </div>

      {/* Lado direito — pergunta e alternativas */}
      <div className="lesson-right">
        <div className="question-container">
          <h2 className="question-title">{lessonData.question}</h2>

          <div className="alternatives-list">
            {lessonData.alternatives.map((alt, i) => (
              <button
                key={i}
                className={`alternative-button ${
                  selectedAnswer === i ? "selected" : ""
                } ${
                  isSubmitted
                    ? i === lessonData.correctAnswer
                      ? "correct"
                      : selectedAnswer === i
                      ? "incorrect"
                      : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(i)}
                disabled={isSubmitted}
              >
                <span className="alternative-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="alternative-text">{alt}</span>
              </button>
            ))}
          </div>

          {isSubmitted && (
            <div
              className={`feedback ${
                isCorrect ? "correct-feedback" : "incorrect-feedback"
              }`}
            >
              {isCorrect
                ? "🎉 Parabéns! Resposta correta!"
                : "💭 Resposta incorreta!"}
            </div>
          )}

          <div className="action-buttons">
            {!isSubmitted ? (
              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button className="continue-button" onClick={handleContinue}>
                Continuar →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonTemplate
