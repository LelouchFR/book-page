<script setup>
import { ref, computed, onMounted } from "vue";
import CurrentTime from "./CurrentTime.vue";

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

const FALLBACK_EXTS = ['ico', 'svg', 'png', 'webp', 'jpg'];

function getFaviconCandidates(pageUrl) {
    try {
        const domain = new URL(pageUrl).origin;
        return FALLBACK_EXTS.map(ext => ext === 'ico' ? `${domain}/favicon.ico` : `${domain}/logo.${ext}`);
    } catch {
        return [];
    }
}

function handleFaviconError(event) {
    const img = event.target;
    const candidates = JSON.parse(img.dataset.candidates);
    const nextIndex = Number(img.dataset.fallbackIndex) + 1;

    if (nextIndex < candidates.length) {
        img.dataset.fallbackIndex = nextIndex;
        img.src = candidates[nextIndex];
    } else {
        img.onerror = null;
        img.src = "/file.svg";
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
    <header class="container py-4 px-3">
        <div class="flex justify-between text-xl">
            <h1>Book page</h1>

            <div class="flex gap-4 items-center">
                <p class="flex gap-1">
                    <span @click="goToCrumb(-1)">~/</span>
                    <template v-for="(crumb, i) in path" :key="crumb.id">
                        <span @click="goToCrumb(i)" class="cursor-pointer"><span v-if="i >= 1">/ </span>{{ crumb.title }}</span>
                    </template>
                </p>

                <CurrentTime />

                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.125 16L5.66667 13.625C5.34722 13.5 5.03819 13.3542 4.73958 13.1875C4.44097 13.0208 4.15972 12.8264 3.89583 12.6042L1.60417 13.375L0 10.6042L1.8125 9.02083C1.78472 8.85417 1.76389 8.6875 1.75 8.52083C1.73611 8.35417 1.72917 8.18056 1.72917 8C1.72917 7.81944 1.73611 7.64583 1.75 7.47917C1.76389 7.3125 1.78472 7.14583 1.8125 6.97917L0 5.39583L1.60417 2.625L3.89583 3.39583C4.15972 3.17361 4.44097 2.97917 4.73958 2.8125C5.03819 2.64583 5.34722 2.5 5.66667 2.375L6.125 0H9.33333L9.79167 2.375C10.1111 2.5 10.4201 2.64583 10.7188 2.8125C11.0174 2.97917 11.2986 3.17361 11.5625 3.39583L13.8542 2.625L15.4583 5.39583L13.6458 6.97917C13.6736 7.14583 13.6944 7.3125 13.7083 7.47917C13.7222 7.64583 13.7292 7.81944 13.7292 8C13.7292 8.18056 13.7222 8.35417 13.7083 8.52083C13.6944 8.6875 13.6736 8.85417 13.6458 9.02083L15.4583 10.6042L13.8542 13.375L11.5625 12.6042C11.2986 12.8264 11.0174 13.0208 10.7188 13.1875C10.4201 13.3542 10.1111 13.5 9.79167 13.625L9.33333 16H6.125ZM7.72917 11C8.5625 11 9.27083 10.7083 9.85417 10.125C10.4375 9.54167 10.7292 8.83333 10.7292 8C10.7292 7.16667 10.4375 6.45833 9.85417 5.875C9.27083 5.29167 8.5625 5 7.72917 5C6.89583 5 6.1875 5.29167 5.60417 5.875C5.02083 6.45833 4.72917 7.16667 4.72917 8C4.72917 8.83333 5.02083 9.54167 5.60417 10.125C6.1875 10.7083 6.89583 11 7.72917 11Z" fill="#FF8000"/>
                </svg>
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
                    <img src="/folder.svg" alt="" class="w-8 h-8" />
                    <h3 class="text-center">{{ folder.title }}</h3>
                </div>
            </div>
            <a v-if="currentBookmarks.length" v-for="bookmark in currentBookmarks" :key="bookmark.id" :href="bookmark.url" class="flex flex-col items-center gap-1">
                <img 
                    :src="getFaviconCandidates(bookmark.url)[0]"
                    :data-candidates="JSON.stringify(getFaviconCandidates(bookmark.url))"
                     data-fallback-index="0"
                     @error="handleFaviconError"
                     alt=""
                     class="w-10 h-10"
                />
                <span class="text-center">{{ bookmark.title }}</span>
            </a>
        </section>
    </main>
</template>
