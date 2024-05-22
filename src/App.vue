<template>
  <div class="main-view">
    <SiteNavigation />
    <ChessBoard :playerColor="FigureColorType.White" />
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
</script>

<style scoped></style>
``
