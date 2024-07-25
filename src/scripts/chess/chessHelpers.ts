import type { NumSquaresToEdge, Figure } from '@/types/chessTypes'
import { FigureColorType, FigureType, MoveType } from '@/enums/figure'
import { type Ref } from 'vue'
import { isUpperCase } from '@/helpers/isUpperCase'
import { pieceTypeFromSymbol } from '@/constants/chess/piece'
export function getNumberOfSquaresInDirection(
  startSquare: number,
  directionIndex: number,
  arrayOfSquaresToEdge: NumSquaresToEdge[]
): number {
  let numberOfSquaresInDirection = 0
  switch (directionIndex) {
    case 0:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].numNorth
      break
    case 1:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].numSouth
      break
    case 2:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].numWest
      break
    case 3:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].numEast
      break
    case 4:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].minNW
      break
    case 5:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].minSE
      break
    case 6:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].minNE
      break
    case 7:
      numberOfSquaresInDirection = arrayOfSquaresToEdge[startSquare].minSW
      break
    default:
      numberOfSquaresInDirection = 0
  }
  return numberOfSquaresInDirection
}

export const getFigureByIndex = (index: number, board: Figure[][]): Figure =>
  board[7 - Math.floor(index / 8)][index % 8]
export const getSquareIndexByCords = (x: number, y: number): number => 64 - (8 - y) - x * 8
export const getIndexesByFigureIndex = (squareIndex: number) => ({
  x: 7 - Math.floor(squareIndex / 8),
  y: squareIndex % 8
})

export function setMoveData(): NumSquaresToEdge[] {
  const arrayOfSquaresToEdge: NumSquaresToEdge[] = []

  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const numNorth: number = 7 - rank
      const numSouth: number = rank
      const numWest: number = file
      const numEast: number = 7 - file
      const squareIndex = rank * 8 + file
      const minNW: number = Math.min(numNorth, numWest)
      const minSE: number = Math.min(numSouth, numEast)
      const minNE: number = Math.min(numNorth, numEast)
      const minSW: number = Math.min(numSouth, numWest)
      arrayOfSquaresToEdge[squareIndex] = {
        numNorth: numNorth,
        numSouth: numSouth,
        numWest: numWest,
        numEast: numEast,
        minNW: minNW,
        minSE: minSE,
        minNE: minNE,
        minSW: minSW
      }
    }
  }
  return arrayOfSquaresToEdge
}

export function setSquareColor(squareIndex: number, colorClass: string, arrayOfStyles: string[]) {
  arrayOfStyles[squareIndex] = colorClass
}

export function removeSquareColor(squareIndex: number, arrayOfStyles: string[]) {
  arrayOfStyles[squareIndex] = ''
}

export function getFigures(figure: Figure): string {
  let path = '/src/assets/images/figures/Chess_'

  switch (figure.type) {
    case FigureType.King:
      path += 'k'
      break
    case FigureType.Queen:
      path += 'q'
      break
    case FigureType.Rook:
      path += 'r'
      break
    case FigureType.Bishop:
      path += 'b'
      break
    case FigureType.Knight:
      path += 'n'
      break
    case FigureType.Pawn:
      path += 'p'
      break
    default:
      return ''
  }

  path += figure.color === FigureColorType.White ? 'lt45.png' : 'dt45.png'
  return path
}

export function getFigureTypeByString(fenSymbol: string): FigureType {
  const piece = pieceTypeFromSymbol.find((item) => item.string === fenSymbol)

  return piece ? piece.figure : FigureType.ClearBoard
}

export function deleteFigureFromBoard(board: Figure[][], dragStartSquare: Figure) {
  const clearSquare: Figure = {
    type: FigureType.ClearBoard,
    color: FigureColorType.ClearBoard,
    file: dragStartSquare.file,
    rank: dragStartSquare.rank,
    moves: []
  }
  board[8 - dragStartSquare.rank][dragStartSquare.file.charCodeAt(0) - 97] = clearSquare
}

export function addFigureToBoard(board: Figure[][], figure: Figure) {
  board[8 - figure.rank][figure.file.charCodeAt(0) - 97] = figure
}

export function savePositionToFen(board: Figure[][]): string {
  let fen: string = ''

  for (let rank = 0; rank < 8; rank++) {
    let emptySquares = 0
    for (let file = 0; file < 8; file++) {
      const figure = board[rank][file]
      if (figure.type === FigureType.ClearBoard) {
        emptySquares++
      } else {
        if (emptySquares) {
          fen += emptySquares
          emptySquares = 0
        }
        const piece = pieceTypeFromSymbol.find((item) => item.figure === figure.type)!
        fen += figure.color === FigureColorType.White ? piece.string.toUpperCase() : piece.string
      }
    }
    if (emptySquares) {
      fen += emptySquares
    }
    if (rank < 7) {
      fen += '/'
    }
  }
  return fen
}

export function getFigureIndexByFigure(figure: Figure): number {
  return (figure.rank - 1) * 8 + (figure.file.charCodeAt(0) - 97)
}

export function getFigureToString(figure: Figure) {
  console.log(
    'color: ',
    figure.color,
    ' type: ',
    figure.type,
    ' rank: ',
    figure.rank,
    ' file: ',
    figure.file,
    ' moves: ',
    figure.moves
  )
}

export function getFigureMoveByIndex(figure: Figure, index: number): MoveType | undefined {
  return figure.moves.find((move) => move.targetSquare == index)?.moveType
}

export function getColorAndRank(value: number): { color: FigureColorType; rank: number } {
  return value < 7
    ? { color: FigureColorType.White, rank: 1 }
    : { color: FigureColorType.Black, rank: 8 }
}

export function clearBoardFromColors(arrayOfStyles: string[]): string[] {
  console.log('clearBoardFromColors', arrayOfStyles)
  for (let i = 0; i < 64; i++) {
    removeSquareColor(i, arrayOfStyles)
  }
  return arrayOfStyles
}
