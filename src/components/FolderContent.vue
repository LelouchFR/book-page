<script setup>
const { size, config } = defineProps(['size', 'config']);
</script>

<template>
    <div
        :class="{ 'w-4 h-4': size === 'small', 'w-8 h-8': size === 'medium', 'w-12 h-12': size === 'big' }"
        :style="{ color: config.theme.type === 'custom' ?  config.theme.customColors.secondary : '' }"
    >
        <svg class="w-full h-full" viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.58356 44C3.34606 44 2.27265 43.5378 1.36331 42.6133C0.454438 41.6893 0 40.6237 0 39.4164V4.58356C0 3.37631 0.454438 2.31069 1.36331 1.38669C2.27265 0.462228 3.34606 0 4.58356 0H22.9625L27.5461 4.58356H50.4164C51.6237 4.58356 52.6893 5.04556 53.6133 5.96956C54.5378 6.89402 55 7.95965 55 9.16644V39.4164C55 40.6237 54.5378 41.6893 53.6133 42.6133C52.6893 43.5378 51.6237 44 50.4164 44H4.58356ZM4.58356 39.4164H50.4164V9.16644H25.6438L21.0602 4.58356H4.58356V39.4164Z" fill="currentColor"/>
        </svg>
    </div>
</template>
