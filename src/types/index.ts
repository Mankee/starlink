
export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export type Entity = {
  type: string;
  id: number;
  coordinates: Coordinates;
}

export interface User extends Entity {
  satellites: Record<string, Satellite>[];
}

export interface Satellite extends Entity {
  users: Record<string, User>[];
}

export interface ParsedData {
  satellites: Satellite[];
  users: User[];
  interferers: Entity[];
}