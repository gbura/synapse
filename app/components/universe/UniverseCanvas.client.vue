<script setup lang="ts">
import { UniverseEngine } from '~~/engine/core/UniverseEngine';

const containerRef = useTemplateRef<HTMLElement | null>('containerRef');

let engine: UniverseEngine | null = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    if (!containerRef.value) {
        return;
    }

    engine = new UniverseEngine(containerRef.value);
    engine.start();

    resizeObserver = new ResizeObserver(() => {
        engine?.resize();
    });

    resizeObserver.observe(containerRef.value);
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;

    engine?.dispose();
    engine = null;
});
</script>

<template>
    <div ref="containerRef" class="universe-canvas" />
</template>

<style scoped>
.universe-canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
