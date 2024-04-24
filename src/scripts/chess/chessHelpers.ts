import type { NumSquaresToEdge, Figure } from "@/types/chessTypes"
import { FigureColorType, FigureType } from "@/enums/figure"
import { reactive } from 'vue'
import { isUpperCase } from "@/helpers/isUpperCase"
import { pieceTypeFromSymbol } from '@/constants/chess/piece'
export function getNumberOfSquaresInDirection(startSquare: number, directionIndex: number, arrayOfSquaresToEdge: NumSquaresToEdge[]): number {
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

export function getFigureByIndex(index: number, board: any): Figure {
  return board.squares[7 - Math.floor(index / 8)][index % 8] ?? null
}

export function setMoveData(): NumSquaresToEdge[] {
  const arrayOfSquaresToEdge: NumSquaresToEdge[] = [];
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const numNorth: number = 7 - rank;
      const numSouth: number = rank;
      const numWest: number = file;
      const numEast: number = 7 - file;
      const squareIndex = rank * 8 + file;
      const minNW: number = Math.min(numNorth, numWest);
      const minSE: number = Math.min(numSouth, numEast);
      const minNE: number = Math.min(numNorth, numEast);
      const minSW: number = Math.min(numSouth, numWest);
      arrayOfSquaresToEdge[squareIndex] = {
        numNorth: numNorth,
        numSouth: numSouth,
        numWest: numWest,
        numEast: numEast,
        minNW: minNW,
        minSE: minSE,
        minNE: minNE,
        minSW: minSW
      };
    }
  }
  return arrayOfSquaresToEdge;
}


export function setSquareColor(squareIndex: number, color: string, itemRefs: any) {
  itemRefs.value.forEach((element) => {
    const index = element.getAttribute('index')
    if (squareIndex == index) {
      element.style.backgroundColor ? color : '#FFFF00'
    }
  })
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

export function getFigureTypeByString(fenSymbol: string): FigureType | undefined {
  const piece = pieceTypeFromSymbol.find((item) => item.string === fenSymbol)
  return piece ? piece.figure : undefined
}

export function deleteFigureImage(board: any, dragStartSquare: Figure) {
  board.squares[dragStartSquare.rank][dragStartSquare.file.charCodeAt(0) - 97] = null
}

export function loadPositionFromFen(fen: string) {
  const board = reactive({
    squares: Array.from({ length: 8 }, () => Array(8).fill(null))
  })
  const fenBoard: string = fen.split(' ')[0]
  let file: number = 0
  let rank: number = 8
  let index: number = 0
  for (const symbol of fenBoard) {
    if (symbol === '/') {
      file = 0
      rank--
      index++
    } else {
      if (Number(symbol)) {
        for (let i = file; i < file + Number(symbol); i++) {
          board.squares[index][i] = {
            type: FigureType.ClearBoard,
            color: FigureColorType.ClearBoard,
            file: String.fromCharCode(97 + file),
            rank: rank
          }
        }
        file += Number(symbol)
      } else {
        const pieceColor = isUpperCase(symbol) ? FigureColorType.White : FigureColorType.Black
        const pieceType = getFigureTypeByString(symbol.toLowerCase())
        board.squares[index][file] = {
          type: pieceType,
          color: pieceColor,
          file: String.fromCharCode(97 + file),
          rank: rank
        }
        file++
      }
    }
  }
  return board
}