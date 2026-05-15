<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div class="content">
    <section class="panel p-5">
      <h1>{{ t('pageNotFound.title') }}</h1>
      <p class="muted">{{ t('pageNotFound.content', { route: route.path }) }}</p>
      <pv-button :label="t('pageNotFound.goHome')" class="orange-button" @click="router.push('/monitoring/dashboard')" />
    </section>
  </div>
</template>
