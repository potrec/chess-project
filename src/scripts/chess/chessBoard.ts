import { FigureColorType, MoveType, FigureType } from '@/enums/figure'
import { isUpperCase } from '@/helpers/isUpperCase'
import type { Figure, NumSquaresToEdge, SquareAttack } from '@/types/chessTypes'
import {
  getSquareIndexByCords,
  savePositionToFen,
  getFigureIndexByFigure,
  clearBoardFromColors,
  setSquareColor,
  getFigureMoveByIndex,
  getColorAndRank,
  deleteFigureFromBoard,
  getFigureByIndex,
  addFigureToBoard,
  getIndexesByFigureIndex,
  getFigureTypeByString
} from './chessHelpers'
import { generateMoves } from './chessMoves'
import { useChessBoardStore } from '@/stores/chessBoard'

export function handleFigureDragStart(draggedFigure: number) {
  const chessBoardStore = useChessBoardStore()
  chessBoardStore.dragStartSquare = draggedFigure
  chessBoardStore.dragEndSquare = draggedFigure
}

export function handleDragEnter(event: MouseEvent, i: number, j: number) {
  const chessBoardStore = useChessBoardStore()
  event.preventDefault()
  chessBoardStore.dragEndSquare = getSquareIndexByCords(i, j)
}

export function resetBoard() {
  const chessBoardStore = useChessBoardStore()
  chessBoardStore.chessBoard = loadPositionFromFen(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    chessBoardStore.chessBoard
  )
  chessBoardStore.attackedSquaresIndex = generateMoves(
    chessBoardStore.chessBoard,
    chessBoardStore.attackedSquaresIndex,
    chessBoardStore.arrayOfSquaresToEdge
  )

  console.log('reset', chessBoardStore.chessBoard)
}

export function getBoardFEN() {
  const chessBoardStore = useChessBoardStore()
  navigator.clipboard.writeText(savePositionToFen(chessBoardStore.chessBoard))
}

export function pasteBoardFEN() {
  const text = navigator.clipboard.readText()
  const chessBoardStore = useChessBoardStore()

  text.then((text) => {
    chessBoardStore.chessBoard = loadPositionFromFen(text, chessBoardStore.chessBoard)
  })
}

function toggleCurrentPlayer(currentPlayer: FigureColorType) {
  return currentPlayer === FigureColorType.White ? FigureColorType.Black : FigureColorType.White
}

function executeMovement() {
  //updateFigurePositionOnBoard(currentPlayer, index)
}

export function selectSquare(index: number) {
  console.log('selectSquare', index)
}

export function showFigureMoves(index: number, arrayOfStyles: string[]) {
  const chessBoardStore = useChessBoardStore()
  console.log('test', chessBoardStore.chessBoard, 'index', index)
  const figure = getFigureByIndex(index, chessBoardStore.chessBoard)
  console.log('figure', figure)
  if (!figure.moves) {
    return 0
  }
  console.log('onClick from:', getFigureIndexByFigure(figure), 'to:', index)
  arrayOfStyles = clearBoardFromColors(arrayOfStyles)
  console.log('selected square', chessBoardStore.selectedSquare)
  if (chessBoardStore.selectedSquare === index) {
    chessBoardStore.selectedSquare = 65
    return 0
  }
  chessBoardStore.selectedSquare = index
  const arrayOfColors = ['yellow', 'red', 'light-blue', 'light-blue', 'gray']

  figure.moves.forEach((move) => {
    const color = arrayOfColors[move.moveType]
    if (move.moveType == MoveType.Pinned) {
      console.log('pinned', move, color)
    }
    setSquareColor(move.targetSquare, color, arrayOfStyles)
  })

  setSquareColor(index, 'purple', arrayOfStyles)
}

export function toggleAllAttackedSquares() {
  const chessBoardStore = useChessBoardStore()
  chessBoardStore.toggleAttackSquares = !chessBoardStore.toggleAttackSquares
  handleAttackedSquares()
}

