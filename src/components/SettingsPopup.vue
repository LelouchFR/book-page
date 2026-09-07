<script setup>
import { ref } from "vue";
import { useSettings } from '@/composable/useSettings';

const openPopup = ref(false);
const { settingsConfig } = useSettings();
</script>

<template>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" @click="openPopup = !openPopup" class="cursor-pointer">
        <path d="M6.125 16L5.66667 13.625C5.34722 13.5 5.03819 13.3542 4.73958 13.1875C4.44097 13.0208 4.15972 12.8264 3.89583 12.6042L1.60417 13.375L0 10.6042L1.8125 9.02083C1.78472 8.85417 1.76389 8.6875 1.75 8.52083C1.73611 8.35417 1.72917 8.18056 1.72917 8C1.72917 7.81944 1.73611 7.64583 1.75 7.47917C1.76389 7.3125 1.78472 7.14583 1.8125 6.97917L0 5.39583L1.60417 2.625L3.89583 3.39583C4.15972 3.17361 4.44097 2.97917 4.73958 2.8125C5.03819 2.64583 5.34722 2.5 5.66667 2.375L6.125 0H9.33333L9.79167 2.375C10.1111 2.5 10.4201 2.64583 10.7188 2.8125C11.0174 2.97917 11.2986 3.17361 11.5625 3.39583L13.8542 2.625L15.4583 5.39583L13.6458 6.97917C13.6736 7.14583 13.6944 7.3125 13.7083 7.47917C13.7222 7.64583 13.7292 7.81944 13.7292 8C13.7292 8.18056 13.7222 8.35417 13.7083 8.52083C13.6944 8.6875 13.6736 8.85417 13.6458 9.02083L15.4583 10.6042L13.8542 13.375L11.5625 12.6042C11.2986 12.8264 11.0174 13.0208 10.7188 13.1875C10.4201 13.3542 10.1111 13.5 9.79167 13.625L9.33333 16H6.125ZM7.72917 11C8.5625 11 9.27083 10.7083 9.85417 10.125C10.4375 9.54167 10.7292 8.83333 10.7292 8C10.7292 7.16667 10.4375 6.45833 9.85417 5.875C9.27083 5.29167 8.5625 5 7.72917 5C6.89583 5 6.1875 5.29167 5.60417 5.875C5.02083 6.45833 4.72917 7.16667 4.72917 8C4.72917 8.83333 5.02083 9.54167 5.60417 10.125C6.1875 10.7083 6.89583 11 7.72917 11Z" :fill="settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '#FF8000'" />
    </svg>
    <div class="w-full h-full absolute top-0 left-0 flex items-center justify-center backdrop-blur-xs" v-if="openPopup">
        <section class="w-8/10 h-9/10 rounded-sm relative border border-orange-500" :class="{ 'bg-yellow-300': settingsConfig.theme.type === 'light', 'bg-grey-700': settingsConfig.theme.type === 'dark' }" :style="{ backgroundColor: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.primary : '', borderColor: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '', color: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }">
            <div @click="openPopup = !openPopup" class="absolute top-4 right-4 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" :fill="settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '#FF8000'"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
            <!-- TODO: Create an aside for the settings menu. -->
            <!-- <aside> -->
            <!-- </aside> -->
            <div class="px-3 py-3 flex flex-col gap-2">
                <h2 class="text-2xl">Settings</h2>
                <hr />
                <h3 class="text-xl">Theme</h3>
                <div class="flex gap-2">
                    <div
                        v-for="type in ['dark', 'light', 'custom']"
                        :key="type"
                        class="relative flex justify-center items-center bg-grey-700 h-20 w-40 rounded-sm border border-orange-500 cursor-pointer"
                        :class="{ 'bg-grey-700 text-orange-500': type === 'dark', 'bg-yellow-300 text-orange-500': type === 'light' }"
                        :style="{ borderColor: type === 'custom' ? settingsConfig.theme.customColors.secondary : '', backgroundColor: type === 'custom' ? settingsConfig.theme.customColors.primary : '' }"
                        @click="settingsConfig.theme.type = type"
                    >
                        <p class="text-center" :style="{ color: type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }">{{ type.charAt(0).toUpperCase() + type.substring(1) }}</p>
                        <div class="absolute bottom-1 right-1">
                            <svg v-if="settingsConfig.theme.type !== type" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" :fill="type === 'custom' ? settingsConfig.theme.customColors.secondary : '#FF8000'"><path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Z"/></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" :fill="type === 'custom' ? settingsConfig.theme.customColors.secondary : '#FF8000'"><path d="m429-336 238-237-51-51-187 186-85-84-51 51 136 135ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z"/></svg>
                        </div>
                    </div>
                </div>
                <div v-if="settingsConfig.theme.type === 'custom'" class="flex flex-col gap-4 py-5">
                    <h3>Custom color and background</h3>
                    <div>
                        <label for="primary-color">Primary color: </label>
                        <input
                            type="text"
                            name="primary-color"
                            id="primary-color"
                            class="border border-orange-500 px-2"
                            :style="{ borderColor: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '', color: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }"
                            v-model="settingsConfig.theme.customColors.primary"
                        />
                    </div>
                    <div>
                        <label for="secondary-color">Secondary color: </label>
                        <input
                            type="text"
                            name="secondary-color"
                            id="secondary-color"
                            class="border border-orange-500 px-2"
                            :style="{ borderColor: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '', color: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }"
                            v-model="settingsConfig.theme.customColors.secondary"
                        />
                    </div>
                </div>
                <h3 class="text-xl">Font & Icons</h3>
                <div class="flex gap-2">
                    <div
                        v-for="size in ['small', 'medium', 'big']"
                        :key="size"
                        class="relative flex justify-center items-center h-24 w-40 rounded-sm border border-orange-500 cursor-pointer"
                        :style="{ borderColor: settingsConfig.theme.type === 'custom' ? settingsConfig.theme.customColors.secondary : '' }"
                        @click="settingsConfig.theme.iconSize = size"
                    >
                        <div class="flex flex-col gap-2 items-center cursor-pointer">
                            <img src="/folder.svg" alt="" :class="{ 'w-4 h-4': size === 'small', 'w-8 h-8': size === 'medium', 'w-12 h-12': size === 'big' }" />
                            <h3 class="text-center">{{ size.charAt(0).toUpperCase() + size.substring(1) }}</h3>
                        </div>
                        <div class="absolute bottom-1 right-1">
                            <svg v-if="settingsConfig.theme.iconSize !== size" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Z"/></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="m429-336 238-237-51-51-187 186-85-84-51 51 136 135ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
