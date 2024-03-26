<template>
  <div class="main-view">
    <SiteNavigation/>
    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import  SiteNavigation  from "./components/SiteNavigation.vue";
</script>

<style scoped>
</style>