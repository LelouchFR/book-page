<script setup>
import { ref, computed, onMounted } from "vue";
import CurrentTime from "./CurrentTime.vue";
import SettingsPopup from "./SettingsPopup.vue";
import FolderContent from "./FolderContent.vue";
import FaviconHandler from "./FaviconHandler.vue";
import { useSettings } from "@/composable/useSettings";
import LogoIcon from "./LogoIcon.vue";

const { settingsConfig } = useSettings();

const backButtonHovered = ref(false);
const nextButtonHovered = ref(false);

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
            <div class="flex gap-4 items-center" :style="{ color: settingsConfig.theme.type === 'custom' && settingsConfig.theme.customColors.secondary }">
                <LogoIcon :config="settingsConfig" />
                <div class="flex gap-2" v-if="path.length">
                    <button @click="goBack" class="cursor-pointer flex items-center gap-1">
                        <div
                            class="border border-orange-500 pl-2 p-1 pr-0 rounded-sm hover:bg-orange-500/25 flex justify-center items-center transition-all duration-100"
                            :style="{ color: settingsConfig.theme.type === 'custom' && settingsConfig.theme.customColors.secondary, backgroundColor: settingsConfig.theme.type === 'custom' && `${settingsConfig.theme.customColors.secondary}${backButtonHovered ? '40' : '26'}`, borderColor: settingsConfig.theme.type === 'custom' && settingsConfig.theme.customColors.secondary }"
                            @mouseenter="backButtonHovered = true"
                            @mouseleave="backButtonHovered = false"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M384-96 0-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                        </div>
                    </button>
                    <div
                        class="border border-orange-500 p-1 pr-0.5 rounded-sm flex justify-center items-center transition-all duration-100"
                        :style="{ color: settingsConfig.theme.type === 'custom' && settingsConfig.theme.customColors.secondary, backgroundColor: settingsConfig.theme.type === 'custom' && `${settingsConfig.theme.customColors.secondary}${nextButtonHovered ? '40' : '26'}`, borderColor: settingsConfig.theme.type === 'custom' && settingsConfig.theme.customColors.secondary }"
                        @mouseenter="nextButtonHovered =  true"
                        @mouseleave="nextButtonHovered =  false"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="m288-96-68-68 316-316-316-316 68-68 384 384L288-96Z"/></svg>
                    </div>
                </div>
            </div>

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
</template>
