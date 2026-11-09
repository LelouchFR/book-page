<script setup>
import { ref, computed, onMounted } from "vue";
import FolderContent from "./FolderContent.vue";
import FaviconHandler from "./FaviconHandler.vue";
import { useSettings } from "@/composable/useSettings";
import HeaderNav from "./HeaderNav.vue";
import FooterNav from "./FooterNav.vue";

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
    <HeaderNav
        :config="settingsConfig"
        :path="path"
        :goBack="goBack"
        :goToCrumb="goToCrumb"
    />

    <main class="container py-10">
        <section class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-4">
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

    <FooterNav :config="settingsConfig" />
</template>
