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
  const selectedFigure = getFigureByIndex(startSquare,board)
  const moves: Move[] = []
  const {x: x, y: y} = getIndexesByFigureIndex(startSquare)
  const canMoveOnX = [ 2, 1, 1, 1]
  const canMoveOnY = [ 0, 0, 1, -1]
  for (let i = 0; i < 4; i++)
  {
    const colorSwitch = selectedFigure.color == FigureColorType.White ? 1 : -1
    canMoveOnX[i] = canMoveOnX[i] * colorSwitch
    canMoveOnY[i] = canMoveOnY[i] * colorSwitch
    if(!(x-canMoveOnX[i] < 0 || y-canMoveOnY[i] < 0 || !board.squares[x-canMoveOnX[i]] || !board.squares[x-canMoveOnX[i]][y-canMoveOnY[i]]))
    {
      const targetSquare = getSquareIndexByCords(x-canMoveOnX[i], y-canMoveOnY[i])
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        continue
      }
      if((i == 0) && !((selectedFigure.color == FigureColorType.White && selectedFigure.rank == 2) || (selectedFigure.color == FigureColorType.Black && selectedFigure.rank == 7)))
      {
        continue
      }
      moves.push({ startSquare, targetSquare })
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        continue
      }
    }
  }
  return moves
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
        continue
      }
      moves.push({ startSquare, targetSquare })
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        continue
      }
    }
  }
  return moves
}

export function generateKingMoves(startSquare: number, board: any): Move[]
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const moves: Move[] = []
  const {x: x, y: y} = getIndexesByFigureIndex(startSquare)
  const canMoveOnX = [-1, 1, -1, -1, 0, 0, 1, 1];
  const canMoveOnY = [0, 0, 1, -1, 1, -1, 1, -1];
  for (let i = 0; i < 8; i++)
  {
    if(!(x-canMoveOnX[i] < 0 || y-canMoveOnY[i] < 0 || !board.squares[x-canMoveOnX[i]] || !board.squares[x-canMoveOnX[i]][y-canMoveOnY[i]]))
    {
      const targetSquare = getSquareIndexByCords(x-canMoveOnX[i], y-canMoveOnY[i])
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        continue
      }
      moves.push({ startSquare, targetSquare })
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        continue
      }
    }
  }
  return moves
}