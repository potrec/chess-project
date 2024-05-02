import { FigureColorType, FigureType } from "@/enums/figure"
import type { Move, NumSquaresToEdge } from "@/types/chessTypes"
import { getFigureByIndex, getNumberOfSquaresInDirection, getSquareIndexByCords, getIndexesByFigureIndex} from "./chessHelpers"
import { directionOffsets } from "@/constants/chess/piece"

export function generateSlidingMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[] 
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const startDirIndex = selectedFigure.type == FigureType.Bishop ? 4 : 0
  const endDirIndex = selectedFigure.type == FigureType.Rook ? 4 : 8
  const moves: Move[] = []

  for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
    //todo: check black rook when in start situation
    const numberOfSquaresInDirection = getNumberOfSquaresInDirection(startSquare, directionIndex, arrayOfSquaresToEdge)
    for (let n = 0; n < numberOfSquaresInDirection; n++) {
      const targetSquare = startSquare + directionOffsets[directionIndex] * (n + 1)
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        break
      }
      moves.push({ startSquare, targetSquare })
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        break
      }
    }
  }
  return moves
}

export function generateStraightMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[]
{

}

export function generateKnightMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[]
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const moves: Move[] = []
  const {x: x, y: y} = getIndexesByFigureIndex(startSquare)
  const canMoveOnX = [ 2, 1, -1, -2, -2, -1, 1, 2 ];
  const canMoveOnY = [ 1, 2, 2, 1, -1, -2, -2, -1 ];

  for (let i = 0; i < 8; i++)
  {
    if(!(x-canMoveOnX[i] < 0 || y-canMoveOnY[i] < 0 || !board.squares[x-canMoveOnX[i]] || !board.squares[x-canMoveOnX[i]][y-canMoveOnY[i]]))
    {
      const targetSquare = getSquareIndexByCords(x-canMoveOnX[i], y-canMoveOnY[i])
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        break
      }
      moves.push({ startSquare, targetSquare })
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        break
      }
    }
  }
  return moves
}