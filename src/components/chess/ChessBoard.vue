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
          <div class="board-line" v-for="(line, i) in chessBoardStore.chessBoard" :key="i">
            <ChessBoardSquare
              v-for="(square, j) in line"
              :key="j"
              :piece="square"
              :row-index="i"
              :col-index="j"
              :style="chessBoardStore.arrayOfStyles[getSquareIndexByCords(i, j)]"
              :board="chessBoardStore.chessBoard"
              :arrayOfStyles="chessBoardStore.arrayOfStyles"
              @handleFigureDragStart="handleFigureDragStart"
              @handleFigureDragEnd="handleFigureDragEnd"
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
        <div class="board-info">{{ chessBoardStore.boardInfo }}</div>
      </div>
    </div>

    <div class="board-dev-tools">
      <button @click="toggleAllAttackedSquares()">Toggle All AttackedSquares</button>
      <select v-model="chessBoardStore.attackSquaresColor">
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
import { watch } from 'vue'
import { FigureColorType } from '@/enums/figure'
import { getSquareIndexByCords } from '@/scripts/chess/chessHelpers'
import {
  handleFigureDragStart,
  handleFigureDragEnd,
  showFigureMoves,
  selectSquare,
  handleDragEnter,
  toggleAllAttackedSquares,
  getBoardFEN,
  pasteBoardFEN,
  resetBoard,
  handleAttackedSquares,
  loadPositionFromFen
} from '@/scripts/chess/chessBoard'
import { generateMoves } from '@/scripts/chess/chessMoves'
import ChessBoardSquare from '@/components/chess/ChessBoardSquare.vue'
import ChessBoardRankInfo from '@/components/chess/ChessBoardRankInfo.vue'
import ChessBoardFileInfo from '@/components/chess/ChessBoardFileInfo.vue'
import { useChessBoardStore } from '@/stores/chessBoard'
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

const chessBoardStore = useChessBoardStore()

chessBoardStore.chessBoard = loadPositionFromFen(props.fen, chessBoardStore.chessBoard)
chessBoardStore.attackedSquaresIndex = generateMoves(
  chessBoardStore.chessBoard,
  chessBoardStore.attackedSquaresIndex,
  chessBoardStore.arrayOfSquaresToEdge
)
watch(
  () => chessBoardStore.attackSquaresColor,
  () => {
    handleAttackedSquares()
  }
)
</script>
