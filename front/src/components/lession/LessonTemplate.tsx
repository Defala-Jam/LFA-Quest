"use client";

import React, { useState, useEffect, useRef } from "react";
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
  image?: string;
  isAutomaton?: boolean;
  correctAutomaton?: {
    conexoes: Array<{
      de: number;
      para: number;
      caractere: string;
    }>;
  };
  tags?: string[];
}

interface LessonTemplateProps {
  lessonData: LessonData;
  onComplete: () => void;
  onExit: () => void;
  isAutomaton?: boolean;

  // Novas props
  questionIndex: number;
  totalQuestions: number;
}

interface ValidationDetails {
  estadosIniciais: Estado[];
  estadosFinais: Estado[];
  conexoesValidas: Array<{
    de: number;
    para: number;
    caractere: string;
  }>;
  conexoesInvalidas: Array<{
    de: number;
    para: number;
    caractere: string;
  }>;
  mensagens: string[];
}

interface AnsweredQuestion {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer?: number | null;
  correctAnswer?: number;
  tags?: string[];
  timeTaken: number;
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  lessonData,
  onComplete,
  onExit,
  isAutomaton = false,
  questionIndex,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [lessonResult, setLessonResult] = useState<{
    diamonds: number;
    xp: number;
    streak: number;
  } | null>(null);
  const [userAutomaton, setUserAutomaton] = useState<{ estados: Estado[]; conexoes: Conexao[] } | null>(null);
  const automatonLessonRef = useRef<{ handleValidar: () => any }>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);

  useEffect(() => {
    setStartTime(Date.now());
    setShowSummary(false);
    setLessonResult(null);
    setUserAutomaton(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
  }, [lessonData]);

  const isLastQuestion = questionIndex + 1 === totalQuestions;

  const validateAutomaton = (userConexoes: Array<{ de: number; para: number; caractere: string }>) => {
    if (!lessonData.correctAutomaton) return false;

    const correctConexoes = lessonData.correctAutomaton.conexoes;

    const normalize = (arr: any[]) =>
      arr.map(c => ({ ...c, caractere: c.caractere.toLowerCase() })).sort((a, b) => {
        if (a.de !== b.de) return a.de - b.de;
        if (a.para !== b.para) return a.para - b.para;
        return a.caractere.localeCompare(b.caractere);
      });

    return JSON.stringify(normalize(userConexoes)) === JSON.stringify(normalize(correctConexoes));
  };

  const handleAutomatonStateChange = (estados: Estado[], conexoes: Conexao[]) => {
    setUserAutomaton({ estados, conexoes });
  };

  const handleAutomatonValidation = (isValid: boolean, message: string, details: ValidationDetails) => {
    const userConnections: Conexao[] = details.conexoesValidas.map(conn => ({
      id: `conexao-${conn.de}-${conn.para}`,
      de: conn.de,
      para: conn.para,
      ativa: true,
      direcao: `${conn.de}→${conn.para}`,
      tipo: "normal",
      caractere: conn.caractere,
    }));

    setUserAutomaton({
      estados: details.estadosIniciais,
      conexoes: userConnections,
    });

    const correct = validateAutomaton(details.conexoesValidas);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleAutomatonSubmit = () => {
    if (!userAutomaton) return;

    const conexoesSimplificadas = userAutomaton.conexoes.map(conn => ({
      de: conn.de,
      para: conn.para,
      caractere: conn.caractere,
    }));

    const correct = validateAutomaton(conexoesSimplificadas);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleLessonComplete = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      console.log("📤 Requisição: finalização de lição");

      const payload = {
        user_id: user.id,
        correct_answers: answeredQuestions.filter(q => q.isCorrect).length,
        total_questions: answeredQuestions.length,
        questions: answeredQuestions.map(q => ({
          questionId: q.questionId,
          isCorrect: q.isCorrect,
          tags: q.tags || [],
          timeTaken: q.timeTaken,
        })),
      };

      const response = await axios.post("http://localhost:5000/api/lesson/complete", payload);

      const { diamonds_earned, xp_earned, new_xp, new_diamonds, new_streak } = response.data;

      const updatedUser = {
        ...user,
        xp: new_xp,
        diamonds: new_diamonds,
        streak: new_streak,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

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
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const currentQuestion: AnsweredQuestion = {
      questionId: lessonData.title.replace(/\s+/g, "_").toLowerCase(),
      isCorrect: !!isCorrect,
      selectedAnswer,
      correctAnswer: lessonData.correctAnswer,
      tags: lessonData.tags || [],
      timeTaken,
    };

    const updatedAnswers = [...answeredQuestions, currentQuestion];
    setAnsweredQuestions(updatedAnswers);

    if (isLastQuestion) {
      await handleLessonComplete();
      setShowSummary(true);
    } else {
      onComplete();
    }
  };

  if (showSummary) {
    const total = answeredQuestions.length || 1;
    const correct = answeredQuestions.filter(q => q.isCorrect).length;
    const wrong = total - correct;
    const totalTime = answeredQuestions.reduce((acc, q) => acc + q.timeTaken, 0);

    return (
      <div className="summary-container">
        <div className="summary-card">
          <h1>🎉 Lição Concluída!</h1>
          <h2>{lessonData.title}</h2>

          <p>
            Você respondeu <b>{total}</b> pergunta{total > 1 ? "s" : ""} em <b>{totalTime}</b> segundos.
          </p>
          <p>
            ✅ Acertos: <b>{correct}</b> &nbsp;&nbsp; ❌ Erros: <b>{wrong}</b>
          </p>

          {lessonResult && (
            <div className="reward-section">
              <p className="reward-text">💎 +{lessonResult.diamonds} diamantes</p>
              <p className="reward-text">⚡ +{lessonResult.xp} XP</p>
              <p className="reward-text fire-text">
                🔥 Ofensiva atual: <b>{lessonResult.streak}</b> dia{lessonResult.streak > 1 ? "s" : ""} seguidos!
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
            <div>
              <p>{lessonData.explanation}</p>
              {lessonData.image && (
                <div className="lesson-image-container">
                  <img src={lessonData.image} alt="Ilustração da questão" className="lesson-image" />
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>Nenhuma explicação disponível para esta pergunta.</p>
          )}
        </div>
      </div>

      <div className="lesson-right">
        {isAutomaton ? (
          <div className="automaton-container">
            <AutomatonLesson
              ref={automatonLessonRef}
              onStateChange={handleAutomatonStateChange}
              onValidation={handleAutomatonValidation}
            />

            {isSubmitted && (
              <div className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}>
                {isCorrect ? "🎉 Parabéns! Autômato correto!" : "💭 Autômato incorreto! Tente novamente."}
              </div>
            )}

            <div className="action-buttons">
              {!isSubmitted ? (
                <button className="submit-button" onClick={handleAutomatonSubmit} disabled={!userAutomaton}>
                  Validar Autômato
                </button>
              ) : (
                <button className="continue-button" onClick={handleContinue}>
                  Continuar →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="question-container">
            <h2 className="question-title">{lessonData.question}</h2>

            <div className="alternatives-list">
              {lessonData.alternatives.map((alt, i) => (
                <button
                  key={i}
                  className={`alternative-button ${selectedAnswer === i ? "selected" : ""} ${
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
              <div className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}>
                {isCorrect ? "🎉 Parabéns! Resposta correta!" : "💭 Resposta incorreta!"}
              </div>
            )}

            <div className="action-buttons">
              {!isSubmitted ? (
                <button className="submit-button" onClick={handleSubmit} disabled={selectedAnswer === null}>
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
