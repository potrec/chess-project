<template>
  <div class="main-view">
    <SiteNavigation />
    <Board />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteNavigation from './components/SiteNavigation.vue'
import Board from './components/chess/Board.vue'
</script>

<style scoped></style>
