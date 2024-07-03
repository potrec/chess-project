<template>
  <div
    class="board-square"
    :class="squareStyle"
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
  style: { type: String, default: '' }
})

const squareStyle = ref(props.style)
watchEffect(() => {
  squareStyle.value = props.style
})

const emits = defineEmits<{
  handleDragEnd: [event: MouseEvent, figure: Figure]
  handleDragEnter: [event: MouseEvent, figure: Figure, i: number, j: number]
  handleDragStart: [event: MouseEvent, figure: number]
  onClick: [figure: Figure, index: number]
  testEmit: [number: number]
}>()

const index = ref(getSquareIndexByCords(props.rowIndex, props.colIndex))
</script>
