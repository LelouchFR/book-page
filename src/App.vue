<script setup>
import { ref, computed, onMounted } from "vue";
import BookmarkSystem from "./components/BookmarkSystem.vue";
import HeaderNav from "./components/HeaderNav.vue";
import FooterNav from "./components/FooterNav.vue";
import { useSettings } from "@/composable/useSettings";
const { settingsConfig } = useSettings();
const api = typeof browser !== "undefined" ? browser : chrome;

const rootFolders = ref([]);
const rootBookmarks = ref([]);
const path = ref([]);

onMounted(async () => {
    const tree = await api.bookmarks.getTree();
    rootFolders.value = buildFolderTree(tree[0]).subfolders;

    const base = getFolderFromCrumb(settingsConfig.value.theme.baseDir).at(-1);
    if (base) {
        rootFolders.value = base.subfolders;
        rootBookmarks.value = base.bookmarks;
    }
});

/**
 * Bookmark:
 * - id: number
 * - title: string
 * - url: string
 *
 * Folder:
 * - id: number
 * - title: string
 * - bookmarks: Bookmark[]
 * - subfolders: Folder
 */
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

function getFolderFromCrumb(crumbs) {
    const crumbList = crumbs.split('/').filter(s => s && s !== "~");

    let folders = rootFolders.value;
    const restored = [];
    for (const crumb of crumbList) {
        const match = folders.find(f => f.title === crumb);
        if (!match) break;
        restored.push(match);
        folders = match.subfolders;
    }

    return restored;
}

const currentFolders = computed(() => {
    if (path.value.length === 0) return rootFolders.value;
    return path.value[path.value.length - 1].subfolders;
});

const currentBookmarks = computed(() => {
    if (path.value.length === 0) return rootBookmarks.value;
    return path.value[path.value.length - 1].bookmarks;
});

function openFolder(folder) {
    path.value.push(folder);
}

function setRootFolder(folder) {
    openFolder(folder);
    const crumb = getCrumb();
    settingsConfig.value.theme.baseDir = crumb;
    rootFolders.value = folder.subfolders;
    rootBookmarks.value = folder.bookmarks;
}

function goBack() {
    path.value.pop();
}

function goToCrumb(index) {
    path.value = path.value.slice(0, index + 1);
}

function getCrumb() {
    let totalCrumb = "~/";
    for (const crumb of path.value) {
        totalCrumb += crumb.title + "/";
    }
    return totalCrumb;
}
</script>

<template>
    <div
        class="bg-grey-700 text-orange-500 font-share-tech min-h-screen flex flex-col"
        :class="{ 'bg-grey-700': settingsConfig.theme.type === 'dark', 'bg-yellow-300': settingsConfig.theme.type === 'light' }"
        :style="{ backgroundColor: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.primary : '' }"
    >
        <HeaderNav
            :config="settingsConfig"
            :current-folders="currentFolders"
            :path="path"
            :folders="rootFolders"
            @go-back="goBack"
            @go-to-crumb="goToCrumb"
            @set-root-folder="setRootFolder"
        />

        <BookmarkSystem
            :config="settingsConfig"
            :show-folders="true"
            :show-bookmarks="true"
            :folders="currentFolders"
            :bookmarks="currentBookmarks"
            @open-folder="openFolder"
        />

        <FooterNav
            :type="settingsConfig.theme.type"
            :custom-colors="settingsConfig.theme.customColors"
        />
    </div>
</template>
