<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100vw;
  height: 100vh;
  background-color: #0A0C0F;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
}
</style>