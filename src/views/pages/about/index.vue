<script setup lang="ts">
</script>

<template>
  <div class="w-full flex justify-content-center align-items-center">
    <div
    v-ripple="{
        pt: {
            root: { style: 'background: rgba(75, 175, 80, 0.3)' }
        }
    }" class="p-ripple w-30rem h-30rem border-1" />
  </div>
</template>

<route lang="yaml">
name: about
path: /about
meta:
  layout: default
      </route>
