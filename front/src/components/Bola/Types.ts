export interface Position {
  x: number;
  y: number;
}

export interface Offset {
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

export interface Connection {
  id: string;
  from: number;
  to: number;
  active: boolean;
  direction: string;
  type: 'normal' | 'selfReflexive';
  character: string;
}

export interface ConnectionPoints {
  start: Position;
  end: Position;
  point1: Position;
  point2: Position;
  directionX: number;
  directionY: number;
  middle?: Position;
}

export interface SelfReflexivePoints {
  center: Position;
  controlPoint1: Position;
  controlPoint2: Position;
  endPoint: Position;
  point1: Position;
  point2: Position;
  characterPoint: Position;
  loopRadius: number;
}