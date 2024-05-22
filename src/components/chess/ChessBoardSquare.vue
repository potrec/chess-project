<template>
  <div
    class="board-square"
    :class="{ 'has-piece': piece && piece.type !== FigureType.ClearBoard }"
    :index="index"
    ref="itemRef"
    draggable="false"
    v-on:dragenter="handleDragEnter($event, piece, rowIndex, colIndex)"
    v-on:dragend="handleDragEnd($event, piece)"
    @click="onClick(piece, index)"
  >
    <img
      class="figure"
      v-if="piece && piece.type !== FigureType.ClearBoard"
      :src="getFigures(piece)"
      draggable="true"
      v-on:dragstart="handleDragStart($event, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { FigureColorType, FigureType } from '@/enums/figure'
import { getSquareIndexByCords } from '@/scripts/chess/chessHelpers'
import { computed, ref } from 'vue'

const props = defineProps({
  rowIndex: { type: Number, default: 0 },
  colIndex: { type: Number, default: 0 },
  piece: {
    default: {
      type: FigureType.ClearBoard,
      color: FigureColorType.ClearBoard,
      file: 0,
      rank: 'a',
      moves: []
    }
  }
})

const index = ref(getSquareIndexByCords(props.rowIndex, props.colIndex))

// Import necessary dependencies and props
// Define methods like handleDragStart, handleDragEnd, etc., similar to those in ChessBoard
</script>
