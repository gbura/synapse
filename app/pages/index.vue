<script setup lang="ts">
import UniverseCanvas from '~/components/universe/UniverseCanvas.client.vue';
import synapseLogo from '~/assets/icons/synapse-logo.svg';
</script>

<template>
    <main class="relative h-screen w-screen overflow-hidden bg-[#020308]">
        <!-- 3D Universe -->
        <ClientOnly>
            <UniverseCanvas />

            <template #fallback>
                <div class="h-full w-full" />
            </template>
        </ClientOnly>

        <!-- Interface overlay -->
        <header class="pointer-events-none absolute left-0 top-0 z-10 flex items-center gap-4 p-8">
            <div class="flex flex-col items-center justify-center">
                <img :src="synapseLogo" alt="Synapse logo" class="w-32" />
                <h1 class="text-xl font-semibold tracking-[0.3em]">SYNAPSE</h1>
                <p class="mt-1 text-xs text-white/40">A living universe of knowledge</p>
            </div>
        </header>

        <!-- Controls hint -->
        <div class="pointer-events-none absolute bottom-8 left-8 z-10 text-xs text-white/40">
            Drag to rotate · Scroll to zoom
        </div>
    </main>
</template>
