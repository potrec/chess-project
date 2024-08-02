<template>
  <div class="main-view">
    <SiteNavigation />
    <ChessBoard :playerColor="FigureColorType.White" :fen="kingSaveTestFEN" />
    <!-- <PlayModal :modalActive="modalActive" /> -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SiteNavigation from './components/SiteNavigation.vue'
import ChessBoard from './components/chess/ChessBoard.vue'
import PlayModal from './components/PlayModal.vue'
import { FigureColorType, FigureType } from '@/enums/figure'

const modalActive = ref(false)
const toggleModal = () => {
  modalActive.value = !modalActive.value
}

const startFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const otherFEN: string = 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23'
const knightFEN: string = '8/8/8/4n3/8/8/8/8'
const kingsFEN: string = 'r3k2r/8/8/8/8/8/8/R3K2R'
const kingMovementTestFEN: string = 'r7/4k3/8/8/8/8/4K3/R3r3'
const kingSaveTestFEN: string = 'k7/8/4R3/8/8/3rrr2/8/4K3'
</script>

<style scoped></style>
``
