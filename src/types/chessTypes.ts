import type { FigureType, FigureColorType, MoveType } from '@/enums/figure'

export type Figure = {
  type: FigureType
  color: FigureColorType
  file: string
  rank: number
  moves: Move[]
}

export type FenNotationType = {
  figure: FigureType
  string: string
}

export type TempFigure = {
  i: number
  j: number
}

export type Move = {
  startSquare: number
  targetSquare: number
  moveType: MoveType
}

export type NumSquaresToEdge = {
  numNorth: number
  numSouth: number
  numWest: number
  numEast: number
  minNW: number
  minSE: number
  minNE: number
  minSW: number
}

export type SquareAttack = {
  square: number
  attackingFigureColor: FigureColorType
}
