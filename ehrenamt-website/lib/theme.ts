/**
 * Dark Mode: Speicher-Schlüssel und Init-Skript.
 * Bewusst KEINE "use client"-Datei, damit das Server-Layout den Skript-Text einbetten kann.
 */
export const THEME_STORAGE_KEY = "theme";

/** Läuft vor dem ersten Rendern, damit beim Laden nichts aufblitzt. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;
