"use client"

import type React from "react"
import { useState } from "react"
import "./Signup.css"

interface SignupProps {
  onNavigate?: (page: string) => void
}

export default function Signup({ onNavigate }: SignupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!formData.name) {
      newErrors.name = "Nome é obrigatório"
    } else if (formData.name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Digite um e-mail válido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "A senha deve conter letras maiúsculas, minúsculas e números"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulação de chamada de API
    setTimeout(() => {
      setIsLoading(false)
      if (onNavigate) {
        onNavigate("path")
      }
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <div className="signup-logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">LFA Quest</span>
          </div>
          <h1 className="signup-title">Comece sua jornada</h1>
          <p className="signup-subtitle">Domine conteúdos desde automatos até teorema do bombeamento</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? "input-error" : ""}`}
              placeholder="João da Silva"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
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
                placeholder="Crie uma senha forte"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar senha
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="terms-group">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" required />
              <span>
                Eu concordo com os{" "}
                <button type="button" className="link-button">
                  Termos de Serviço
                </button>{" "}
                e com a{" "}
                <button type="button" className="link-button">
                  Política de Privacidade
                </button>
              </span>
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p className="footer-text">
            Já tem uma conta?{" "}
            <button type="button" className="link-button-primary" onClick={() => onNavigate && onNavigate("login")}>
              Entrar
            </button>
          </p>
        </div>
      </div>

      <div className="signup-visual">
        <div className="visual-content">
          <h2 className="visual-title">Junte-se a milhares de estudantes</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div className="feature-text">
                <h3>Lições interativas</h3>
                <p>Aprenda na prática com desafios de código</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <div className="feature-text">
                <h3>Acompanhe seu progresso</h3>
                <p>Monitore seu desempenho com análises detalhadas</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <div className="feature-text">
                <h3>Ganhe conquistas</h3>
                <p>Desbloqueie medalhas e suba no ranking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
