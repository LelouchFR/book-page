import { ref, watch } from "vue";

const STORAGE_KEY = "settingsConfig";

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.warn("Failed to parse stored settings, using defaults", e);
        }
    }

    return {
        theme: {
            type: 'dark',
        }
    };
}

const settingsConfig = ref(loadSettings());

watch(settingsConfig, (newConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
}, { deep: true });

export function useSettings() {
    return { settingsConfig };
}
