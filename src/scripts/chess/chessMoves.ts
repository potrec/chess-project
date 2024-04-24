import { FigureColorType, FigureType } from "@/enums/figure"
import type { Move, NumSquaresToEdge } from "@/types/chessTypes"
import { getFigureByIndex, getNumberOfSquaresInDirection} from "./chessHelpers"
import { directionOffsets } from "@/constants/chess/piece"

export function generateSlidingMoves(startSquare: number, playerColor: FigureColorType,opponentColor: FigureColorType, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[] {
  const startDirIndex = getFigureByIndex(startSquare,board).type == FigureType.Bishop ? 4 : 0
  const endDirIndex = getFigureByIndex(startSquare,board).type == FigureType.Rook ? 4 : 8
  const moves: Move[] = []
  for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
    //todo: check black rook when in start situation
    const numberOfSquaresInDirection = getNumberOfSquaresInDirection(startSquare, directionIndex, arrayOfSquaresToEdge)
    for (let n = 0; n < numberOfSquaresInDirection; n++) {
      const targetSquare = startSquare + directionOffsets[directionIndex] * (n + 1)
      console.log('target square: ' + targetSquare)
      const figure = getFigureByIndex(targetSquare,board)
      if (playerColor == figure.color) {
        console.log('met same color figure, changing direction')
        break
      }
      moves.push({ startSquare, targetSquare })
      if (opponentColor == figure.color) {
        console.log('met enemy color, changing direction')
        break
      }
    }
  }
  return moves
}