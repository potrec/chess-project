import { FigureColorType, FigureType, MoveType } from "@/enums/figure"
import type { Figure, Move, NumSquaresToEdge, SquareAttack } from "@/types/chessTypes"
import { getFigureByIndex, getNumberOfSquaresInDirection, getSquareIndexByCords, getIndexesByFigureIndex, getFigureIndexByFigure } from "./chessHelpers"
import { directionOffsets } from "@/constants/chess/piece"

export function generateSlidingMoves(startSquare: number, board: Figure[][], arrayOfSquaresToEdge: NumSquaresToEdge[]): Move[] 
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const startDirIndex = selectedFigure.type == FigureType.Bishop ? 4 : 0
  const endDirIndex = selectedFigure.type == FigureType.Rook ? 4 : 8
  const moves: Move[] = []
  for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
    let pinned = 0
    const numberOfSquaresInDirection = getNumberOfSquaresInDirection(startSquare, directionIndex, arrayOfSquaresToEdge)

    for (let n = 0; n < numberOfSquaresInDirection; n++) {
      const targetSquare = startSquare + directionOffsets[directionIndex] * (n + 1)
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        if(pinned == 0) 
        { 
          pinned += 1
          continue
        }
        break
      }
      if( figure.color == FigureColorType.ClearBoard)
      {
        moves.push({ startSquare, targetSquare, moveType: pinned == 0 ? MoveType.Move : MoveType.Pinned})
      }
      else{
        if(pinned == 0) 
        { 
          moves.push({ startSquare, targetSquare, moveType: MoveType.Attack})
          pinned += 1
          continue
        }
        moves.push({ startSquare, targetSquare, moveType: MoveType.Pinned})
        break
      }
    }
  }

  return moves
}

export function generateStraightMoves(startSquare: number, board: Figure[][]): Move[]
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

    if(!(x-canMoveOnX[i] < 0 || y-canMoveOnY[i] < 0 || !board[x-canMoveOnX[i]] || !board[x-canMoveOnX[i]][y-canMoveOnY[i]]))
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
      if((canMoveOnX[i] == 1 || canMoveOnX[i] == -1) && canMoveOnY[i] == 0 && getFigureByIndex(getSquareIndexByCords(x-canMoveOnX[i], y-canMoveOnY[i]),board).type == 2)
      {
        continue
      }
      if((canMoveOnX[i] == 1 || canMoveOnX[i] == -1) && (canMoveOnY[i] == 1 || canMoveOnY[i] == -1) && checkIfEnemyOnTile(targetSquare, board, figure) == false)
      {
        continue
      }
      if( figure.color == FigureColorType.ClearBoard)
      {
        moves.push({ startSquare, targetSquare, moveType: MoveType.Move })
      }
      else{
        moves.push({ startSquare, targetSquare, moveType: MoveType.Attack }) 
        break
      }
    }
  }

  return moves
}

export function generateKnightMoves(startSquare: number, board: Figure[][]): Move[]
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const moves: Move[] = []
  const {x: x, y: y} = getIndexesByFigureIndex(startSquare)
  const canMoveOnX = [ 2, 1, -1, -2, -2, -1, 1, 2 ];
  const canMoveOnY = [ 1, 2, 2, 1, -1, -2, -2, -1 ];

  for (let i = 0; i < 8; i++)
  {
    if(!(x-canMoveOnX[i] < 0 || y-canMoveOnY[i] < 0 || !board[x-canMoveOnX[i]] || !board[x-canMoveOnX[i]][y-canMoveOnY[i]]))
    {
      const targetSquare = getSquareIndexByCords(x-canMoveOnX[i], y-canMoveOnY[i])
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        continue
      }
      if( figure.color == FigureColorType.ClearBoard)
      {
        moves.push({ startSquare, targetSquare, moveType: MoveType.Move })
      }
      else{
        moves.push({ startSquare, targetSquare, moveType: MoveType.Attack }) 
        break
      }
    }
  }

  return moves
}

