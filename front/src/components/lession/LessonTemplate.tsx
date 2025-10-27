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
}

interface LessonTemplateProps {
  lessonData: LessonData;
  onComplete: () => void;
  onExit: () => void;
  onIncorrect: () => void;
  isAutomaton?: boolean;
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

const LessonTemplate: React.FC<LessonTemplateProps> = 
({
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
  const [userAutomaton, setUserAutomaton] = useState<{ estados: Estado[]; conexoes: Conexao[] } | null>(null);
  const automatonLessonRef = useRef<{ handleValidar: () => any }>(null);

  useEffect(() => {
    setStartTime(Date.now());
    setShowSummary(false);
    setAnswers([]);
    setLessonResult(null);
    setUserAutomaton(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
  }, [lessonData]);

// ✅ Função para validar o autômato - CORRIGIDA
const validateAutomaton = (userConexoes: Array<{de: number; para: number; caractere: string}>) => {
  if (!lessonData.correctAutomaton) return false;

  const correctConexoes = lessonData.correctAutomaton.conexoes;

  console.log("Conexões do usuário:", userConexoes);
  console.log("Conexões corretas:", correctConexoes);
  
  // ✅ Normalizar os caracteres para minúsculo antes de ordenar
  const normalizedUser = userConexoes.map(conn => ({
    de: conn.de,
    para: conn.para,
    caractere: conn.caractere.toLowerCase()
  }));

  const normalizedCorrect = correctConexoes.map(conn => ({
    de: conn.de,
    para: conn.para,
    caractere: conn.caractere.toLowerCase()
  }));

  // Ordenar ambas as listas para comparação consistente
  const sortedUser = [...normalizedUser].sort((a, b) => {
    if (a.de !== b.de) return a.de - b.de;
    if (a.para !== b.para) return a.para - b.para;
    return a.caractere.localeCompare(b.caractere);
  });

  const sortedCorrect = [...normalizedCorrect].sort((a, b) => {
    if (a.de !== b.de) return a.de - b.de;
    if (a.para !== b.para) return a.para - b.para;
    return a.caractere.localeCompare(b.caractere);
  });

  console.log("Usuário ordenado:", sortedUser);
  console.log("Correto ordenado:", sortedCorrect);
  console.log("Número de conexões - Usuário:", sortedUser.length, "Correto:", sortedCorrect.length);

  // Comparação profunda
  const isEqual = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
  console.log("Resultado da validação:", isEqual);
  
  return isEqual;
};

  const handleAutomatonStateChange = (estados: Estado[], conexoes: Conexao[]) => {
    setUserAutomaton({ estados, conexoes });
  };

  // ✅ Função para receber a validação do AutomatonLesson
  const handleAutomatonValidation = (isValid: boolean, message: string, details: ValidationDetails) => {
    console.log("Validação recebida:", details);

    // ✅ CONVERTE para Conexao[] antes de usar
    const userConnections: Conexao[] = details.conexoesValidas.map(conn => ({
      id: `conexao-${conn.de}-${conn.para}`,
      de: conn.de,
      para: conn.para,
      ativa: true,
      direcao: `${conn.de}→${conn.para}`,
      tipo: 'normal',
      caractere: conn.caractere
    }));

    setUserAutomaton({ 
      estados: details.estadosIniciais,
      conexoes: userConnections 
    });

    // ✅ Valida usando as conexões recebidas
    const correct = validateAutomaton(details.conexoesValidas);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  // ✅ Nova função de submit para autômatos
  const handleAutomatonSubmit = () => {
    if (!userAutomaton) return;
    
    // Converte Conexao[] para o formato simplificado para validação
    const conexoesSimplificadas = userAutomaton.conexoes.map(conn => ({
      de: conn.de,
      para: conn.para,
      caractere: conn.caractere
    }));
    
    const correct = validateAutomaton(conexoesSimplificadas);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleLessonComplete = async (correctAnswers: number, totalQuestions: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      console.log("requisição finalização de lesson")
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
    onComplete()
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
    const correctCount = isCorrect ? 1 : 0;
    const totalCount = 1;

    setAnswers((prev) => [...prev, isCorrect || false]);
    await handleLessonComplete(correctCount, totalCount);
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
            <div>
              <p>{lessonData.explanation}</p>
              {/* ✅ Exibir imagem se existir */}
              {lessonData.image && (
                <div className="lesson-image-container">
                  <img 
                    src={lessonData.image} 
                    alt="Ilustração da questão" 
                    className="lesson-image"
                  />
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>
              Nenhuma explicação disponível para esta pergunta.
            </p>
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
              <div
                className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}
              >
                {isCorrect ? "🎉 Parabéns! Autômato correto!" : "💭 Autômato incorreto! Tente novamente."}
              </div>
            )}

            <div className="action-buttons">
              {!isSubmitted ? (
                <button
                  className="submit-button"
                  onClick={handleAutomatonSubmit}
                  disabled={!userAutomaton}
                >
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