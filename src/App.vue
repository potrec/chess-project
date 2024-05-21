<template>
  <div class="main-view">
    <SiteNavigation />
    <ChessBoard />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteNavigation from './components/SiteNavigation.vue'
import ChessBoard from './components/chess/ChessBoard.vue'
</script>

<style scoped></style>
