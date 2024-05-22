<template>
  <div v-if="modalActive == true" class="modal">
    <div class="modal-content">
      <h1>Choose side you want to play</h1>
      <div class="modal-buttons">
        <button class="primary-button">White</button>
        <button class="primary-button">Black</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
defineProps({
  modalActive: {
    type: Boolean,
    default: false
  }
})
</script>
