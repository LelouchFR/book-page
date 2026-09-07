<script setup>
import BookmarkSystem from "./components/BookmarkSystem.vue";
import { useSettings } from "@/composable/useSettings";

const { settingsConfig } = useSettings();
</script>

<template>
    <div class="bg-grey-700 text-orange-500 font-share-tech h-screen" :class="{ 'bg-grey-700': settingsConfig.theme.type === 'dark', 'bg-yellow-300': settingsConfig.theme.type === 'light' }">
        <BookmarkSystem />
    </div>
</template>
