import { useSettingsStore } from "@/store/settingsStore";
import { translations } from "./translations";

export function useTranslate() {
    const { language } = useSettingsStore();

    const t = (path: string) => {
        const keys = path.split(".");
        let current: any = translations[language];

        for (const key of keys) {
            if (current && current[key]) {
                current = current[key];
            } else {
                // Fallback to English if key missing in current language
                let fallback: any = translations.en;
                for (const fKey of keys) {
                    if (fallback && fallback[fKey]) {
                        fallback = fallback[fKey];
                    } else {
                        return path; // Return key path if both fail
                    }
                }
                return fallback;
            }
        }

        return current;
    };

    return { t, language };
}
