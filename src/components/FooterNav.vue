<script setup>

const { type, customColors } = defineProps({
    type: String,
    customColors: Object,
});
</script>

<template>
    <footer class="mt-auto px-3">
        <p :style="{ color: type === 'custom' ? customColors.secondary : '' }">created by <a target="_blank" href="https://baptiste-zahnow.fr/">Baptiste Zahnow</a></p>
    </footer>
</template>
