<template>
  <div
    class="board-square"
    :class="{ 'has-piece': piece && piece.type !== FigureType.ClearBoard }"
    :index="index"
    ref="itemRef"
    draggable="false"
    @dragenter="emits('handleDragEnter', $event, piece, rowIndex, colIndex)"
    @dragend="emits('handleDragEnd', $event, piece)"
    @click="emits('onClick', piece, index)"
  >
    <img
      class="figure"
      v-if="piece && piece.type !== FigureType.ClearBoard"
      :src="getFigures(props.piece)"
      draggable="true"
      @dragstart="emits('handleDragStart', $event, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { FigureColorType, FigureType } from '@/enums/figure'
import { getSquareIndexByCords, getFigures } from '@/scripts/chess/chessHelpers'
import type { Figure } from '@/types/chessTypes'
import { ref, type PropType } from 'vue'

const props = defineProps({
  rowIndex: { type: Number, default: 0 },
  colIndex: { type: Number, default: 0 },
  piece: {
    type: Object as PropType<Figure>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'handleDragEnd', event: MouseEvent, figure: Figure): void
  (e: 'handleDragEnter', event: MouseEvent, figure: Figure, i: number, j: number): void
  (e: 'handleDragStart', event: MouseEvent, figure: number): void
  (e: 'onClick', figure: Figure, index: number): void
}>()

const index = ref(getSquareIndexByCords(props.rowIndex, props.colIndex))
</script>
