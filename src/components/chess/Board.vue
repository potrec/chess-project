<template>
  <div class="main-container">
    <div class="board-container">
      <div class="board-line" v-for="(line, i) in board.squares" :key="i">
        <div
          class="board-square"
          v-for="(square, j) in line"
          :key="j"
          :index="getSquareIndexByCords(i, j)"
          :style="{ backgroundColor: isSelected(getSquareIndexByCords(i, j)) ? '#FFFF00' : '' }"
          ref="itemRefs"
          draggable="false"
          v-on:dragenter="handleDragEnter($event, square, i, j)"
          v-on:dragend="handleDragEnd($event, square)"
          @click="onClick(square, getSquareIndexByCords(i, j))"
        >
          <img
            class="figure"
            v-if="square.type != FigureType.ClearBoard"
            :src="getFigures(square)"
            draggable="true"
            v-on:dragstart="handleDragStart($event, square)"
          />
          {{ getSquareIndexByCords(i, j) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FigureColorType, FigureType } from '../../enums/figure'
import type { Figure, TempFigure, NumSquaresToEdge } from '../../types/chessTypes'
import {
  getFigureByIndex,
  setMoveData,
  deleteFigureImage,
  loadPositionFromFen,
  setSquareColor,
  getFigures,
  getSquareIndexByCords,
  removeSquareColor
} from '../../scripts/chess/chessHelpers'
import { generateSlidingMoves, generateKnightMoves } from '../../scripts/chess/chessMoves'
const itemRefs = ref<any>([])
const arrayOfSquaresToEdge: NumSquaresToEdge[] = setMoveData()

const startFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const otherFEN: string = 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23'
const knightFEN: string = '8/8/8/4n3/8/8/8/8'

let playerColor = FigureColorType.White
let currentPlayer = FigureColorType.White
let opponentColor = FigureColorType.Black
let selectedSquare = null

var board = loadPositionFromFen(otherFEN)

var dragStartSquare: Figure
var dragEndSquare: TempFigure

generateMoves()

function handleDragStart(event: MouseEvent, figure: Figure) {
  dragStartSquare = figure
}

function handleDragEnd(event: MouseEvent, figure: Figure) {
  board.squares[dragEndSquare.i][dragEndSquare.j] = figure
  if (
    dragStartSquare.rank != dragEndSquare.i ||
    dragStartSquare.file.charCodeAt(0) - 97 != dragEndSquare.j
  ) {
    deleteFigureImage(board, dragStartSquare)
    figure.rank = 8 - dragEndSquare.i
    figure.file = String.fromCharCode(97 + dragEndSquare.j)
  }
  generateMoves()
  //todo: handle the correct moves of the figures
}

function handleDragEnter(event: MouseEvent, figure: Figure, i: number, j: number) {
  event.preventDefault()
  dragEndSquare = { i: i, j: j }
}

function onClick(figure: Figure, index: number) {
  if (!figure.moves) {
    return 0
  }
  for (let i = 0; i < 64; i++) {
    removeSquareColor(i, ['red', 'yellow'], itemRefs)
  }
  figure.moves.forEach((move) => {
    let square = getFigureByIndex(move.targetSquare, board)
    let color = square.color != FigureColorType.ClearBoard ? 'red' : 'yellow'
    setSquareColor(move.targetSquare, color, itemRefs)
  })
}

function generateMoves() {
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
  }
}

function isSelected(squareIndex) {
  // if(squareIndex == )
  // Your logic to determine if the square is a move square
  // This is a placeholder. You need to implement the actual logic.
  return false // or false based on your condition
}
</script>