export function generateKingMoves(startSquare: number, board: Figure[][]): Move[]
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  const moves: Move[] = []
  const {x: x, y: y} = getIndexesByFigureIndex(startSquare)
  const canMoveOnX = [-1, 1, -1, -1, 0, 0, 1, 1];
  const canMoveOnY = [0, 0, 1, -1, 1, -1, 1, -1];

  for (let i = 0; i < 8; i++)
  {
    if(!(x-canMoveOnX[i] < 0 || y-canMoveOnY[i] < 0 || !board[x-canMoveOnX[i]] || !board[x-canMoveOnX[i]][y-canMoveOnY[i]]))
    {
      const targetSquare = getSquareIndexByCords(x-canMoveOnX[i], y-canMoveOnY[i])
      const figure = getFigureByIndex(targetSquare,board)
      if (selectedFigure.color == figure.color) {
        continue
      }
      if( figure.color == FigureColorType.ClearBoard)
      {
        moves.push({ startSquare, targetSquare, moveType: MoveType.Move })
      }
      else{
        moves.push({ startSquare, targetSquare, moveType: MoveType.Attack }) 
        break
      }
    }
  }
  if((startSquare == 4 && selectedFigure.color == FigureColorType.White) || (startSquare == 60 && selectedFigure.color == FigureColorType.Black))
  {
    for(let i = 1; i <= 3; i++)
    {
      const target = getFigureByIndex(startSquare+i,board)
      if(target.type == FigureType.Rook && i == 3)
      {
        moves.push({ startSquare,targetSquare: getFigureIndexByFigure(target)-1, moveType: MoveType.Castling})
        continue
      }
      if(target.type != FigureType.ClearBoard)
      {
        break
      }
    }
    for(let i = 1; i <= 4; i++)
    {
      const target = getFigureByIndex(startSquare-i,board)
      if(target.type == FigureType.Rook && i == 4)
      {
        moves.push({ startSquare,targetSquare: getFigureIndexByFigure(target)+2, moveType: MoveType.Castling})
        continue
      }
      if(target.type != FigureType.ClearBoard)
      {
        break
      }
    }
  }

  return moves
}

export function deleteUnsafeKingMoves(startSquare: number,board: Figure[][], attackedSquaresIndex: SquareAttack[])
{
  const selectedFigure = getFigureByIndex(startSquare,board)
  attackedSquaresIndex = attackedSquaresIndex.filter((element) => element.attackingFigureColor != selectedFigure.color)
  const squaresToDelete = selectedFigure.moves.map((move) => move.targetSquare).filter((move) => {
    return attackedSquaresIndex.map((element) => element.square).includes(move)
  
  })
  selectedFigure.moves = selectedFigure.moves.filter((move) => !squaresToDelete.includes(move.targetSquare))
}

export function checkIfKingSafe(move: Move, board: Figure[][]): Boolean 
{

}

export function upgradeFigure(figure: Figure, board: Figure[][])
{

}

export function checkIfEnemyOnTile(squareIndex: number, board: Figure[][], figure: Figure): boolean
{
  const square = getFigureByIndex(squareIndex, board);
  if ( square.type != FigureType.ClearBoard && square.color != FigureColorType.ClearBoard && square.color == figure.color) return true
  
  return false
}

export function generateMoves(board: Figure[][], attackedSquaresIndex: SquareAttack[], arrayOfSquaresToEdge: NumSquaresToEdge[]): SquareAttack[] {
  attackedSquaresIndex = []
  for (let startSquare = 0; startSquare < 64; startSquare++) {
    const piece = getFigureByIndex(startSquare, board)
    if (piece == null) {
      continue
    }
    if (
      piece.type === FigureType.Bishop ||
      piece.type === FigureType.Queen ||
      piece.type === FigureType.Rook
    ) {
      piece.moves = generateSlidingMoves(startSquare, board, arrayOfSquaresToEdge)
    }
    if (piece.type === FigureType.Knight) {
      piece.moves = generateKnightMoves(startSquare, board)
    }
    if (piece.type === FigureType.Pawn) {
      piece.moves = generateStraightMoves(startSquare, board)
    }
    if (piece.type === FigureType.King) {
      piece.moves = generateKingMoves(startSquare, board)
    }
    if (piece.moves == null) {
      continue
    }

    piece.moves.map((move) => {
      if (move.moveType !== MoveType.Pinned) {
        attackedSquaresIndex.push({ square: move.targetSquare, attackingFigureColor: piece.color })
      }
    })
  }
  for (let i = 0; i < 64; i++) {
    const piece = getFigureByIndex(i, board)

    if (piece == null) {
      continue
    }
    if (piece.type === FigureType.King) {
      deleteUnsafeKingMoves(i, board, attackedSquaresIndex)
    }
  }
  return attackedSquaresIndex
}