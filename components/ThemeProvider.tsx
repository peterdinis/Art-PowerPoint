"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

interface ThemeProviderState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "excel-editor-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem(storageKey) as Theme;
		if (stored) {
			setTheme(stored);
		}
	}, [storageKey]);

	useEffect(() => {
		if (!mounted) return;

		const root = window.document.documentElement;

		// Remove existing theme classes
		root.classList.remove("light", "dark");

		let effectiveTheme: "light" | "dark";

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			effectiveTheme = systemTheme;
		} else {
			effectiveTheme = theme;
		}

		root.classList.add(effectiveTheme);
		root.setAttribute("data-theme", effectiveTheme);
		
		// Save to localStorage
		localStorage.setItem(storageKey, theme);
	}, [theme, mounted, storageKey]);

	// Listen for system theme changes
	useEffect(() => {
		if (!mounted || theme !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			const root = window.document.documentElement;
			root.classList.remove("light", "dark");
			const systemTheme = mediaQuery.matches ? "dark" : "light";
			root.classList.add(systemTheme);
			root.setAttribute("data-theme", systemTheme);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme, mounted]);

	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme);
	};

	// Prevent hydration mismatch by not rendering theme-dependent content until mounted
	const value = {
		theme,
		setTheme: handleSetTheme,
		mounted,
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
}