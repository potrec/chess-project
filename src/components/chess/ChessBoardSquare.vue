<template>
  <div
    class="board-square"
    :class="{ 'has-piece': piece && piece.type !== FigureType.ClearBoard }"
    :index="index"
    ref="itemRef"
    draggable="false"
    @dragenter="$emit('handleDragEnter', $event, piece, rowIndex, colIndex)"
    @dragend="$emit('handleDragEnd', $event, piece)"
    @click="$emit('onClick', piece, index)"
  >
    <img
      class="figure"
      v-if="piece && piece.type !== FigureType.ClearBoard"
      :src="getFigures(props.piece)"
      draggable="true"
      @dragstart="$emit('handleDragStart', $event, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { FigureColorType, FigureType } from '@/enums/figure'
import { getSquareIndexByCords, getFigures } from '@/scripts/chess/chessHelpers'
import type { Figure } from '@/types/chessTypes'
import { ref } from 'vue'

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

const emits = defineEmits(['handleDragEnter', 'handleDragEnd', 'handleDragStart', 'onClick'])

const index = ref(getSquareIndexByCords(props.rowIndex, props.colIndex))
</script>
