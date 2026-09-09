<script setup>
import { ref, computed, onMounted } from "vue";
import CurrentTime from "./CurrentTime.vue";
import SettingsPopup from "./SettingsPopup.vue";
import FolderContent from "./FolderContent.vue";
import FaviconHandler from "./FaviconHandler.vue";
import { useSettings } from "@/composable/useSettings";

const { settingsConfig } = useSettings();

const rootFolders = ref([]);
const path = ref([]);
const api = typeof browser !== "undefined" ? browser : chrome;

onMounted(async () => {
    const tree = await api.bookmarks.getTree();
    rootFolders.value = buildFolderTree(tree[0]).subfolders;
});

function buildFolderTree(node) {
    const bookmarks = (node.children || []).filter(c => c.url);
    const subfolders = (node.children || []).filter(c => c.children).map(buildFolderTree);

    return {
        id: node.id,
        title: node.title || "Bookmarks",
        bookmarks,
        subfolders,
    };
}

const currentFolders = computed(() => {
    if (path.value.length === 0) return rootFolders.value;
    return path.value[path.value.length - 1].subfolders;
});

const currentBookmarks = computed(() => {
    if (path.value.length === 0) return [];
    return path.value[path.value.length - 1].bookmarks;
});

function openFolder(folder) {
    path.value.push(folder);
}

function goBack() {
    path.value.pop();
}

function goToCrumb(index) {
    path.value = path.value.slice(0, index + 1);
}
</script>

<template>
    <header class="container py-4 px-3">
        <div class="flex justify-between text-xl">
            <img src="/logo_lg.svg" />

            <div class="flex gap-4 items-center">
                <p class="flex gap-1" :style="{ color: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }">
                    <span @click="goToCrumb(-1)">~/</span>
                    <template v-for="(crumb, i) in path" :key="crumb.id">
                        <span @click="goToCrumb(i)" class="cursor-pointer"><span v-if="i >= 1">/ </span>{{ crumb.title }}</span>
                    </template>
                </p>

                <CurrentTime />

                <SettingsPopup />
            </div>
        </div>
    </header>

    <main class="container py-10">
        <button v-if="path.length" @click="goBack" class="mb-4 cursor-pointer flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.608 0L5.408 0.848001L1.312 4.8L5.408 8.784L4.64 9.632L0 5.152V4.464L4.608 0ZM0.832 5.392V4.24H9.28V5.392H0.832Z" fill="#FF8000"/>
            </svg>
            <span>Back</span>
        </button>

        <section class="grid grid-cols-12 gap-4">
            <div v-for="folder in currentFolders" :key="folder.id" class="folder">
                <div @click="openFolder(folder)" class="flex flex-col gap-2 items-center cursor-pointer">
                    <FolderContent :size="settingsConfig.theme.iconSize" :config="settingsConfig" />
                    <h3 class="text-center" :style="{ color: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }">{{ folder.title }}</h3>
                </div>
            </div>
            <a v-if="currentBookmarks.length" v-for="bookmark in currentBookmarks" :key="bookmark.id" :href="bookmark.url" class="flex flex-col items-center gap-1" :style="{ color: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }">
                <FaviconHandler :bookmark="bookmark" :config="settingsConfig" />
                <span class="text-center" >{{ bookmark.title }}</span>
            </a>
        </section>
    </main>
</template>
