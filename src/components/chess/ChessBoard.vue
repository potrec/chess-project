<template>
  <div class="main-container">
    <div class="board-container">
      <div class="board-line" v-for="(line, i) in board.squares" :key="i">
        <ChessBoardSquare
          v-for="(square, j) in line"
          :key="j"
          :piece="square"
          :row-index="i"
          :col-index="j"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
          @click="onClick"
          @dragenter="handleDragEnter"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FigureColorType, FigureType } from '@/enums/figure'
import type { Figure, TempFigure, NumSquaresToEdge, Move } from '@/types/chessTypes'
import {
  getFigureByIndex,
  setMoveData,
  deleteFigureImage,
  loadPositionFromFen,
  setSquareColor,
  getFigures,
  getSquareIndexByCords,
  removeSquareColor,
  getIndexesByFigureIndex
} from '@/scripts/chess/chessHelpers'
import {
  generateSlidingMoves,
  generateKnightMoves,
  generateStraightMoves,
  generateKingMoves
} from '@/scripts/chess/chessMoves'
import ChessBoardSquare from '@/components/chess/ChessBoardSquare.vue'
const props = defineProps({
  playerColor: {
    type: FigureColorType,
    default: FigureColorType.White
  },
  fen: {
    type: String,
    default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  }
})
const itemRefs = ref<any>([])
const arrayOfSquaresToEdge: NumSquaresToEdge[] = setMoveData()

let currentPlayer = FigureColorType.White
let selectedSquare = 64

var board = loadPositionFromFen(props.fen)

const dragStartSquare = ref(0)
const dragEndSquare = ref(0)

generateMoves()

function handleDragStart(event: MouseEvent, figure: number) {
  console.log('dragStart')
  dragStartSquare.value = figure
  dragEndSquare.value = figure
}

function handleDragEnter(event: MouseEvent, figure: Figure, i: number, j: number) {
  console.log('dragEnter')
  event.preventDefault()
  dragEndSquare.value = getSquareIndexByCords(i, j)
}

function handleDragEnd(event: MouseEvent, figure: Figure) {
  console.log('dragEnd')
  if (!figure.moves) return 0
  if (props.playerColor != currentPlayer) return 0
  if (props.playerColor != figure.color) return 0
  if (dragStartSquare.value == dragEndSquare.value) return 0
  let targetMoves: number[] = figure.moves.map((move) => move.targetSquare)
  if (!targetMoves.includes(dragEndSquare.value)) return 0 // todo":play sound or alert the player that he can't move there
  let startFigure = getFigureByIndex(dragStartSquare.value, board)
  deleteFigureImage(board, startFigure)
  const { x: x, y: y } = getIndexesByFigureIndex(dragEndSquare.value)
  figure.rank = 8 - x
  figure.file = String.fromCharCode(97 + y)
  board.squares[x][y] = figure
  if (currentPlayer === FigureColorType.Black) {
    currentPlayer = FigureColorType.White
  } else {
    currentPlayer = FigureColorType.Black
  }
  generateMoves()
}

function onClick(figure: Figure, index: number) {
  console.log('onClick')
  if (!figure.moves) {
    return 0
  }
  for (let i = 0; i < 64; i++) {
    removeSquareColor(i, ['red', 'yellow', 'purple'], itemRefs)
  }
  if (selectedSquare == index) {
    selectedSquare = 65
    return 0
  }
  selectedSquare = index
  figure.moves.forEach((move) => {
    let square = getFigureByIndex(move.targetSquare, board)
    let color = square.color != FigureColorType.ClearBoard ? 'red' : 'yellow'
    setSquareColor(move.targetSquare, color, itemRefs)
  })
  setSquareColor(index, 'purple', itemRefs)
}

function generateMoves(): void {
  for (var startSquare = 0; startSquare < 64; startSquare++) {
    var piece = getFigureByIndex(startSquare, board)
    if (piece == null) {
      continue
    }
    if (
      piece.type == FigureType.Bishop ||
      piece.type == FigureType.Queen ||
      piece.type == FigureType.Rook
    ) {
      piece.moves = generateSlidingMoves(startSquare, board, arrayOfSquaresToEdge)
    }
    if (piece.type == FigureType.Knight) {
      piece.moves = generateKnightMoves(startSquare, board, arrayOfSquaresToEdge)
    }
    if (piece.type == FigureType.Pawn) {
      piece.moves = generateStraightMoves(startSquare, board, arrayOfSquaresToEdge)
      // console.log(piece.moves)
    }
    if (piece.type == FigureType.King) {
      piece.moves = generateKingMoves(startSquare, board)
    }
  }
}
</script>
