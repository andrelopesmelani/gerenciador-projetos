<template>
  <div class="layout">
    <Header />
    <main class="content">
      <Suspense>
        <template #default>
          <slot />
        </template>
        <template #fallback>
          <Loading />
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  padding: 36px 24px;
  overflow-y: auto;
}

</style>
