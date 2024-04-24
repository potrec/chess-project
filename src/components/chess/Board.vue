<template>
  <div class="main-container">
    <div class="board-container">
      <div class="board-line" v-for="(line, i) in board.squares" :key="i">
        <div
          class="board-square"
          v-for="(square, j) in line"
          :key="j"
          :index="64 - (8 - j) - i * 8"
          :style="{ backgroundColor: isSelected(64 - (8 - j) - i * 8) ? '#FFFF00' : '' }"
          ref="itemRefs"
          draggable="false"
          v-on:dragenter="handleDragEnter($event, square, i, j)"
          v-on:dragend="handleDragEnd($event, square)"
          @click="onClick(square, 64 - (8 - j) - i * 8)"
        >
          <img
            class="figure"
            v-if="square.type != FigureType.ClearBoard"
            :src="getFigures(square)"
            draggable="true"
            v-on:dragstart="handleDragStart($event, square)"
          />
          {{ 64 - (8 - j) - i * 8 }}
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
  setSquareColorimport,
  setSquareColor,
  getFigures
} from '../../scripts/chess/chessHelpers'
import { generateSlidingMoves } from '../../scripts/chess/chessMoves'
const itemRefs = ref<any>([])
const arrayOfSquaresToEdge: NumSquaresToEdge[] = setMoveData()

const startFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const otherFEN: string = 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23'

let playerColor = FigureColorType.White
let currentPlayer = FigureColorType.White
let opponentColor = FigureColorType.Black
let selectedSquare = null

var board = loadPositionFromFen(startFEN)

var dragStartSquare: Figure
var dragEndSquare: TempFigure

function handleDragStart(event: MouseEvent, figure: Figure) {
  dragStartSquare = figure
}

function handleDragEnd(event: MouseEvent, figure: Figure) {
  board.squares[dragEndSquare.i][dragEndSquare.j] = figure
  calculateMoves()
  if (
    dragStartSquare.rank != dragEndSquare.i ||
    dragStartSquare.file.charCodeAt(0) - 97 != dragEndSquare.j
  ) {
    deleteFigureImage(board, dragStartSquare)
    figure.rank = dragEndSquare.i
    figure.file = String.fromCharCode(97 + dragEndSquare.j)
  }
  //todo: handle the correct moves of the figures
}

function handleDragEnter(event: MouseEvent, figure: Figure, i: number, j: number) {
  event.preventDefault()
  dragEndSquare = { i: i, j: j }
}

function onClick(figure: Figure, index: number) {
  console.log(figure, index)
  if (!figure.moves) {
    return 0
  }
  // todo: clear all squares
  // board.squares.forEach((square) => {
  //   setSquareColor(square., '#FFFFFF')
  // })
  figure.moves.forEach((move) => {
    setSquareColor(move.targetSquare, '#FFFF00', itemRefs)
  })
}

function calculateMoves(): boolean {
  let indexOfTheFigure =
    64 - (8 - (dragStartSquare.file.charCodeAt(0) - 97)) - dragStartSquare.rank * 8
  // console.log(indexOfTheFigure)
  let indexOfTheEndSquare = 64 - (8 - dragEndSquare.j) - dragEndSquare.i * 8
  // console.log(indexOfTheEndSquare)
  if (indexOfTheEndSquare - indexOfTheFigure == 8) {
    console.log('move up')
  }
  return true
}

function generateMoves() {
  for (var startSquare = 0; startSquare < 64; startSquare++) {
    var piece = getFigureByIndex(startSquare, board)
    console.log(piece, startSquare)
    if (piece == null) {
      continue
    }
    if (piece.type == FigureType.Bishop) {
      piece.moves = generateSlidingMoves(
        startSquare,
        playerColor,
        opponentColor,
        board,
        arrayOfSquaresToEdge
      )
      console.log(piece.moves)
    }
    // console.log(piece)
  }
  // return moves
}

generateMoves()

function isSelected(squareIndex) {
  // if(squareIndex == )
  // Your logic to determine if the square is a move square
  // This is a placeholder. You need to implement the actual logic.
  return false // or false based on your condition
}
</script>
