<script setup>
import { ref, defineEmits } from "vue";
import CurrentTime from "./CurrentTime.vue";
import SettingsPopup from "./SettingsPopup.vue";
import LogoIcon from "./LogoIcon.vue";

const { config, path } = defineProps({
    config: Object,
    path: Object,
    folders: Object,
});

const backButtonHovered = ref(false);
const nextButtonHovered = ref(false);

const emit = defineEmits(['goBack', 'goToCrumb', 'setRootFolder']);
</script>

<template>
    <header class="container py-4 px-3">
        <div class="flex justify-between text-xl">
            <div class="flex gap-4 items-center" :style="{ color: config.theme.type === 'custom' && config.theme.customColors.secondary }">
                <LogoIcon :config="config" />
                <div class="flex gap-2" v-if="path.length">
                    <button @click="emit('goBack')" class="cursor-pointer flex items-center gap-1">
                        <div
                            class="border border-orange-500 pl-2 p-1 pr-0 rounded-sm hover:bg-orange-500/25 flex justify-center items-center transition-all duration-100"
                            :style="{ color: config.theme.type === 'custom' && config.theme.customColors.secondary, backgroundColor: config.theme.type === 'custom' && `${config.theme.customColors.secondary}${backButtonHovered ? '40' : '26'}`, borderColor: config.theme.type === 'custom' && config.theme.customColors.secondary }"
                            @mouseenter="backButtonHovered = true"
                            @mouseleave="backButtonHovered = false"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M384-96 0-480l384-384 68 68-316 316 316 316-68 68Z"/></svg>
                        </div>
                    </button>
                    <div
                        class="border border-orange-500 p-1 pr-0.5 rounded-sm flex justify-center items-center transition-all duration-100"
                        :style="{ color: config.theme.type === 'custom' && config.theme.customColors.secondary, backgroundColor: config.theme.type === 'custom' && `${config.theme.customColors.secondary}${nextButtonHovered ? '40' : '26'}`, borderColor: config.theme.type === 'custom' && config.theme.customColors.secondary }"
                        @mouseenter="nextButtonHovered =  true"
                        @mouseleave="nextButtonHovered =  false"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="m288-96-68-68 316-316-316-316 68-68 384 384L288-96Z"/></svg>
                    </div>
                </div>
            </div>

            <div class="flex gap-4 items-center">
                <p class="flex gap-1" :style="{ color: config.theme.type === 'custom' ? config.theme.customColors.secondary : '' }">
                    <span @click="emit('goToCrumb', -1)">~/</span>
                    <template v-for="(crumb, i) in path" :key="crumb.id">
                        <span @click="emit('goToCrumb', i)" class="cursor-pointer"><span v-if="i >= 1">/ </span>{{ crumb.title }}</span>
                    </template>
                </p>

                <CurrentTime />

                <SettingsPopup
                    :folders="folders"
                    :bookmarks="bookmarks"
                    @set-root-folder="emit('setRootFolder', $event)"
                />
            </div>
        </div>
    </header>
</template>
