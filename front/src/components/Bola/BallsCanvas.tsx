import React, { useRef, useState } from 'react'
import { BallSystem, useBallSystem } from './BallSystem'

interface AutomatonQuestionProps {
  onCorrect: () => void
  onIncorrect: () => void
}

const AutomatonQuestion: React.FC<AutomatonQuestionProps> = ({ onCorrect, onIncorrect }) => {
  const { balls, setBalls } = useBallSystem()
  const ballRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [connectionMode, setConnectionMode] = useState(false)

  const handleBallClick = (id: number) => {
    // lógica de clique, seleção e verificação de acerto aqui
  }

  const renderConnections = () => <></> // Ex: linhas SVG entre bolas
  const renderControlPanel = () => <></> // Painel de UI extra, se necessário
  const renderConnectionList = () => <></>

  const handleSubmitAutomaton = () => {
    const correct = true // ou false, baseado nas conexões feitas
    if (correct) onCorrect()
    else onIncorrect()
  }

  return (
    <div className="automaton-wrapper">
      <BallSystem
        balls={balls}
        onBallsChange={setBalls}
        connectionMode={connectionMode}
        onBallClick={handleBallClick}
        renderConnections={renderConnections}
        renderControlPanel={renderControlPanel}
        renderConnectionList={renderConnectionList}
        ballRefs={ballRefs}
      />

      <button onClick={handleSubmitAutomaton} className="submit-automaton-btn">
        Confirmar Resposta
      </button>
    </div>
  )
}
