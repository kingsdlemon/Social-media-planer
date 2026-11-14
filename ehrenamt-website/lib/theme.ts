/**
 * Dark Mode: Speicher-Schlüssel und Init-Skript.
 * Bewusst KEINE "use client"-Datei, damit das Server-Layout den Skript-Text einbetten kann.
 */
export const THEME_STORAGE_KEY = "theme";

/** Läuft vor dem ersten Rendern, damit beim Laden nichts aufblitzt. */
export const themeInitScript = `(function(){try{document.documentElement.classList.remove("dark");localStorage.removeItem("${THEME_STORAGE_KEY}");}catch(e){}})();`; // Seite ist immer hell
