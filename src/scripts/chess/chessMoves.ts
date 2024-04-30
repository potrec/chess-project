import { FigureColorType, FigureType } from "@/enums/figure"
import type { Move, NumSquaresToEdge } from "@/types/chessTypes"
import { getFigureByIndex, getNumberOfSquaresInDirection} from "./chessHelpers"
import { directionOffsets } from "@/constants/chess/piece"

export function generateSlidingMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[] {
  const selectedFigure = getFigureByIndex(startSquare,board)
  const startDirIndex = selectedFigure.type == FigureType.Bishop ? 4 : 0
  const endDirIndex = selectedFigure.type == FigureType.Queen ? 4 : 8
  const moves: Move[] = []
  for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
    //todo: check black rook when in start situation
    const numberOfSquaresInDirection = getNumberOfSquaresInDirection(startSquare, directionIndex, arrayOfSquaresToEdge)
    for (let n = 0; n < numberOfSquaresInDirection; n++) {
      const targetSquare = startSquare + directionOffsets[directionIndex] * (n + 1)
      console.log('target square: ' + targetSquare)
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        console.log('met same color figure, changing direction')
        break
      }
      moves.push({ startSquare, targetSquare })
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        console.log('met enemy color, changing direction')
        break
      }
    }
  }
  return moves
}

export function generateStraightMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[]
{

}