<template>
  <div class="main-container">
    <!-- todo: Create separate component for this -->
    <div class="player-row-component player-row-top">
      <img class="player-row-avatar" src="/public/favicon.ico" />
      <div class="player-row-info">
        <div class="player-row-name">Player 1</div>
        <div class="player-row-ranking">Ranking: 0</div>
        <div class="player-row-country-flag">POLAND</div>
      </div>
    </div>
    <div class="board">
      <div class="board-container-score"></div>
      <div class="board-container">
        <ChessBoardRankInfo />
        <ChessBoardFileInfo />
        <div class="board-container-squares">
          <div class="board-line" v-for="(line, i) in board" :key="i">
            <ChessBoardSquare
              v-for="(square, j) in line"
              :key="j"
              :piece="square"
              :row-index="i"
              :col-index="j"
              :style="arrayOfStyles[getSquareIndexByCords(i, j)]"
              @handleDragStart="handleDragStart"
              @handleDragEnd="handleDragEnd"
              @showFigureMoves="showFigureMoves"
              @selectSquare="selectSquare"
              @handleDragEnter="handleDragEnter"
            />
          </div>
        </div>
      </div>
      <div class="board-container-info">
        <div class="board-time">
          <div class="board-time-title">Time</div>
          <div class="board-time-info">00:00:00</div>
        </div>
        <div class="board-players-info"></div>
        <div class="board-history"></div>
        <div class="board-info">{{ boardInfo }}</div>
      </div>
    </div>

    <div class="board-dev-tools">
      <button @click="toggleAllAttackedSquares">Toggle All AttackedSquares</button>
      <select v-model="attackSquaresColor">
        <option :value="FigureColorType.White">White</option>
        <option :value="FigureColorType.Black">Black</option>
      </select>
      <button @click="getBoardFEN">Copy board FEN</button>
      <button @click="pasteBoardFEN">Paste board FEN</button>
      <button @click="resetBoard">Reset board</button>
    </div>
    <div class="player-row-component player-row-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FigureColorType, FigureType, MoveType } from '@/enums/figure'
import type { Figure, NumSquaresToEdge, SquareAttack } from '@/types/chessTypes'
import {
  getFigureByIndex,
  setMoveData,
  deleteFigureFromBoard,
  loadPositionFromFen,
  setSquareColor,
  getSquareIndexByCords,
  getIndexesByFigureIndex,
  getFigureMoveByIndex,
  addFigureToBoard,
  getColorAndRank,
  clearBoardFromColors,
  savePositionToFen,
  getFigureIndexByFigure
} from '@/scripts/chess/chessHelpers'
import { generateMoves } from '@/scripts/chess/chessMoves'
import ChessBoardSquare from '@/components/chess/ChessBoardSquare.vue'
import ChessBoardRankInfo from '@/components/chess/ChessBoardRankInfo.vue'
import ChessBoardFileInfo from '@/components/chess/ChessBoardFileInfo.vue'
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
const arrayOfStyles = ref<string[]>([])

for (var i = 0; i < 64; i++) {
  arrayOfStyles.value.push('')
}

