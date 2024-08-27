<script setup lang="ts">
const { optimizedCount } = useProgress()
</script>

<template>
  <Suspense>
    <Counter />

    <template #fallback>
      <p>Optimizing Images... {{ optimizedCount }}</p>
    </template>
  </Suspense>
</template>
