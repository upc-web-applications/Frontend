<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: { type: String, default: 'line' },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  plugins: { type: Array, default: () => [] }
})

const canvas = ref(null)
let chart = null
let destroyed = false

function build() {
  if (destroyed || !canvas.value) return
  chart = new Chart(canvas.value, {
    type: props.type,
    data: props.data,
    options: props.options,
    plugins: props.plugins
  })
}

function updateChart() {
  if (destroyed || !chart) return
  chart.data = props.data
  chart.options = props.options
  chart.update()
}

onMounted(() => { build() })

watch(() => props.data, () => { chart ? updateChart() : build() }, { deep: true })
watch(() => props.options, () => { chart ? updateChart() : build() }, { deep: true })
watch(() => props.type, () => { if (chart) { chart.destroy(); chart = null } build() })

onBeforeUnmount(() => {
  destroyed = true
  if (chart) { chart.destroy(); chart = null }
})

defineExpose({ getChart: () => chart, getBase64Image: () => chart?.toBase64Image() })
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
