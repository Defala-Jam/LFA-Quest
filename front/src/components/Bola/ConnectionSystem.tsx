import React, { useState, useCallback } from 'react';
import type { Ball } from './BallSystem';

// Interfaces para conexões
export interface Connection {
  id: string;
  from: number;
  to: number;
  active: boolean;
  direction: string;
  type: 'normal' | 'selfReflexive';
  character: string;
}

interface ConnectionPoints {
  start: { x: number; y: number };
  end: { x: number; y: number };
  point1: { x: number; y: number };
  point2: { x: number; y: number };
  directionX: number;
  directionY: number;
  middle?: { x: number; y: number };
}

interface SelfReflexivePoints {
  center: { x: number; y: number };
  controlPoint1: { x: number; y: number };
  controlPoint2: { x: number; y: number };
  endPoint: { x: number; y: number };
  point1: { x: number; y: number };
  point2: { x: number; y: number };
  characterPoint: { x: number; y: number };
  loopRadius: number;
}

interface ConnectionSystemProps {
  balls: Ball[];
  ballRefs: React.RefObject<{ [key: number]: HTMLDivElement | null }>;
  connections: Connection[];
  connectionMode: boolean;
  selectedBall: number | null;
  editingConnection: string | null;
  newCharacter: string;
  onConnectionsChange: (connections: Connection[]) => void;
  onConnectionModeChange: (mode: boolean) => void;
  onSelectedBallChange: (ballId: number | null) => void;
  onEditingConnectionChange: (connectionId: string | null) => void;
  onNewCharacterChange: (character: string) => void;
  onBallsChange: (balls: Ball[]) => void;
}

