<script setup>
import { ref, computed, onMounted } from "vue";

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

function getFaviconUrl(pageUrl) {
    try {
        const domain = new URL(pageUrl).origin;
        return `${domain}/favicon.ico`;
    } catch {
        return null;
    }
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
    <main class="container">
        <div>
            <h1>Book page</h1>
            <p class="flex gap-1">
                <span @click="goToCrumb(-1)">./</span>
                <template v-for="(crumb, i) in path" :key="crumb.id">
                    <span @click="goToCrumb(i)" class="cursor-pointer">{{ crumb.title }}</span>
                </template>
            </p>
        </div>

        <button v-if="path.length" @click="goBack" class="mb-4">Back</button>

        <section class="grid grid-cols-12 gap-4">
            <div v-for="folder in currentFolders" :key="folder.id" class="folder">
                <div @click="openFolder(folder)" class="flex flex-col gap-2 items-center cursor-pointer">
                    <img src="/folder.svg" alt="" class="w-8 h-8" />
                    <h3>{{ folder.title }}</h3>
                </div>
            </div>
        </section>

        <section v-if="currentBookmarks.length">
            <div v-for="bookmark in currentBookmarks" :key="bookmark.id" class="flex items-center gap-1">
                <img :src="getFaviconUrl(bookmark.url)" alt="" class="w-8 h-8" />
                <a :href="bookmark.url">{{ bookmark.title }}</a>
            </div>
        </section>
    </main>
</template>
