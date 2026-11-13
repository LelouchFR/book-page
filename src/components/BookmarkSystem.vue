<script setup>
import FolderContent from "./FolderContent.vue";
import FaviconHandler from "./FaviconHandler.vue";

const { config, showFolders, showBookmarks } = defineProps({
    config: Object,
    showFolders: Boolean,
    showBookmarks: Boolean,
    folders: Object,
    bookmarks: Object,
});

const emit = defineEmits(['openFolder']);
</script>

<template>
    <main class="container py-10">
        <section class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-4">
            <div v-if="folders" v-for="folder in folders" :key="folder.id" class="folder">
                <div v-if="showFolders" @click="emit('openFolder', folder)" class="flex flex-col gap-2 items-center cursor-pointer">
                    <FolderContent :size="config.theme.iconSize" :config="config" />
                    <h3 class="text-center" :style="{ color: config.theme.type === 'custom' ? config.theme.customColors.secondary : '' }">{{ folder.title }}</h3>
                </div>
            </div>
            <a v-if="bookmarks && bookmarks.length && showBookmarks" v-for="bookmark in bookmarks" :key="bookmark.id" :href="bookmark.url" class="flex flex-col items-center gap-1" :style="{ color: config.theme.type === 'custom' ? config.theme.customColors.secondary : '' }">
                <FaviconHandler :bookmark="bookmark" :config="config" />
                <span class="text-center" >{{ bookmark.title }}</span>
            </a>
        </section>
    </main>
</template>