export const useConnectionSystem = ({
  balls,
  ballRefs,
  connections,
  connectionMode,
  selectedBall,
  editingConnection,
  newCharacter,
  onConnectionsChange,
  onConnectionModeChange,
  onSelectedBallChange,
  onEditingConnectionChange,
  onNewCharacterChange,
  onBallsChange
}: ConnectionSystemProps) => {
  // Gerenciamento de modo de conexão
  const activateConnectionMode = useCallback(() => {
    onConnectionModeChange(true);
    onSelectedBallChange(null);
    onBallsChange(balls.map(ball => ({ ...ball, selected: false })));
  }, [balls, onBallsChange, onConnectionModeChange, onSelectedBallChange]);

  const deactivateConnectionMode = useCallback(() => {
    onConnectionModeChange(false);
    onSelectedBallChange(null);
    onBallsChange(balls.map(ball => ({ ...ball, selected: false, connected: false })));
  }, [balls, onBallsChange, onConnectionModeChange, onSelectedBallChange]);

  // Manipulação de cliques nas bolas
  const handleBallClick = useCallback((id: number) => {
    if (!connectionMode) return;

    if (selectedBall === null) {
      onSelectedBallChange(id);
      onBallsChange(balls.map(ball =>
        ball.id === id ? { ...ball, selected: true } : { ...ball, selected: false }
      ));
    } else if (selectedBall === id) {
      // Criar autorreflexão
      const connectionId = `selfReflexive-${id}`;
      const existingConnection = connections.find(conn => conn.id === connectionId);

      if (!existingConnection) {
        const newConnection: Connection = {
          id: connectionId,
          from: id,
          to: id,
          active: true,
          direction: `${id}→${id}`,
          type: 'selfReflexive',
          character: 'ε'
        };

        onConnectionsChange([...connections, newConnection]);
        onBallsChange(balls.map(ball =>
          ball.id === id ? { ...ball, connected: true, selected: false } : ball
        ));
      }

      onSelectedBallChange(null);
      onConnectionModeChange(false);
    } else {
      // Criar conexão normal
      const connectionId = `connection-${selectedBall}-${id}`;
      const existingConnection = connections.find(conn => conn.id === connectionId);

      if (!existingConnection) {
        const newConnection: Connection = {
          id: connectionId,
          from: selectedBall,
          to: id,
          active: true,
          direction: `${selectedBall}→${id}`,
          type: 'normal',
          character: 'a'
        };

        onConnectionsChange([...connections, newConnection]);
        onBallsChange(balls.map(ball =>
          (ball.id === selectedBall || ball.id === id)
            ? { ...ball, connected: true, selected: false }
            : ball
        ));
      }

      onSelectedBallChange(null);
      onConnectionModeChange(false);
    }
  }, [
    connectionMode,
    selectedBall,
    connections,
    balls,
    onBallsChange,
    onConnectionsChange,
    onConnectionModeChange,
    onSelectedBallChange
  ]);

  // Edição de caracteres das conexões
  const startEditingConnection = useCallback((connectionId: string, currentCharacter: string) => {
    onEditingConnectionChange(connectionId);
    onNewCharacterChange(currentCharacter);
  }, [onEditingConnectionChange, onNewCharacterChange]);

  const confirmEditConnection = useCallback(() => {
    if (editingConnection && newCharacter.trim() !== '') {
      onConnectionsChange(connections.map(conn =>
        conn.id === editingConnection
          ? { ...conn, character: newCharacter.trim() }
          : conn
      ));
      onEditingConnectionChange(null);
      onNewCharacterChange('');
    }
  }, [editingConnection, newCharacter, connections, onConnectionsChange, onEditingConnectionChange, onNewCharacterChange]);

  const cancelEditConnection = useCallback(() => {
    onEditingConnectionChange(null);
    onNewCharacterChange('');
  }, [onEditingConnectionChange, onNewCharacterChange]);

  // Remoção de conexões
  const removeConnection = useCallback((connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (connection) {
      const newConnections = connections.filter(conn => conn.id !== connectionId);
      onConnectionsChange(newConnections);

      const remainingFromConnections = connections.filter(conn =>
        conn.id !== connectionId && (conn.from === connection.from || conn.to === connection.from)
      );

      const remainingToConnections = connection.type === 'normal'
        ? connections.filter(conn =>
            conn.id !== connectionId && (conn.from === connection.to || conn.to === connection.to)
          )
        : [];

      onBallsChange(balls.map(ball => {
        if (ball.id === connection.from) {
          return { ...ball, connected: remainingFromConnections.length > 0 };
        } else if (connection.type === 'normal' && ball.id === connection.to) {
          return { ...ball, connected: remainingToConnections.length > 0 };
        }
        return ball;
      }));
    }
  }, [connections, balls, onBallsChange, onConnectionsChange]);

  const removeAllConnections = useCallback(() => {
    onConnectionsChange([]);
    onBallsChange(balls.map(ball => ({ ...ball, connected: false })));
  }, [balls, onBallsChange, onConnectionsChange]);

  // Verificações
  const getBallCharacter = useCallback((id: number): string => {
    const ball = balls.find(b => b.id === id);
    return ball?.character || id.toString();
  }, [balls]);

  // Cálculos para renderização de setas
  const calculateNormalArrowPoints = useCallback((
    fromId: number,
    toId: number,
    offset: number = 0
  ): ConnectionPoints | null => {
    const fromBall = balls.find(ball => ball.id === fromId);
    const toBall = balls.find(ball => ball.id === toId);
    
    if (!fromBall || !toBall || !ballRefs.current?.[fromId] || !ballRefs.current?.[toId]) {
      return null;
    }

    const fromBallRect = ballRefs.current[fromId]!.getBoundingClientRect();
    const toBallRect = ballRefs.current[toId]!.getBoundingClientRect();

    const fromCenter = {
      x: fromBall.position.x + fromBallRect.width / 2,
      y: fromBall.position.y + fromBallRect.height / 2
    };

    const toCenter = {
      x: toBall.position.x + toBallRect.width / 2,
      y: toBall.position.y + toBallRect.height / 2
    };

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return null;

    const directionX = dx / distance;
    const directionY = dy / distance;

    const perpendicularX = -directionY;
    const perpendicularY = directionX;

    const ballRadius = fromBallRect.width / 2;
    const spacing = Math.abs(offset) > 0 ? 15 : 0;

    const start = {
      x: fromCenter.x + directionX * ballRadius + perpendicularX * spacing * Math.sign(offset),
      y: fromCenter.y + directionY * ballRadius + perpendicularY * spacing * Math.sign(offset)
    };

    const end = {
      x: toCenter.x - directionX * ballRadius + perpendicularX * spacing * Math.sign(offset),
      y: toCenter.y - directionY * ballRadius + perpendicularY * spacing * Math.sign(offset)
    };

    const middle = {
      x: (start.x + end.x) / 2 + perpendicularY * 10,
      y: (start.y + end.y) / 2 - perpendicularX * 10
    };

    const arrowSize = 12;
    const arrowAngle = Math.PI / 6;

    const point1 = {
      x: end.x - directionX * arrowSize + directionY * arrowSize * Math.tan(arrowAngle),
      y: end.y - directionY * arrowSize - directionX * arrowSize * Math.tan(arrowAngle)
    };

    const point2 = {
      x: end.x - directionX * arrowSize - directionY * arrowSize * Math.tan(arrowAngle),
      y: end.y - directionY * arrowSize + directionX * arrowSize * Math.tan(arrowAngle)
    };

    return { start, end, point1, point2, directionX, directionY, middle };
  }, [balls, ballRefs]);

  const calculateSelfReflexivePoints = useCallback((ballId: number): SelfReflexivePoints | null => {
    const ball = balls.find(b => b.id === ballId);
    if (!ball || !ballRefs.current?.[ballId]) return null;

    const ballRect = ballRefs.current[ballId]!.getBoundingClientRect();
    const center = {
      x: ball.position.x + ballRect.width / 2,
      y: ball.position.y + ballRect.height / 2
    };

    const radius = ballRect.width / 2;
    const loopRadius = radius * 2.2;

    const startAngle = Math.PI / 4;
    const endAngle = 2 * Math.PI - Math.PI / 4;

    const controlPoint1 = {
      x: center.x + loopRadius * Math.cos(startAngle) + 20,
      y: center.y - loopRadius * Math.sin(startAngle) + 25
    };

    const controlPoint2 = {
      x: center.x + loopRadius * Math.cos(endAngle) + 15,
      y: center.y - loopRadius * Math.sin(endAngle) + 10
    };

    const endPoint = {
      x: center.x + radius * Math.cos(endAngle),
      y: center.y - radius * Math.sin(endAngle)
    };

    const characterPoint = {
      x: center.x + loopRadius * 0.7,
      y: center.y - loopRadius * 0.7
    };

    const arrowSize = 10;
    const point1 = {
      x: endPoint.x - Math.cos(endAngle) * arrowSize + Math.sin(endAngle) * arrowSize,
      y: endPoint.y - Math.sin(endAngle) * arrowSize - Math.cos(endAngle) * arrowSize
    };

    const point2 = {
      x: endPoint.x - Math.cos(endAngle) * arrowSize - Math.sin(endAngle) * arrowSize,
      y: endPoint.y - Math.sin(endAngle) * arrowSize + Math.cos(endAngle) * arrowSize
    };

    return { 
      center, 
      controlPoint1, 
      controlPoint2, 
      endPoint, 
      point1, 
      point2,
      characterPoint,
      loopRadius 
    };
  }, [balls, ballRefs]);

  const calculateDoubleConnectionOffset = useCallback((fromId: number, toId: number): number => {
    const hash = fromId * 31 + toId;
    return hash % 2 === 0 ? 1 : -1;
  }, []);

  const hasDoubleConnection = useCallback((ball1: number, ball2: number): boolean => {
    return connections.some(conn => conn.from === ball1 && conn.to === ball2) &&
           connections.some(conn => conn.from === ball2 && conn.to === ball1);
  }, [connections]);

  // Componente para renderizar conexões
  const renderConnections = useCallback((): React.ReactNode => {
    return (
      <svg
        className="arrow-connection"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4CAF50" />
          </marker>
          <marker
            id="arrowhead-selfReflexive"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#9C27B0" />
          </marker>
        </defs>

        {connections.map(connection => {
          if (connection.type === 'selfReflexive') {
            const points = calculateSelfReflexivePoints(connection.from);
            if (!points) return null;

            return (
              <g key={connection.id} className="arrow-selfReflexive">
                <path
                  d={`
                    M ${points.center.x + points.loopRadius * 0.3}, ${points.center.y}
                    C ${points.controlPoint1.x}, ${points.controlPoint1.y}
                      ${points.controlPoint2.x}, ${points.controlPoint2.y}
                      ${points.endPoint.x}, ${points.endPoint.y}
                  `}
                  stroke="#9C27B0"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead-selfReflexive)"
                />
                <text
                  x={points.characterPoint.x}
                  y={points.characterPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="connection-character"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#9C27B0"
                >
                  {connection.character}
                </text>
              </g>
            );
          } else {
            const isDouble = hasDoubleConnection(connection.from, connection.to);
            const offset = isDouble ? calculateDoubleConnectionOffset(connection.from, connection.to) : 0;

            const points = calculateNormalArrowPoints(connection.from, connection.to, offset);
            if (!points) return null;

            return (
              <g key={connection.id} className={`arrow-connectable ${isDouble ? (offset > 0 ? 'double-upper' : 'double-lower') : ''}`}>
                <line
                  x1={points.start.x}
                  y1={points.start.y}
                  x2={points.end.x}
                  y2={points.end.y}
                  stroke={connection.active ? "#4CAF50" : "#FF5722"}
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                <polygon
                  points={`
                    ${points.end.x},${points.end.y}
                    ${points.point1.x},${points.point1.y}
                    ${points.point2.x},${points.point2.y}
                  `}
                  fill={connection.active ? "#4CAF50" : "#FF5722"}
                />
                <text
                  x={points.middle!.x}
                  y={points.middle!.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="connection-character"
                  fontSize="14"
                  fontWeight="bold"
                  fill={connection.active ? "#4CAF50" : "#FF5722"}
                >
                  {connection.character}
                </text>
              </g>
            );
          }
        })}
      </svg>
    );
  }, [connections, calculateSelfReflexivePoints, calculateNormalArrowPoints, hasDoubleConnection, calculateDoubleConnectionOffset]);

  // Componente para lista de conexões
  const renderConnectionList = useCallback((): React.ReactNode => {
    const calculateDistance = (fromId: number, toId: number): number => {
      if (fromId === toId) return 0;
      
      const fromBall = balls.find(ball => ball.id === fromId);
      const toBall = balls.find(ball => ball.id === toId);
      
      if (!fromBall || !toBall) return 0;
      
      const dx = toBall.position.x - fromBall.position.x;
      const dy = toBall.position.y - fromBall.position.y;
      
      return Math.sqrt(dx * dx + dy * dy);
    };

    return (
      <div className="connections-info">
        <h3>Conexões ({connections.length})</h3>
        {connections.map(connection => (
          <div key={connection.id} className={`connection-item ${connection.type}`}>
            <div className="connection-details">
              <span className="direction">
                {connection.type === 'selfReflexive' ? '🔄' : '→'} 
                {getBallCharacter(connection.from)} {connection.type === 'selfReflexive' ? '→ Si mesma' : `→ ${getBallCharacter(connection.to)}`}
              </span>
              <span className="distance">
                ({connection.type === 'selfReflexive' ? 'loop' : Math.round(calculateDistance(connection.from, connection.to)) + 'px'})
              </span>
            </div>
            
            <div className="connection-controls">
              {editingConnection === connection.id ? (
                <div className="character-editing">
                  <input
                    type="text"
                    value={newCharacter}
                    onChange={(e) => onNewCharacterChange(e.target.value)}
                    maxLength={1}
                    className="character-input"
                    autoFocus
                  />
                  <button onClick={confirmEditConnection} className="btn-confirm">
                    ✓
                  </button>
                  <button onClick={cancelEditConnection} className="btn-cancel-edit">
                    ✗
                  </button>
                </div>
              ) : (
                <>
                  <span 
                    className="connection-character-text" 
                    onClick={() => startEditingConnection(connection.id, connection.character)}
                  >
                    [{connection.character}]
                  </span>
                  <button 
                    onClick={() => removeConnection(connection.id)} 
                    className="btn-remove"
                  >
                    Remover
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [
    connections,
    balls,
    editingConnection,
    newCharacter,
    getBallCharacter,
    startEditingConnection,
    confirmEditConnection,
    cancelEditConnection,
    removeConnection,
    onNewCharacterChange
  ]);

  // Componente para painel de controle
  const renderControlPanel = useCallback((): React.ReactNode => {
    const connectionExists = (fromId: number, toId: number): boolean => {
      return connections.some(conn => conn.from === fromId && conn.to === toId);
    };

    const generateConnectionsSummary = () => {
      const summary = [];
      for (let i = 0; i < balls.length; i++) {
        for (let j = 0; j < balls.length; j++) {
          if (i !== j) {
            const from = balls[i].id;
            const to = balls[j].id;
            const connection = connections.find(conn => conn.from === from && conn.to === to);
            summary.push(
              <p key={`${from}-${to}`}>
                {getBallCharacter(from)} → {getBallCharacter(to)}: 
                {connection ? ` ${connection.character}` : ' ❌'}
              </p>
            );
          }
        }
        const ballId = balls[i].id;
        const selfReflexive = connections.find(conn => conn.from === ballId && conn.to === ballId);
        summary.push(
          <p key={`${ballId}-self`}>
            {getBallCharacter(ballId)} → Si: 
            {selfReflexive ? ` ${selfReflexive.character}` : ' ❌'}
          </p>
        );
      }
      return summary;
    };

    return (
      <div className="info">
        <h1>Sistema de Autômatos</h1>
        
        <div className="controls">
          {!connectionMode ? (
            <button className="btn-connect" onClick={activateConnectionMode}>
              🔗 Modo Conectar
            </button>
          ) : (
            <button className="btn-cancel" onClick={deactivateConnectionMode}>
              ❌ Cancelar
            </button>
          )}
          
          {connections.length > 0 && (
            <button className="btn-remove-all" onClick={removeAllConnections}>
              🗑️ Remover Todas
            </button>
          )}
        </div>

        <div className="status">
          <p>Modo: <strong>{connectionMode ? 'CONECTAR' : 'ARRASTAR'}</strong></p>
          {connectionMode && selectedBall && (
            <p>Selecionada: {getBallCharacter(selectedBall)} - Clique em outra bola ou na mesma para autorreflexão</p>
          )}
          {connectionMode && !selectedBall && (
            <p>Clique em uma bola para começar a conectar</p>
          )}
          <p className="tip">
            💡 Dica: Clique na mesma bola duas vezes para criar autorreflexão
          </p>
        </div>

        <div className="connections-summary">
          <h4>Resumo de Conexões:</h4>
          {generateConnectionsSummary()}
        </div>
      </div>
    );
  }, [
    balls,
    connections,
    connectionMode,
    selectedBall,
    getBallCharacter,
    activateConnectionMode,
    deactivateConnectionMode,
    removeAllConnections
  ]);

  return {
    handleBallClick,
    renderConnections,
    renderConnectionList,
    renderControlPanel,
    activateConnectionMode,
    deactivateConnectionMode,
    removeAllConnections
  };
};

export const useConnectionSystemState = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionMode, setConnectionMode] = useState(false);
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [editingConnection, setEditingConnection] = useState<string | null>(null);
  const [newCharacter, setNewCharacter] = useState('');

  return {
    connections,
    connectionMode,
    selectedBall,
    editingConnection,
    newCharacter,
    setConnections,
    setConnectionMode,
    setSelectedBall,
    setEditingConnection,
    setNewCharacter
  };
};
