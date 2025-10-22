import React, { useState, useRef, useEffect, useCallback } from 'react';

// Interfaces
interface Position {
  x: number;
  y: number;
}

interface Offset {
  x: number;
  y: number;
}

export interface Ball {
  id: number;
  position: Position;
  targetPosition: Position;
  dragging: boolean;
  offset: Offset;
  connected: boolean;
  selected: boolean;
  character: string;
}

interface BallSystemProps {
  balls: Ball[];
  onBallsChange: (balls: Ball[]) => void;
  connectionMode: boolean;
  onBallClick: (id: number) => void;
  renderConnections: () => React.ReactNode;
  renderControlPanel: () => React.ReactNode;
  renderConnectionList: () => React.ReactNode;
  ballRefs: React.RefObject<{ [key: number]: HTMLDivElement | null }>;
}

export const BallSystem: React.FC<BallSystemProps> = ({
  balls,
  onBallsChange,
  connectionMode,
  onBallClick,
  renderConnections,
  renderControlPanel,
  renderConnectionList,
  ballRefs
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const SMOOTHNESS = 0.3;

  // Referência das bolas
  const assignRef = useCallback((id: number) => (el: HTMLDivElement | null) => {
    if (ballRefs.current) {
      ballRefs.current[id] = el;
    }
  }, [ballRefs]);

  // Sistema de animação
  const updateSmoothMovement = useCallback(() => {
    onBallsChange(balls.map(ball => {
      if (!ball.dragging) {
        const dx = ball.targetPosition.x - ball.position.x;
        const dy = ball.targetPosition.y - ball.position.y;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return { ...ball, position: { ...ball.targetPosition } };
        }

        const newX = ball.position.x + dx * SMOOTHNESS;
        const newY = ball.position.y + dy * SMOOTHNESS;

        return { ...ball, position: { x: newX, y: newY } };
      }
      return ball;
    }));
  }, [balls, onBallsChange]);

  const startAnimation = useCallback(() => {
    const animate = () => {
      updateSmoothMovement();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateSmoothMovement]);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Sistema de posicionamento
  const positionBalls = useCallback(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const ballWidth = 85;
      const ballHeight = 85;

      const columns = 2;
      const rows = Math.ceil(balls.length / columns);
      const spacingX = containerRect.width / (columns + 1);
      const spacingY = containerRect.height / (rows + 1);

      const positionedBalls = balls.map((ball, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);

        const x = spacingX * (column + 1) - ballWidth / 2;
        const y = spacingY * (row + 1) - ballHeight / 2;

        return {
          ...ball,
          position: { x, y },
          targetPosition: { x, y }
        };
      });

      onBallsChange(positionedBalls);
    }
  }, [balls, onBallsChange]);

  // Sistema de arraste
  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent, id: number) => {
    if (connectionMode) {
      e.preventDefault();
      return;
    }

    const updatedBalls = balls.map(ball =>
      ball.id === id ? { ...ball, dragging: true } : ball
    );
    onBallsChange(updatedBalls);

    const eventType = e.type.includes('touch') ? 'touch' : 'mouse';
    const clientX = eventType === 'touch'
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
    
    const clientY = eventType === 'touch'
      ? (e as React.TouchEvent).touches[0].clientY
      : (e as React.MouseEvent).clientY;

    const ballRef = ballRefs.current?.[id];
    if (ballRef) {
      const ballRect = ballRef.getBoundingClientRect();
      const offsetX = clientX - ballRect.left;
      const offsetY = clientY - ballRect.top;

      const updatedBallsWithOffset = balls.map(ball =>
        ball.id === id ? { ...ball, offset: { x: offsetX, y: offsetY } } : ball
      );
      onBallsChange(updatedBallsWithOffset);
    }

    e.preventDefault();
  }, [balls, connectionMode, onBallsChange, ballRefs]);

  const drag = useCallback((e: MouseEvent | TouchEvent) => {
    const ballDragging = balls.find(ball => ball.dragging);
    if (!ballDragging) return;

    const eventType = e.type.includes('touch') ? 'touch' : 'mouse';
    const clientX = eventType === 'touch'
      ? (e as TouchEvent).touches[0].clientX
      : (e as MouseEvent).clientX;
    
    const clientY = eventType === 'touch'
      ? (e as TouchEvent).touches[0].clientY
      : (e as MouseEvent).clientY;

    if (containerRef.current && ballRefs.current?.[ballDragging.id]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const ballRect = ballRefs.current[ballDragging.id]!.getBoundingClientRect();

      let newX = clientX - ballDragging.offset.x - containerRect.left;
      let newY = clientY - ballDragging.offset.y - containerRect.top;

      const maxX = containerRect.width - ballRect.width;
      const maxY = containerRect.height - ballRect.height;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      onBallsChange(balls.map(ball =>
        ball.id === ballDragging.id
          ? {
              ...ball,
              position: { x: newX, y: newY },
              targetPosition: { x: newX, y: newY }
            }
          : ball
      ));
    }
  }, [balls, onBallsChange, ballRefs]);

  const stopDrag = useCallback(() => {
    onBallsChange(balls.map(ball => ({ ...ball, dragging: false })));
  }, [balls, onBallsChange]);

  // Event listeners para arraste
  useEffect(() => {
    const anyBallDragging = balls.some(ball => ball.dragging);
    
    if (anyBallDragging) {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('touchend', stopDrag);
    } else {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', stopDrag);
    }

    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', stopDrag);
    };
  }, [balls, drag, stopDrag]);

  // Iniciar animação
  useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [startAnimation, stopAnimation]);

  // Componente individual da bola
  const BallComponent: React.FC<{ ball: Ball }> = ({ ball }) => {
    const getBallColor = (id: number) => {
      switch (id) {
        case 2: return 'radial-gradient(circle at 30% 30%, #ff6b6b, #c0392b)';
        case 3: return 'radial-gradient(circle at 30% 30%, #6bffb8, #2bc06a)';
        case 4: return 'radial-gradient(circle at 30% 30%, #ffeb3b, #ff9800)';
        default: return 'radial-gradient(circle at 30% 30%, #6e8efb, #a777e3)';
      }
    };

    return (
      <div
        ref={assignRef(ball.id)}
        className={`
          ball 
          ball-${ball.id} 
          ${ball.dragging ? 'dragging' : ''}
          ${ball.connected ? 'connected' : ''}
          ${ball.selected ? 'selected' : ''}
        `}
        style={{
          transform: `translate(${ball.position.x}px, ${ball.position.y}px)`,
          background: getBallColor(ball.id)
        }}
        onMouseDown={(e) => startDrag(e, ball.id)}
        onTouchStart={(e) => startDrag(e, ball.id)}
        onClick={() => onBallClick(ball.id)}
      >
        <span className="ball-character">{ball.character}</span>
      </div>
    );
  };

  return (
    <div className="container" ref={containerRef}>
      {/* Renderizar conexões */}
      {renderConnections()}

      {/* Renderizar bolas */}
      {balls.map(ball => (
        <BallComponent key={ball.id} ball={ball} />
      ))}
      
      {/* Renderizar painel de controle */}
      {renderControlPanel()}

      {/* Renderizar lista de conexões */}
      {renderConnectionList()}

      {/* Botão para centralizar bolas */}
      <div className="center-button-container">
        <button onClick={positionBalls} className="btn-center-balls">
          Centralizar Bolas
        </button>
      </div>
    </div>
  );
};

// Hook para criar estado inicial das bolas
export const useBallSystem = () => {
  const [balls, setBalls] = useState<Ball[]>([
    {
      id: 2,
      position: { x: 0, y: 0 },
      targetPosition: { x: 0, y: 0 },
      dragging: false,
      offset: { x: 0, y: 0 },
      connected: false,
      selected: false,
      character: 'B'
    },
    {
      id: 3,
      position: { x: 0, y: 0 },
      targetPosition: { x: 0, y: 0 },
      dragging: false,
      offset: { x: 0, y: 0 },
      connected: false,
      selected: false,
      character: 'C'
    },
    {
      id: 4,
      position: { x: 0, y: 0 },
      targetPosition: { x: 0, y: 0 },
      dragging: false,
      offset: { x: 0, y: 0 },
      connected: false,
      selected: false,
      character: 'D'
    }
  ]);

  return {
    balls,
    setBalls
  };
};