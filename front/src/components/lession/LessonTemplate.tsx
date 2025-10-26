"use client";

import React, { useState, useEffect } from "react";
import "./LessonTemplate.css";
import AutomatonLesson from "./AutomatonLession";
import type { Estado, Conexao } from "./AutomatonLession";
import axios from "axios";

interface LessonData {
  title: string;
  question?: string;
  alternatives: string[];
  correctAnswer: number;
  explanation?: string;
}

interface LessonTemplateProps {
  lessonData: LessonData;
  onComplete: () => void;
  onExit: () => void;
  onIncorrect: () => void;
  isAutomaton?: boolean;
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  lessonData,
  onComplete,
  onExit,
  onIncorrect,
  isAutomaton = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [lessonResult, setLessonResult] = useState<{
    diamonds: number;
    xp: number;
    streak: number;
  } | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
    setShowSummary(false);
    setAnswers([]);
    setLessonResult(null);
  }, [lessonData]);

  const handleAutomatonStateChange = (estados: Estado[], conexoes: Conexao[]) => {};

  // 📤 Envia o resultado da lição ao backend e atualiza user localStorage
  const handleLessonComplete = async (correctAnswers: number, totalQuestions: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await axios.post("http://localhost:5000/api/lesson/complete", {
        user_id: user.id,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
      });

      const {
        diamonds_earned,
        xp_earned,
        new_xp,
        new_diamonds,
        new_streak,
      } = response.data;

      // Atualiza localStorage com os novos totais
      const updatedUser = {
        ...user,
        xp: new_xp,
        diamonds: new_diamonds,
        streak: new_streak,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Guarda o resultado da lição para exibir no resumo
      setLessonResult({
        diamonds: diamonds_earned,
        xp: xp_earned,
        streak: new_streak,
      });
    } catch (err) {
      console.error("❌ Erro ao registrar lição:", err);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    const correct = selectedAnswer === lessonData.correctAnswer;
    setIsCorrect(correct);
  };

  const handleContinue = async () => {
    if (isCorrect) {
      setAnswers((prev) => [...prev, true]);
      await handleLessonComplete(1, 1);
    } else {
      setAnswers((prev) => [...prev, false]);
      await handleLessonComplete(0, 1);
    }
    setShowSummary(true);
  };

  // 🏁 Tela de resumo da lição
  if (showSummary) {
    const total = answers.length || 1;
    const correct = answers.filter((a) => a).length;
    const wrong = total - correct;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    return (
      <div className="summary-container">
        <div className="summary-card">
          <h1>🎉 Lição Concluída!</h1>
          <h2>{lessonData.title}</h2>

          <p>
            Você respondeu <b>{total}</b> pergunta{total > 1 ? "s" : ""} em{" "}
            <b>{timeTaken}</b> segundos.
          </p>
          <p>
            ✅ Acertos: <b>{correct}</b> &nbsp;&nbsp; ❌ Erros: <b>{wrong}</b>
          </p>

          {/* 🎁 Exibe recompensas da lição */}
          {lessonResult && (
            <div className="reward-section">
              <p className="reward-text">💎 +{lessonResult.diamonds} diamantes</p>
              <p className="reward-text">⚡ +{lessonResult.xp} XP</p>
              <p className="reward-text fire-text">
                🔥 Ofensiva atual: <b>{lessonResult.streak}</b> dia
                {lessonResult.streak > 1 ? "s" : ""} seguidos!
              </p>
            </div>
          )}

          <button
            className="continue-button"
            onClick={() => {
              setShowSummary(false);
              onComplete();
            }}
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  // 🧠 Tela principal da lição
  return (
    <div className="lesson-container">
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

      <div className="lesson-right">
        {isAutomaton ? (
          <AutomatonLesson onStateChange={handleAutomatonStateChange} />
        ) : (
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
                  <span className="alternative-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="alternative-text">{alt}</span>
                </button>
              ))}
            </div>

            {isSubmitted && (
              <div
                className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}
              >
                {isCorrect ? "🎉 Parabéns! Resposta correta!" : "💭 Resposta incorreta!"}
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
        )}
      </div>
    </div>
  );
};

export default LessonTemplate;
