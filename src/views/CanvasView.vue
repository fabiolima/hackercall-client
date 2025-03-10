<template>
  <div ref="canvasContainer" class="h-full w-full"></div>
</template>

<script setup>
import { useCube } from '@/composables/useCube'
import { onMounted, ref } from 'vue'
const { start } = useCube()
const canvasContainer = ref(null)
onMounted(() => {
  start(canvasContainer.value)
})
</script>
