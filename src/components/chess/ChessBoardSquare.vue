<template>
  <div
    class="board-square"
    :class="squareStyle"
    :index="index"
    ref="itemRef"
    draggable="false"
    @dragenter="emits('handleDragEnter', $event, rowIndex, colIndex)"
    @dragend="emits('handleFigureDragEnd')"
    @click="handleClick(index, arrayOfStyles)"
  >
    <img
      class="figure"
      v-if="piece && piece.type !== FigureType.ClearBoard"
      :src="getFigures(props.piece)"
      draggable="true"
      @dragstart="emits('handleFigureDragStart', index)"
    />
  </div>
</template>

<script setup lang="ts">
import { FigureType } from '@/enums/figure'
import { getSquareIndexByCords, getFigures } from '@/scripts/chess/chessHelpers'
import type { Figure } from '@/types/chessTypes'
import { ref, watchEffect, type PropType } from 'vue'

const props = defineProps({
  rowIndex: { type: Number, default: 0 },
  colIndex: { type: Number, default: 0 },
  piece: {
    type: Object as PropType<Figure>,
    required: true
  },
  board: { type: Object as PropType<Figure[][]> },
  style: { type: String, default: '' },
  arrayOfStyles: { type: Array as PropType<string[]> },
  selectedSquare: { type: Number, default: 65 }
})

const squareStyle = ref(props.style)

watchEffect(() => {
  squareStyle.value = props.style
})

const emits = defineEmits<{
  handleFigureDragEnd: []
  handleDragEnter: [event: MouseEvent, i: number, j: number]
  handleFigureDragStart: [draggedFigure: number]
  showFigureMoves: [index: number, arrayOfStyles: string[]]
  selectSquare: [index: number]
  testEmit: [number: number]
}>()

const handleClick = (index: number, arrayOfStyles: string[]) => {
  emits('showFigureMoves', index, arrayOfStyles)
  emits('selectSquare', index)
}

const index = ref(getSquareIndexByCords(props.rowIndex, props.colIndex))
</script>
