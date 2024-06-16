<template>
  <div class="main-container">
    <!-- <div class="player-row-component player-row-top">
      <img class="player-row-avatar" src="/public/favicon.ico" />
      <div class="player-row-info">
        <div class="player-row-name">Player 1</div>
        <div class="player-row-ranking">Ranking: 0</div>
        <div class="player-row-country-flag">POLAND</div>
      </div>
    </div> -->
    <div class="board-wrapper">
      <div class="board-container-row-info">
        <div class="board-info-rank">8</div>
        <div class="board-info-rank">7</div>
        <div class="board-info-rank">6</div>
        <div class="board-info-rank">5</div>
        <div class="board-info-rank">4</div>
        <div class="board-info-rank">3</div>
        <div class="board-info-rank">2</div>
        <div class="board-info-rank">1</div>
      </div>
      <div class="board-container-row-file">
        <div class="board-info-file">A</div>
        <div class="board-info-file">B</div>
        <div class="board-info-file">C</div>
        <div class="board-info-file">D</div>
        <div class="board-info-file">E</div>
        <div class="board-info-file">F</div>
        <div class="board-info-file">G</div>
        <div class="board-info-file">H</div>
      </div>
      <div class="board-container">
        <div class="board-line" v-for="(line, i) in board.squares" :key="i">
          <ChessBoardSquare
            v-for="(square, j) in line"
            :key="j"
            :piece="square"
            :row-index="i"
            :col-index="j"
            :style="arrayOfStyles[getSquareIndexByCords(i, j)]"
            @handleDragStart="handleDragStart"
            @handleDragEnd="handleDragEnd"
            @onClick="onClick"
            @handleDragEnter="handleDragEnter"
          />
        </div>
      </div>
    </div>
    <div class="player-row-component player-row-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { FigureColorType, FigureType, MoveType } from '@/enums/figure'
import type { Figure, NumSquaresToEdge } from '@/types/chessTypes'
import {
  getFigureByIndex,
  setMoveData,
  deleteFigureFromBoard,
  loadPositionFromFen,
  setSquareColor,
  getSquareIndexByCords,
  removeSquareColor,
  getIndexesByFigureIndex,
  getFigureMoveByIndex,
  addFigureToBoard,
  getColorAndRank,
  clearBoardFromColors
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
    type: Object,
    default: FigureColorType.White
  },
  fen: {
    type: String,
    default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  }
})

const arrayOfSquaresToEdge: NumSquaresToEdge[] = setMoveData()
const arrayOfStyles = ref([])
for (var i = 0; i < 64; i++) {
  arrayOfStyles.value.push('')
}

let currentPlayer = FigureColorType.White
let selectedSquare = 64

var board = loadPositionFromFen(props.fen)

const dragStartSquare = ref(0)
const dragEndSquare = ref(0)

generateMoves()

function handleDragStart(event: MouseEvent, figure: number) {
  console.log('dragStart', figure)
  dragStartSquare.value = figure
  dragEndSquare.value = figure
}

function handleDragEnter(event: MouseEvent, figure: Figure, i: number, j: number) {
  event.preventDefault()
  dragEndSquare.value = getSquareIndexByCords(i, j)
}

function handleDragEnd(event: MouseEvent, figure: Figure) {
  if (!figure.moves) return 0
  // if (props.playerColor != currentPlayer) return 0
  // if (props.playerColor != figure.color) return 0
  if (dragStartSquare.value == dragEndSquare.value) return 0
  let targetMoves: number[] = figure.moves.map((move) => move.targetSquare)
  if (!targetMoves.includes(dragEndSquare.value)) return 0 // todo":play sound or alert the player that he can't move there
  let startFigure = getFigureByIndex(dragStartSquare.value, board)
  console.log(dragEndSquare.value)
  switch (getFigureMoveByIndex(figure, dragEndSquare.value)) {
    case MoveType.Castling: {
      const { color, rank } = getColorAndRank(dragEndSquare.value)
      const offset = dragEndSquare.value < 7 ? 1 : -2
      const file = dragEndSquare.value < 7 ? 'f' : 'd'

      deleteFigureFromBoard(board, getFigureByIndex(dragEndSquare.value + offset, board))
      let rook: Figure = { type: FigureType.Rook, color, file, rank, moves: [] }
      addFigureToBoard(board, rook)
      console.log('castling', dragEndSquare.value)
      break
    }
    case MoveType.Move:
      console.log('move')
      break
    case MoveType.Promotion:
      console.log('promotion')
      break
  }

  deleteFigureFromBoard(board, startFigure)
  const { x: x, y: y } = getIndexesByFigureIndex(dragEndSquare.value)
  figure.rank = 8 - x
  figure.file = String.fromCharCode(97 + y)
  board.squares[x][y] = figure
  if (currentPlayer === FigureColorType.Black) {
    currentPlayer = FigureColorType.White
  } else {
    currentPlayer = FigureColorType.Black
  }
  clearBoardFromColors(arrayOfStyles)
  generateMoves()
}

function onClick(figure: Figure, index: number) {
  //console.log()
  if (!figure.moves) {
    return 0
  }
  clearBoardFromColors(arrayOfStyles)
  if (selectedSquare == index) {
    selectedSquare = 65
    return 0
  }
  selectedSquare = index
  console.log(figure)
  figure.moves.forEach((move) => {
    let color = ''
    if (move.moveType === MoveType.Move) {
      color = 'yellow'
    }
    if (move.moveType === MoveType.Attack) {
      color = 'red'
    }
    if (move.moveType === MoveType.Castling) {
      color = 'light-blue'
    }
    setSquareColor(move.targetSquare, color, arrayOfStyles)
  })
  setSquareColor(index, 'purple', arrayOfStyles)
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
    }
    if (piece.type == FigureType.King) {
      piece.moves = generateKingMoves(startSquare, board, arrayOfSquaresToEdge)
    }
  }
}
</script>
