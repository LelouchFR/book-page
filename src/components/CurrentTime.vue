<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const time = ref(null);
let intervalId = null;

function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    time.value = `${hh}:${mm}:${ss}`;
}

onMounted(() => {
    updateTime();
    intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<template>
    <span>{{ time }}</span>
</template>
