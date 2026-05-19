<script lang="ts">
	import '../app.css';
	import GlitterOverlay from '$lib/components/GlitterOverlay.svelte';
	let { children } = $props();

	const ldSchema =
		'<script type="application/ld+json">' +
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Sillyusachi',
			alternateName: 'Usachi',
			url: 'https://sillyusachi.com',
			sameAs: [
				'https://www.tiktok.com/@sillyusachi',
				'https://kirke.social/sillyusachi',
				'https://open.spotify.com/user/31y7ew3vvqq7a7rcm4ugw5hjn2ou'
			]
		}) +
		'<' +
		'/script>';
</script>

<svelte:head>
	<link rel="preload" href="/AMORIA.woff2" as="font" type="font/woff2" crossorigin />
	<link rel="preload" href="/CaviarDreams.woff2" as="font" type="font/woff2" crossorigin />
	<title>Sillyusachi</title>
	<meta
		name="description"
		content="Sillyusachi (Usachi) — artist and gamer open for commissions. Find my art, socials, and music here."
	/>
	<meta
		name="keywords"
		content="Sillyusachi, Usachi, artist, art commissions, gamer, sillyusachi.com"
	/>
	<link rel="canonical" href="https://sillyusachi.com" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sillyusachi.com" />
	<meta property="og:title" content="Sillyusachi" />
	<meta
		property="og:description"
		content="Sillyusachi (Usachi) — artist and gamer open for commissions."
	/>
	<meta property="og:site_name" content="Sillyusachi" />

	<!-- Twitter/X Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Sillyusachi" />
	<meta
		name="twitter:description"
		content="Sillyusachi (Usachi) — artist and gamer open for commissions."
	/>

	<!-- JSON-LD Person schema -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html ldSchema}
</svelte:head>

<div class="h-[100dvh] bg-[#080612] bg-cover bg-fixed">
	<!-- Single fixed starfield (matching voyager draft template) -->
	<GlitterOverlay count={300} floatingCount={12} fixed={true} />

	<!-- Atmospheric haze overlays (matching voyager draft template) -->
	<div
		class="fixed inset-0 z-0 pointer-events-none"
		style="background:
			radial-gradient(ellipse at 20% 50%, rgba(59, 30, 84, 0.5) 0%, transparent 60%),
			radial-gradient(ellipse at 80% 20%, rgba(30, 60, 114, 0.4) 0%, transparent 50%),
			radial-gradient(ellipse at 50% 80%, rgba(20, 16, 40, 0.8) 0%, transparent 50%);"
	></div>
	{@render children()}
</div>
