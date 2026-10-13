"use client";

import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-stone-700 transition hover:border-black/20 hover:text-black dark-toggle"
    >
      {isDark ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5" />
          <path d="M12 19.5V22" />
          <path d="M4.93 4.93l1.77 1.77" />
          <path d="M17.3 17.3l1.77 1.77" />
          <path d="M2 12h2.5" />
          <path d="M19.5 12H22" />
          <path d="M4.93 19.07l1.77-1.77" />
          <path d="M17.3 6.7l1.77-1.77" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