export function handleAttackedSquares() {
  const chessBoardStore = useChessBoardStore()
  chessBoardStore.arrayOfStyles = clearBoardFromColors(chessBoardStore.arrayOfStyles)
  if (chessBoardStore.toggleAttackSquares === true) {
    chessBoardStore.attackedSquaresIndex
      .filter((square) => square.attackingFigureColor === chessBoardStore.attackSquaresColor)
      .forEach((square) => {
        setSquareColor(square.square, 'red', chessBoardStore.arrayOfStyles)
      })
  }
}

export function handleFigureDragEnd() {
  const chessBoardStore = useChessBoardStore()
  const draggedFigure = getFigureByIndex(
    chessBoardStore.dragStartSquare,
    chessBoardStore.chessBoard
  )
  if (!isValidMove(draggedFigure, chessBoardStore.dragStartSquare, chessBoardStore.dragEndSquare))
    return

  handleMove(draggedFigure, chessBoardStore.dragEndSquare)
}

function handleMove(figure: Figure, location: number) {
  const chessBoardStore = useChessBoardStore()
  switch (getFigureMoveByIndex(figure, location)) {
    case MoveType.Castling: {
      handleCastling()
      break
    }
    case MoveType.Move:
      console.log('move')
      break
    case MoveType.Promotion:
      console.log('promotion')
      break
  }

  updateFigurePositionOnBoard(figure, chessBoardStore.dragEndSquare, chessBoardStore.chessBoard)
  chessBoardStore.currentPlayer = toggleCurrentPlayer(chessBoardStore.currentPlayer)
  chessBoardStore.arrayOfStyles = clearBoardFromColors(chessBoardStore.arrayOfStyles)
  chessBoardStore.attackedSquaresIndex = generateMoves(
    chessBoardStore.chessBoard,
    chessBoardStore.attackedSquaresIndex,
    chessBoardStore.arrayOfSquaresToEdge
  )
}

function isValidMove(figure: Figure, startSquare: number, endSquare: number): boolean {
  const chessBoardStore = useChessBoardStore()
  const targetMoves = figure.moves
    .filter((move) => move.moveType !== MoveType.Pinned)
    .map((move) => move.targetSquare)
  return (
    figure.moves &&
    chessBoardStore.currentPlayer === figure.color &&
    startSquare !== endSquare &&
    targetMoves.includes(chessBoardStore.dragEndSquare)
  )
}

function handleCastling() {
  const chessBoardStore = useChessBoardStore()
  const board = chessBoardStore.chessBoard
  const dragEndSquare = chessBoardStore.dragEndSquare
  const { color, rank } = getColorAndRank(dragEndSquare)
  const offset = dragEndSquare < 7 ? 1 : -2
  const file = dragEndSquare < 7 ? 'f' : 'd'
  const rook: Figure = { type: FigureType.Rook, color, file, rank, moves: [] }

  deleteFigureFromBoard(board, getFigureByIndex(dragEndSquare + offset, board))

  addFigureToBoard(board, rook)
  console.log('castling', dragEndSquare)
}

function updateFigurePositionOnBoard(figure: Figure, index: number, board: Figure[][]) {
  deleteFigureFromBoard(board, figure)

  const { x: x, y: y } = getIndexesByFigureIndex(index)
  figure.rank = 8 - x
  figure.file = String.fromCharCode(97 + y)

  board[x][y] = figure
}

export function loadPositionFromFen(fen: string, board: Figure[][]) {
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
          board[index][i] = {
            type: FigureType.ClearBoard,
            color: FigureColorType.ClearBoard,
            file: String.fromCharCode(97 + file),
            rank: rank,
            moves: []
          }
        }
        file += Number(symbol)
      } else {
        const pieceColor = isUpperCase(symbol) ? FigureColorType.White : FigureColorType.Black
        const pieceType = getFigureTypeByString(symbol.toLowerCase())
        board[index][file] = {
          type: pieceType,
          color: pieceColor,
          file: String.fromCharCode(97 + file),
          rank: rank,
          moves: []
        }
        file++
      }
    }
  }
  console.log('loading board:', board, typeof board)
  return board
}
