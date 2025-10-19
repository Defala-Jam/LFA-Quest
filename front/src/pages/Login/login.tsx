"use client"

import type React from "react"
import { useState } from "react"
import "./Login.css"

interface LoginProps {
  onNavigate?: (page: string) => void
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Digite um e-mail válido"
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simular chamada de API
    setTimeout(() => {
      setIsLoading(false)
      if (onNavigate) {
        onNavigate("path")
      }
    }, 1500)
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">LFA Quest</span>
          </div>
          <h1 className="login-title">Bem-vindo de volta</h1>
          <p className="login-subtitle">Continue sua jornada de aprendizado</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: undefined })
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span>Lembrar de mim</span>
            </label>
            <button type="button" className="link-button">
              Esqueceu a senha?
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Não tem uma conta?{" "}
            <button type="button" className="link-button-primary" onClick={() => onNavigate && onNavigate("signup")}>
              Criar conta
            </button>
          </p>
        </div>
      </div>

      <div className="login-visual">
  <div className="visual-content">
    <h2 className="visual-title">Aprenda os Fundamentos da Computação</h2>
    <div className="features-list">
      <div className="feature-item">
        <span className="feature-icon">🔁</span>
        <div className="feature-text">
          <h3>Autômatos Finitos & Infinitos</h3>
          <p>Explore as máquinas abstratas que definem linguagens formais.</p>
        </div>
      </div>
      <div className="feature-item">
        <span className="feature-icon">📚</span>
        <div className="feature-text">
          <h3>Teoria do Bombeamento</h3>
          <p>Entenda como provar que certas linguagens não são regulares ou livres de contexto.</p>
        </div>
      </div>
      <div className="feature-item">
        <span className="feature-icon">⚙️</span>
        <div className="feature-text">
          <h3>Linguagens & Gramáticas</h3>
          <p>Aprenda como linguagens formais são geradas e reconhecidas.</p>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}
