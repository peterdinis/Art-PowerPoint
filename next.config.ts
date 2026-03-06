import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	reactCompiler: true,
	devIndicators: {
		position: "bottom-left",
	},

	typedRoutes: true,
	experimental: {
		optimizeCss: true,
		optimizePackageImports: [
			"lucide-react",
			"framer-motion",
			"zustand",
			"react-dnd",
			"react-dnd-html5-backend",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-select",
			"@radix-ui/react-tabs",
			"@radix-ui/react-popover",
			"@radix-ui/react-radio-group",
			"@radix-ui/react-slider",
			"@radix-ui/react-separator",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-label",
			"@radix-ui/react-slot",
			"@radix-ui/react-toast",
			"@radix-ui/react-switch",
		],
	},
	images: {
		formats: ["image/webp"],
		deviceSizes: [640, 828, 1080, 1200],
		imageSizes: [32, 64, 96, 128, 256],
		minimumCacheTTL: 300,
	},
	poweredByHeader: false,
	generateEtags: true,
	compress: true,
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
				],
			},
		];
	},
};

export default nextConfig;