let attackedSquaresIndex = ref<SquareAttack[]>([])
let currentPlayer = FigureColorType.White
let selectedSquare = ref(65)
let boardInfo = ref('No check found in the board')
const board = ref<Figure[][]>(
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
board.value = loadPositionFromFen(props.fen, board.value)
attackedSquaresIndex.value = generateMoves(
  board.value,
  attackedSquaresIndex.value,
  arrayOfSquaresToEdge
)

const dragStartSquare = ref(0)
const dragEndSquare = ref(0)

function handleDragStart(event: MouseEvent, draggedFigure: number) {
  console.log('dragStart', draggedFigure)
  dragStartSquare.value = draggedFigure
  dragEndSquare.value = draggedFigure
}

function handleDragEnter(event: MouseEvent, figure: Figure, i: number, j: number) {
  event.preventDefault()
  dragEndSquare.value = getSquareIndexByCords(i, j)
}

function handleDragEnd(event: MouseEvent, draggedFigure: Figure) {
  if (!isValidMove(draggedFigure, dragStartSquare.value, dragEndSquare.value)) return

  handleMove(draggedFigure, dragEndSquare.value)
}

function handleMove(figure: Figure, location: number) {
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

  updateFigurePositionOnBoard(figure, dragEndSquare.value)
  toggleCurrentPlayer()
  clearBoardFromColors(arrayOfStyles.value)
  generateMoves(board.value, attackedSquaresIndex.value, arrayOfSquaresToEdge)
}

function isValidMove(figure: Figure, startSquare: number, endSquare: number): boolean {
  let targetMoves = figure.moves.map((move) => move.targetSquare)

  return (
    figure.moves &&
    currentPlayer === figure.color &&
    startSquare !== endSquare &&
    targetMoves.includes(dragEndSquare.value)
  )
}

function handleCastling() {
  const { color, rank } = getColorAndRank(dragEndSquare.value)
  const offset = dragEndSquare.value < 7 ? 1 : -2
  const file = dragEndSquare.value < 7 ? 'f' : 'd'

  deleteFigureFromBoard(board, getFigureByIndex(dragEndSquare.value + offset, board))

  let rook: Figure = { type: FigureType.Rook, color, file, rank, moves: [] }

  addFigureToBoard(board, rook)
  console.log('castling', dragEndSquare.value)
}

function updateFigurePositionOnBoard(figure: Figure, index: number) {
  deleteFigureFromBoard(board, figure)

  const { x: x, y: y } = getIndexesByFigureIndex(index)
  figure.rank = 8 - x
  figure.file = String.fromCharCode(97 + y)

  board.value[x][y] = figure
}

function toggleCurrentPlayer() {
  currentPlayer =
    currentPlayer === FigureColorType.White ? FigureColorType.Black : FigureColorType.White
}

function executeMovement() {
  //updateFigurePositionOnBoard(currentPlayer, index)
}

function selectSquare(index: number) {
  console.log('selectSquare', index)
}

function showFigureMoves(figure: Figure, index: number) {
  console.log('onClick from:', getFigureIndexByFigure(figure), 'to:', index)
  if (!figure.moves) {
    return 0
  }

  clearBoardFromColors(arrayOfStyles.value)

  if (selectedSquare.value === index) {
    selectedSquare.value = 65
    return 0
  }
  selectedSquare.value = index
  const arrayOfColors = ['yellow', 'red', 'light-blue', 'gray']

  figure.moves.forEach((move) => {
    let color = arrayOfColors[move.moveType]

    setSquareColor(move.targetSquare, color, arrayOfStyles.value)
  })

  setSquareColor(index, 'purple', arrayOfStyles.value)
}

const toggleAttackSquares = ref(false)
const attackSquaresColor = ref(FigureColorType.White)

function toggleAllAttackedSquares() {
  toggleAttackSquares.value = !toggleAttackSquares.value
  handleAttackedSquares()
}

function handleAttackedSquares() {
  clearBoardFromColors(arrayOfStyles.value)

  if (toggleAttackSquares.value === true) {
    attackedSquaresIndex.value
      .filter((square) => square.attackingFigureColor === attackSquaresColor.value)
      .forEach((square) => {
        setSquareColor(square.square, 'red', arrayOfStyles.value)
      })
  }
}

watch(attackSquaresColor, () => {
  handleAttackedSquares()
})

function getBoardFEN() {
  navigator.clipboard.writeText(savePositionToFen(board.value))
}

function pasteBoardFEN() {
  const text = navigator.clipboard.readText()

  text.then((text) => {
    board.value = loadPositionFromFen(text, board.value)
  })

  console.log(board)
}

function resetBoard() {
  board.value = loadPositionFromFen(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    board.value
  )

  generateMoves(board.value, attackedSquaresIndex.value, arrayOfSquaresToEdge)

  console.log(board.value)
}
</script>
