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
	storageKey = "presentation-builder-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		const stored = localStorage.getItem(storageKey) as Theme;
		return stored || defaultTheme;
	});

	useEffect(() => {
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

		// Also set data-theme attribute for better compatibility
		root.setAttribute("data-theme", effectiveTheme);
	}, [theme]);

	// Listen for system theme changes
	useEffect(() => {
		if (theme !== "system") return;

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
	}, [theme]);

	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		if (typeof window !== "undefined") {
			localStorage.setItem(storageKey, newTheme);
		}
	};

	const value = {
		theme,
		setTheme: handleSetTheme,
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
};
