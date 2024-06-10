import type { NumSquaresToEdge, Figure, Move } from "@/types/chessTypes"
import { FigureColorType, FigureType, MoveType } from "@/enums/figure"
import { reactive, type Ref } from 'vue'
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

export function getSquareIndexByCords(x: number ,y: number): number {
  return 64 - (8 - y) - x * 8
}

export function getIndexesByFigureIndex(squareIndex: number){
  return {
    x: 7 - Math.floor(squareIndex / 8),
    y: squareIndex % 8
  }
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


export function setSquareColor(squareIndex: number, colorClass: string, arrayOfStyles: Ref<string[]>) {
  arrayOfStyles.value[squareIndex] = colorClass
}

export function removeSquareColor(squareIndex: number, arrayOfStyles: Ref<string[]>) {
  arrayOfStyles.value[squareIndex] = ''
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

export function deleteFigureFromBoard(board: any, dragStartSquare: Figure) {
  const clearSquare: Figure = {
    type: FigureType.ClearBoard,
    color: FigureColorType.ClearBoard,
    file: dragStartSquare.file,
    rank: dragStartSquare.rank,
    moves: []
  };
  board.squares[8-dragStartSquare.rank][dragStartSquare.file.charCodeAt(0) - 97] = clearSquare
}

export function addFigureToBoard(board: any, figure: Figure)
{
  board.squares[8-figure.rank][figure.file.charCodeAt(0) - 97] = figure
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

export function getFigureIndexByFigure(figure: Figure): number {
  return  (figure.rank-1) * 8 + (figure.file.charCodeAt(0) - 97)
}

export function getFigureToString(figure: Figure) {
  console.log("color: ",figure.color," type: ",figure.type," rank: ",figure.rank, " file: ",figure.file," moves: ",figure.moves)
}

export function getFigureMoveByIndex(figure: Figure, index: number): MoveType | undefined
{
  return figure.moves.find(move => move.targetSquare == index)?.moveType
}

export function getColorAndRank(value: number): { color: FigureColorType; rank: number } {
  return value < 7? 
    { color: FigureColorType.White, rank: 1 } :
    { color: FigureColorType.Black, rank: 8 };
}