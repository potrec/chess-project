<template>
  <div class="main-view">
    <SiteNavigation />
    <ChessBoard />
    <PlayModal :toggle="true" />
    <!-- <RouterView /> -->
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteNavigation from './components/SiteNavigation.vue'
import ChessBoard from './components/chess/ChessBoard.vue'
import PlayModal from './components/PlayModal.vue'
</script>

<style scoped></style>
