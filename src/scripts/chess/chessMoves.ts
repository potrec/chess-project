import { FigureColorType, FigureType } from "@/enums/figure"
import type { Move, NumSquaresToEdge } from "@/types/chessTypes"
import { getFigureByIndex, getNumberOfSquaresInDirection} from "./chessHelpers"
import { directionOffsets } from "@/constants/chess/piece"

export function generateSlidingMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[] {
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

export function generateHorseMoves(startSquare: number, board: any, arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[]
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const startDirIndex = 4
  const endDirIndex = 8
  const moves: Move[] = []
  
  let downDirection = getNumberOfSquaresInDirection(startSquare, 1, arrayOfSquaresToEdge)
  let upDirection = getNumberOfSquaresInDirection(startSquare, 0, arrayOfSquaresToEdge)
  let leftDirection = getNumberOfSquaresInDirection(startSquare, 2, arrayOfSquaresToEdge)
  let rightDirection = getNumberOfSquaresInDirection(startSquare, 3, arrayOfSquaresToEdge)
  // console.log(
  //   "LEFT",leftDirection,
  //   "RIGHT",rightDirection,
  //   "UP",upDirection,
  //   "DOWN",downDirection,
  // )
  for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
    const numberOfSquaresInDirection = getNumberOfSquaresInDirection(startSquare, directionIndex, arrayOfSquaresToEdge)
    for (let n = 0; n < 1; n++) {
      if(leftDirection <= 1 && (directionIndex == 4 || directionIndex == 7))
      {
        console.log("xdd1")
        break
      }
      if(upDirection < 1 && (directionIndex == 6 || directionIndex == 4))
      {
        console.log("xdd4")
        break
      }
      if(downDirection < 1 && (directionIndex == 5 || directionIndex == 7))
      {
        console.log("xdd5")
        break
      }
      if(rightDirection <= 1 && (directionIndex == 6 || directionIndex == 5))
      {
        console.log("xdd6")
        break
      }
      if(rightDirection <= 1 && upDirection < 1 && (directionIndex == 4 || directionIndex == 5 || directionIndex == 6))
      {
        console.log("xdd7")
        break
      }
      const targetSquare = startSquare + directionOffsets[directionIndex] * (n + 1)
      let adjacentSquare = targetSquare
      if(directionIndex == 4 || directionIndex == 7)
      {
        adjacentSquare -= 1
      }
      else if(directionIndex == 5 || directionIndex == 6)
      {
        adjacentSquare += 1
      }
      else
      {
        break
      }
     
      const figure = getFigureByIndex(adjacentSquare,board)
      if (selectedFigure.color == figure.color) {
        break
      }
      moves.push({ startSquare: startSquare, targetSquare: adjacentSquare}) 
      if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
        break
      }
    }
    // for (let n = 0; n < 1; n++) {
    //   if(numberOfSquaresInDirection <= 1)
    //   {
    //     break
    //   }
    //   const targetSquare = startSquare + directionOffsets[directionIndex] * (n + 1)
    //   let adjacentSquare = targetSquare
    //   if(directionIndex == 4 || directionIndex == 6)
    //   {
    //     adjacentSquare += 8
    //   }
    //   else
    //   {
    //     adjacentSquare -= 8
    //   }
    //   const figure = getFigureByIndex(adjacentSquare,board)
    //   if (selectedFigure.color == figure.color) {
    //     break
    //   }
    //   moves.push({ startSquare: startSquare, targetSquare: adjacentSquare}) 
    //   if (selectedFigure.color != figure.color && figure.color != FigureColorType.ClearBoard) {
    //     break
    //   }
    // }
  }
  return moves
}