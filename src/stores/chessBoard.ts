import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Figure, NumSquaresToEdge, SquareAttack } from '@/types/chessTypes'
import { loadPositionFromFen } from '@/scripts/chess/chessBoard'
import { setMoveData } from '@/scripts/chess/chessHelpers'
import { FigureColorType, FigureType } from '@/enums/figure'
import { generateMoves } from '@/scripts/chess/chessMoves'

export const useChessBoardStore = defineStore('chessBoard', () => {
  const chessBoard = ref<Figure[][]>(
    Array.from({ length: 8 }, () =>
      Array.from(
        { length: 8 },
        (): Figure => ({
          type: FigureType.ClearBoard,
          color: FigureColorType.ClearBoard,
          file: '',
          rank: 0,
          moves: []
        })
      )
    )
  )
  const attackedSquaresIndex = ref<SquareAttack[]>([])
  const arrayOfSquaresToEdge = ref<NumSquaresToEdge[]>(setMoveData())
  const arrayOfStyles = ref<string[]>(Array.from({ length: 64 }, () => ''))
  const dragStartSquare = ref(0)
  const dragEndSquare = ref(0)
  const toggleAttackSquares = ref(false)
  const attackSquaresColor = ref(FigureColorType.White)
  const selectedSquare = ref(65)
  const boardInfo = ref('No check found in the board')
  const currentPlayer = ref(FigureColorType.White)
  const isKingChecked = ref(false)
  const loadPositionFromFEN = (fen: string) => {
    chessBoard.value = loadPositionFromFen(fen, chessBoard.value)
  }

  const generateAttackedSquaresIndex = () => {
    attackedSquaresIndex.value = generateMoves(
      chessBoard.value,
      attackedSquaresIndex.value,
      arrayOfSquaresToEdge.value
    )
  }

  return {
    chessBoard,
    attackedSquaresIndex,
    arrayOfSquaresToEdge,
    arrayOfStyles,
    dragStartSquare,
    dragEndSquare,
    toggleAttackSquares,
    attackSquaresColor,
    selectedSquare,
    boardInfo,
    currentPlayer,
    isKingChecked,
    loadPositionFromFEN,
    generateAttackedSquaresIndex
  }
})
