import { useState, useRef, useEffect } from 'react';
import './AutomatonLesson.css';

interface Posicao {
  x: number;
  y: number;
}

interface Offset {
  x: number;
  y: number;
}

interface Bola {
  id: number;
  posicao: Posicao;
  posicaoAlvo: Posicao;
  arrastando: boolean;
  offset: Offset;
  conectada: boolean;
  selecionada: boolean;
  caractere: string;
}

interface Conexao {
  id: string;
  de: number;
  para: number;
  ativa: boolean;
  direcao: string;
  tipo: 'normal' | 'autorreflexao';
  caractere: string;
}

const BolaArrastavel = () => {
  const VELOCIDADE_SUAVIZACAO = 0.3;

  const [bolas, setBolas] = useState<Bola[]>([
    {
      id: 2,
      posicao: { x: 0, y: 0 },
      posicaoAlvo: { x: 0, y: 0 },
      arrastando: false,
      offset: { x: 0, y: 0 },
      conectada: false,
      selecionada: false,
      caractere: 'B'
    },
    {
      id: 3,
      posicao: { x: 0, y: 0 },
      posicaoAlvo: { x: 0, y: 0 },
      arrastando: false,
      offset: { x: 0, y: 0 },
      conectada: false,
      selecionada: false,
      caractere: 'C' 
    },
    {
      id: 4,
      posicao: { x: 0, y: 0 },
      posicaoAlvo: { x: 0, y: 0 },
      arrastando: false,
      offset: { x: 0, y: 0 },
      conectada: false,
      selecionada: false,
      caractere: 'D' 
    }
  ]);

  const [conexoes, setConexoes] = useState<Conexao[]>([]);
  const [modoConectar, setModoConectar] = useState<boolean>(false);
  const [bolaSelecionada, setBolaSelecionada] = useState<number | null>(null);
  const [editandoConexao, setEditandoConexao] = useState<string | null>(null);
  const [novoCaractere, setNovoCaractere] = useState<string>('');
  
  const bolaRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number>(0);

  const atribuirRef = (id: number) => (el: HTMLDivElement | null) => {
    bolaRefs.current[id] = el;
  };

  useEffect(() => {
    posicionarBolas();
    
    const animar = () => {
      atualizarSuavizacao();
      animationFrameRef.current = requestAnimationFrame(animar);
    };
    
    animationFrameRef.current = requestAnimationFrame(animar);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const atualizarSuavizacao = () => {
    setBolas(prev => prev.map(bola => {
      if (!bola.arrastando) {
        const dx = bola.posicaoAlvo.x - bola.posicao.x;
        const dy = bola.posicaoAlvo.y - bola.posicao.y;
        
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return { ...bola, posicao: { ...bola.posicaoAlvo } };
        }
        
        const novaX = bola.posicao.x + dx * VELOCIDADE_SUAVIZACAO;
        const novaY = bola.posicao.y + dy * VELOCIDADE_SUAVIZACAO;
        
        return { ...bola, posicao: { x: novaX, y: novaY } };
      }
      return bola;
    }));
  };

  const posicionarBolas = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const bolaWidth = 85;
      const bolaHeight = 85;
      
      const colunas = 2;
      const linhas = Math.ceil(bolas.length / colunas);
      const espacamentoX = containerRect.width / (colunas + 1);
      const espacamentoY = containerRect.height / (linhas + 1);
      
      setBolas(prev => prev.map((bola, index) => {
        const coluna = index % colunas;
        const linha = Math.floor(index / colunas);
        
        const x = espacamentoX * (coluna + 1) - bolaWidth / 2;
        const y = espacamentoY * (linha + 1) - bolaHeight / 2;
        
        return {
          ...bola,
          posicao: { x, y },
          posicaoAlvo: { x, y }
        };
      }));
    }
  };

  const iniciarArraste = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    if (modoConectar) {
      e.preventDefault();
      return;
    }

    setBolas(prev => prev.map(bola => 
      bola.id === id ? { ...bola, arrastando: true } : bola
    ));
    
    const tipoEvento = e.type.includes('touch') ? 'touch' : 'mouse';
    const clientX = tipoEvento === 'touch' 
      ? (e as React.TouchEvent).touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    
    const clientY = tipoEvento === 'touch' 
      ? (e as React.TouchEvent).touches[0].clientY 
      : (e as React.MouseEvent).clientY;
    
    const bolaRef = bolaRefs.current[id];
    if (bolaRef) {
      const bolaRect = bolaRef.getBoundingClientRect();
      const offsetX = clientX - bolaRect.left;
      const offsetY = clientY - bolaRect.top;
      
      setBolas(prev => prev.map(bola => 
        bola.id === id ? { ...bola, offset: { x: offsetX, y: offsetY } } : bola
      ));
    }

    e.preventDefault();
  };

  const arrastar = (e: MouseEvent | TouchEvent) => {
    const bolaArrastando = bolas.find(bola => bola.arrastando);
    if (!bolaArrastando) return;

    const tipoEvento = e.type.includes('touch') ? 'touch' : 'mouse';
    const clientX = tipoEvento === 'touch' 
      ? (e as TouchEvent).touches[0].clientX 
      : (e as MouseEvent).clientX;
    
    const clientY = tipoEvento === 'touch' 
      ? (e as TouchEvent).touches[0].clientY 
      : (e as MouseEvent).clientY;

    if (containerRef.current && bolaRefs.current[bolaArrastando.id]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const bolaRect = bolaRefs.current[bolaArrastando.id]!.getBoundingClientRect();

      let novaX = clientX - bolaArrastando.offset.x - containerRect.left;
      let novaY = clientY - bolaArrastando.offset.y - containerRect.top;

      const maxX = containerRect.width - bolaRect.width;
      const maxY = containerRect.height - bolaRect.height;

      novaX = Math.max(0, Math.min(novaX, maxX));
      novaY = Math.max(0, Math.min(novaY, maxY));

      setBolas(prev => prev.map(bola => 
        bola.id === bolaArrastando.id 
          ? { 
              ...bola, 
              posicao: { x: novaX, y: novaY },
              posicaoAlvo: { x: novaX, y: novaY }
            }
          : bola
      ));
    }
  };

  const pararArraste = () => {
    setBolas(prev => prev.map(bola => ({ ...bola, arrastando: false })));
  };

  useEffect(() => {
    const algumaBolaArrastando = bolas.some(bola => bola.arrastando);
    
    if (algumaBolaArrastando) {
      document.addEventListener('mousemove', arrastar);
      document.addEventListener('mouseup', pararArraste);
      document.addEventListener('touchmove', arrastar);
      document.addEventListener('touchend', pararArraste);
    } else {
      document.removeEventListener('mousemove', arrastar);
      document.removeEventListener('mouseup', pararArraste);
      document.removeEventListener('touchmove', arrastar);
      document.removeEventListener('touchend', pararArraste);
    }

    return () => {
      document.removeEventListener('mousemove', arrastar);
      document.removeEventListener('mouseup', pararArraste);
      document.removeEventListener('touchmove', arrastar);
      document.removeEventListener('touchend', pararArraste);
    };
  }, [bolas]);

  const ativarModoConectar = () => {
    setModoConectar(true);
    setBolaSelecionada(null);
    setBolas(prev => prev.map(bola => ({ ...bola, selecionada: false })));
  };

  const desativarModoConectar = () => {
    setModoConectar(false);
    setBolaSelecionada(null);
    setBolas(prev => prev.map(bola => ({ ...bola, selecionada: false })));
  };

  const clicarBola = (id: number) => {
    if (!modoConectar) return;

    if (bolaSelecionada === null) {
      setBolaSelecionada(id);
      setBolas(prev => prev.map(bola => 
        bola.id === id ? { ...bola, selecionada: true } : { ...bola, selecionada: false }
      ));
    } else if (bolaSelecionada === id) {
      const conexaoId = `autorreflexao-${id}`;
      
      const conexaoExistente = conexoes.find(conexao => 
        conexao.id === conexaoId
      );

      if (!conexaoExistente) {
        const novaConexao: Conexao = {
          id: conexaoId,
          de: id,
          para: id,
          ativa: true,
          direcao: `${id}→${id}`,
          tipo: 'autorreflexao',
          caractere: 'ε'
        };
        
        setConexoes(prev => [...prev, novaConexao]);
        setBolas(prev => prev.map(bola => 
          bola.id === id ? { ...bola, conectada: true, selecionada: false } : bola
        ));
      }

      setBolaSelecionada(null);
      setBolas(prev => prev.map(bola => ({ ...bola, selecionada: false })));
      setModoConectar(false);
    } else {
      const conexaoId = `conexao-${bolaSelecionada}-${id}`;
      
      const conexaoExistente = conexoes.find(conexao => 
        conexao.id === conexaoId
      );

      if (!conexaoExistente) {
        const novaConexao: Conexao = {
          id: conexaoId,
          de: bolaSelecionada,
          para: id,
          ativa: true,
          direcao: `${bolaSelecionada}→${id}`,
          tipo: 'normal',
          caractere: 'A'
        };
        
        setConexoes(prev => [...prev, novaConexao]);
        setBolas(prev => prev.map(bola => 
          (bola.id === bolaSelecionada || bola.id === id) 
            ? { ...bola, conectada: true, selecionada: false } 
            : bola
        ));
      }

      setBolaSelecionada(null);
      setBolas(prev => prev.map(bola => ({ ...bola, selecionada: false })));
      setModoConectar(false);
    }
  };

  const iniciarEdicaoConexao = (conexaoId: string, caractereAtual: string) => {
    setEditandoConexao(conexaoId);
    setNovoCaractere(caractereAtual);
  };

  const confirmarEdicaoConexao = () => {
    if (editandoConexao && novoCaractere.trim() !== '') {
      setConexoes(prev => prev.map(conexao => 
        conexao.id === editandoConexao 
          ? { ...conexao, caractere: novoCaractere.trim() }
          : conexao
      ));
      setEditandoConexao(null);
      setNovoCaractere('');
    }
  };

  const cancelarEdicaoConexao = () => {
    setEditandoConexao(null);
    setNovoCaractere('');
  };

  const removerConexao = (conexaoId: string) => {
    const conexao = conexoes.find(c => c.id === conexaoId);
    if (conexao) {
      setConexoes(prev => prev.filter(c => c.id !== conexaoId));
      
      const conexoesRestantesDe = conexoes.filter(c => 
        c.id !== conexaoId && (c.de === conexao.de || c.para === conexao.de)
      );
      
      const conexoesRestantesPara = conexao.tipo === 'normal' ? 
        conexoes.filter(c => 
          c.id !== conexaoId && (c.de === conexao.para || c.para === conexao.para)
        ) : [];

      setBolas(prev => prev.map(bola => {
        if (bola.id === conexao.de) {
          return { ...bola, conectada: conexoesRestantesDe.length > 0 };
        } else if (conexao.tipo === 'normal' && bola.id === conexao.para) {
          return { ...bola, conectada: conexoesRestantesPara.length > 0 };
        }
        return bola;
      }));
    }
  };

  const removerTodasConexoes = () => {
    setConexoes([]);
    setBolas(prev => prev.map(bola => ({ ...bola, conectada: false })));
  };

  const existeConexao = (deId: number, paraId: number): boolean => {
    return conexoes.some(conexao => 
      conexao.de === deId && conexao.para === paraId
    );
  };

  const calcularPontosSetaNormal = (deId: number, paraId: number, offset: number = 0) => {
    const bolaDe = bolas.find(bola => bola.id === deId);
    const bolaPara = bolas.find(bola => bola.id === paraId);
    
    if (!bolaDe || !bolaPara || !bolaRefs.current[deId] || !bolaRefs.current[paraId]) {
      return null;
    }

    const bolaDeRect = bolaRefs.current[deId].getBoundingClientRect();
    const bolaParaRect = bolaRefs.current[paraId].getBoundingClientRect();

    const centroBolaDe = {
      x: bolaDe.posicao.x + bolaDeRect.width / 2,
      y: bolaDe.posicao.y + bolaDeRect.height / 2
    };

    const centroBolaPara = {
      x: bolaPara.posicao.x + bolaParaRect.width / 2,
      y: bolaPara.posicao.y + bolaParaRect.height / 2
    };

    const dx = centroBolaPara.x - centroBolaDe.x;
    const dy = centroBolaPara.y - centroBolaDe.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia === 0) return null;

    const direcaoX = dx / distancia;
    const direcaoY = dy / distancia;

    const perpendicularX = -direcaoY;
    const perpendicularY = direcaoX;

    const raioBola = bolaDeRect.width / 2;
    
    const espacamento = Math.abs(offset) > 0 ? 15 : 0;
    
    const inicio = {
      x: centroBolaDe.x + direcaoX * raioBola + perpendicularX * espacamento * Math.sign(offset),
      y: centroBolaDe.y + direcaoY * raioBola + perpendicularY * espacamento * Math.sign(offset)
    };

    const fim = {
      x: centroBolaPara.x - direcaoX * raioBola + perpendicularX * espacamento * Math.sign(offset),
      y: centroBolaPara.y - direcaoY * raioBola + perpendicularY * espacamento * Math.sign(offset)
    };

    // POSIÇÃO CORRIGIDA - Mais próximo da seta
    const meio = {
      x: (inicio.x + fim.x) / 2 + perpendicularX * 8 * Math.sign(offset),
      y: (inicio.y + fim.y) / 2 + perpendicularY * 8 * Math.sign(offset)
    };

    const tamanhoSeta = 12;
    const anguloSeta = Math.PI / 6;

    const ponta1 = {
      x: fim.x - direcaoX * tamanhoSeta + direcaoY * tamanhoSeta * Math.tan(anguloSeta),
      y: fim.y - direcaoY * tamanhoSeta - direcaoX * tamanhoSeta * Math.tan(anguloSeta)
    };

    const ponta2 = {
      x: fim.x - direcaoX * tamanhoSeta - direcaoY * tamanhoSeta * Math.tan(anguloSeta),
      y: fim.y - direcaoY * tamanhoSeta + direcaoX * tamanhoSeta * Math.tan(anguloSeta)
    };

    return { inicio, fim, ponta1, ponta2, direcaoX, direcaoY, meio };
  };

  const calcularPontosAutorreflexao = (bolaId: number) => {
    const bola = bolas.find(b => b.id === bolaId);
    if (!bola || !bolaRefs.current[bolaId]) return null;

    const bolaRect = bolaRefs.current[bolaId].getBoundingClientRect();
    const centro = {
      x: bola.posicao.x + bolaRect.width / 2,
      y: bola.posicao.y + bolaRect.height / 2
    };

    const raio = bolaRect.width / 2;
    const raioLoop = raio * 2.2;

    const anguloInicio = Math.PI / 4;
    const anguloFim = 2 * Math.PI - Math.PI / 4;

    const pontoControle1 = {
      x: centro.x + raioLoop * Math.cos(anguloInicio) + 20,
      y: centro.y - raioLoop * Math.sin(anguloInicio) + 25
    };

    const pontoControle2 = {
      x: centro.x + raioLoop * Math.cos(anguloFim) + 15,
      y: centro.y - raioLoop * Math.sin(anguloFim) + 10
    };

    const pontoFim = {
      x: centro.x + raio * Math.cos(anguloFim),
      y: centro.y - raio * Math.sin(anguloFim)
    };

    // POSIÇÃO CORRIGIDA - Mais próximo do loop
    const pontoCaractere = {
      x: centro.x + raioLoop * 0.35 + 8,
      y: centro.y - raioLoop * 0.35 - 8
    };

    const tamanhoSeta = 10;
    const ponta1 = {
      x: pontoFim.x - Math.cos(anguloFim) * tamanhoSeta + Math.sin(anguloFim) * tamanhoSeta,
      y: pontoFim.y - Math.sin(anguloFim) * tamanhoSeta - Math.cos(anguloFim) * tamanhoSeta
    };

    const ponta2 = {
      x: pontoFim.x - Math.cos(anguloFim) * tamanhoSeta - Math.sin(anguloFim) * tamanhoSeta,
      y: pontoFim.y - Math.sin(anguloFim) * tamanhoSeta + Math.cos(anguloFim) * tamanhoSeta
    };

    return { 
      centro, 
      pontoControle1, 
      pontoControle2, 
      pontoFim, 
      ponta1, 
      ponta2,
      pontoCaractere,
      raioLoop 
    };
  };

  const calcularDistancia = (deId: number, paraId: number): number => {
    if (deId === paraId) return 0;
    
    const pontos = calcularPontosSetaNormal(deId, paraId, 0);
    if (!pontos) return 0;
    
    const dx = pontos.fim.x - pontos.inicio.x;
    const dy = pontos.fim.y - pontos.inicio.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calcularOffsetConexaoDupla = (deId: number, paraId: number): number => {
    const hash = deId * 31 + paraId;
    return hash % 2 === 0 ? 1 : -1;
  };

  const existeConexaoDupla = (bola1: number, bola2: number): boolean => {
    return existeConexao(bola1, bola2) && existeConexao(bola2, bola1);
  };

  const getCaractereBola = (id: number): string => {
    const bola = bolas.find(b => b.id === id);
    return bola?.caractere || id.toString();
  };

  const getCaractereConexao = (deId: number, paraId: number): string => {
    const conexao = conexoes.find(c => c.de === deId && c.para === paraId);
    return conexao?.caractere || '';
  };

  const gerarResumoConexoes = () => {
    const resumo = [];
    for (let i = 0; i < bolas.length; i++) {
      for (let j = 0; j < bolas.length; j++) {
        if (i !== j) {
          const de = bolas[i].id;
          const para = bolas[j].id;
          const conexao = conexoes.find(c => c.de === de && c.para === para);
          resumo.push(
            <p key={`${de}-${para}`}>
              {getCaractereBola(de)} → {getCaractereBola(para)}: 
              {conexao ? ` ${conexao.caractere}` : ' ❌'}
            </p>
          );
        }
      }
      const bolaId = bolas[i].id;
      const autorreflexao = conexoes.find(c => c.de === bolaId && c.para === bolaId);
      resumo.push(
        <p key={`${bolaId}-self`}>
          {getCaractereBola(bolaId)} → Si: 
          {autorreflexao ? ` ${autorreflexao.caractere}` : ' ❌'}
        </p>
      );
    }
    return resumo;
  };

  return (
    <div className="container" ref={containerRef}>
      <svg
        ref={svgRef}
        className="seta-conexao"
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
            id="arrowhead-autorreflexao"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#9C27B0" />
          </marker>
        </defs>

        {conexoes.map(conexao => {
          if (conexao.tipo === 'autorreflexao') {
            const pontos = calcularPontosAutorreflexao(conexao.de);
            if (!pontos) return null;

            return (
              <g key={conexao.id} className="seta-autorreflexao">
                <path
                  d={`
                    M ${pontos.centro.x + pontos.raioLoop * 0.3}, ${pontos.centro.y}
                    C ${pontos.pontoControle1.x}, ${pontos.pontoControle1.y}
                      ${pontos.pontoControle2.x}, ${pontos.pontoControle2.y}
                      ${pontos.pontoFim.x}, ${pontos.pontoFim.y}
                  `}
                  stroke="#9C27B0"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead-autorreflexao)"
                />
                <text
                  x={pontos.pontoCaractere.x}
                  y={pontos.pontoCaractere.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="caractere-conexao"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#9C27B0"
                >
                  {conexao.caractere}
                </text>
              </g>
            );
          } else {
            const isDupla = existeConexaoDupla(conexao.de, conexao.para);
            const offset = isDupla ? calcularOffsetConexaoDupla(conexao.de, conexao.para) : 0;

            const pontos = calcularPontosSetaNormal(conexao.de, conexao.para, offset);
            if (!pontos) return null;

            return (
              <g key={conexao.id} className={`seta-conectavel ${isDupla ? (offset > 0 ? 'dupla-superior' : 'dupla-inferior') : ''}`}>
                <line
                  x1={pontos.inicio.x}
                  y1={pontos.inicio.y}
                  x2={pontos.fim.x}
                  y2={pontos.fim.y}
                  stroke={conexao.ativa ? "#4CAF50" : "#FF5722"}
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                <polygon
                  points={`
                    ${pontos.fim.x},${pontos.fim.y}
                    ${pontos.ponta1.x},${pontos.ponta1.y}
                    ${pontos.ponta2.x},${pontos.ponta2.y}
                  `}
                  fill={conexao.ativa ? "#4CAF50" : "#FF5722"}
                />
                <text
                  x={pontos.meio.x}
                  y={pontos.meio.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="caractere-conexao"
                  fontSize="14"
                  fontWeight="bold"
                  fill={conexao.ativa ? "#4CAF50" : "#FF5722"}
                >
                  {conexao.caractere}
                </text>
              </g>
            );
          }
        })}
      </svg>

      {bolas.map(bola => (
        <div
          key={bola.id}
          ref={atribuirRef(bola.id)}
          className={`
            bola 
            bola-${bola.id} 
            ${bola.arrastando ? 'arrastando' : ''}
            ${bola.conectada ? 'conectada' : ''}
            ${bola.selecionada ? 'selecionada' : ''}
          `}
          style={{
            transform: `translate(${bola.posicao.x}px, ${bola.posicao.y}px)`,
            background: `radial-gradient(circle at 30% 30%, ${
              bola.id === 2 ? '#ff6b6b, #c0392b' :
              bola.id === 3 ? '#6bffb8, #2bc06a' :
              '#ffeb3b, #ff9800'
            })`
          }}
          onMouseDown={(e) => iniciarArraste(e, bola.id)}
          onTouchStart={(e) => iniciarArraste(e, bola.id)}
          onClick={() => clicarBola(bola.id)}
        >
          <span className="bola-caractere">{bola.caractere}</span>
        </div>
      ))}
      
      <div className="info">
        <h1>Sistema de Autômatos</h1>
        
        <div className="controles">
          {!modoConectar ? (
            <button className="btn-conectar" onClick={ativarModoConectar}>
              🔗 Modo Conectar
            </button>
          ) : (
            <button className="btn-cancelar" onClick={desativarModoConectar}>
              ❌ Cancelar
            </button>
          )}
          
          {conexoes.length > 0 && (
            <button className="btn-remover-todas" onClick={removerTodasConexoes}>
              🗑️ Remover Todas
            </button>
          )}
        </div>

        <div className="status">
          <p>Modo: <strong>{modoConectar ? 'CONECTAR' : 'ARRASTAR'}</strong></p>
          {modoConectar && bolaSelecionada && (
            <p>Selecionada: {getCaractereBola(bolaSelecionada)} - Clique em outra bola ou na mesma para autorreflexão</p>
          )}
          {modoConectar && !bolaSelecionada && (
            <p>Clique em uma bola para começar a conectar</p>
          )}
          <p className="dica">
            💡 Dica: Clique na mesma bola duas vezes para criar autorreflexão
          </p>
        </div>

        <div className="conexoes-info">
          <h3>Conexões ({conexoes.length})</h3>
          {conexoes.map(conexao => (
            <div key={conexao.id} className={`conexao-item ${conexao.tipo}`}>
              <div className="conexao-detalhes">
                <span className="direcao">
                  {conexao.tipo === 'autorreflexao' ? '🔄' : '→'} 
                  {getCaractereBola(conexao.de)} {conexao.tipo === 'autorreflexao' ? '→ Si mesma' : `→ ${getCaractereBola(conexao.para)}`}
                </span>
                <span className="distancia">
                  ({conexao.tipo === 'autorreflexao' ? 'loop' : Math.round(calcularDistancia(conexao.de, conexao.para)) + 'px'})
                </span>
              </div>
              
              <div className="conexao-controles">
                {editandoConexao === conexao.id ? (
                  <div className="edicao-caractere">
                    <input
                      type="text"
                      value={novoCaractere}
                      onChange={(e) => setNovoCaractere(e.target.value)}
                      maxLength={1}
                      className="input-caractere"
                      autoFocus
                    />
                    <button onClick={confirmarEdicaoConexao} className="btn-confirmar">
                      ✓
                    </button>
                    <button onClick={cancelarEdicaoConexao} className="btn-cancelar-edicao">
                      ✗
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="caractere-conexao-texto" 
                          onClick={() => iniciarEdicaoConexao(conexao.id, conexao.caractere)}>
                      [{conexao.caractere}]
                    </span>
                    <button onClick={() => removerConexao(conexao.id)} className="btn-remover">
                      Remover
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="resumo-conexoes">
          <h4>Resumo de Conexões:</h4>
          {gerarResumoConexoes()}
        </div>

        <button onClick={posicionarBolas}>Centralizar Bolas</button>
      </div>
    </div>
  );
};

export default BolaArrastavel;