<template>
  <component :class="buttonClass" :is="props.as">
    <component :is="props.leftIcon" class="button-image" />
    <slot />
    <component :is="props.rightIcon" class="button-image" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  leftIcon: Object,
  rightIcon: Object,
  disabled: Boolean,
  as: {
    type: [String, Object],
    default: 'button'
  },
  intent: {
    type: String,
    validator: (val) => ['primary', 'secondary', 'danger'].includes(val),
    default: 'primary'
  }
})
const disabled = computed(() => {
  if (props.disabled) return 'disabled'
  else return ''
})
const buttonClass = computed(() => props.intent + ' ' + disabled.value)
</script>
