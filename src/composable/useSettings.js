import { ref } from "vue";

const settingsConfig = ref({
    theme: {
        type: 'custom',
    }
});

export function useSettings() {
    return { settingsConfig };
}
