import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from "react";
import Loading from "./loading";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Presentation Builder - Create Professional Presentations",
	description:
		"Create and manage professional presentations easily and efficiently",
	keywords: [
		"presentation",
		"slides",
		"presentation builder",
		"presentation creator",
		"slide maker",
	],
	authors: [{ name: "Presentation Builder Team" }],
	creator: "Presentation Builder",
	publisher: "Presentation Builder",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://presentation-builder.com",
		title: "Presentation Builder - Create Professional Presentations",
		description:
			"Create and manage professional presentations easily and efficiently",
		siteName: "Presentation Builder",
	},
	twitter: {
		card: "summary_large_image",
		title: "Presentation Builder - Create Professional Presentations",
		description:
			"Create and manage professional presentations easily and efficiently",
		creator: "@presentationbuilder",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "verification_token",
		yandex: "verification_token",
		yahoo: "verification_token",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Suspense fallback={<Loading />}>
					<ThemeProvider
						defaultTheme="system"
						storageKey="presentation-builder-theme"
					>
						{children}
						<ScrollToTop />
					</ThemeProvider>
				</Suspense>
			</body>
		</html>
	);
}
