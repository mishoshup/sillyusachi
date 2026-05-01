<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Sillyusachi</title>
	<meta name="description" content="Sillyusachi (Usachi) — artist and gamer open for commissions. Find my art, socials, and music here." />
	<meta name="keywords" content="Sillyusachi, Usachi, artist, art commissions, gamer, sillyusachi.com" />
	<link rel="canonical" href="https://sillyusachi.com" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sillyusachi.com" />
	<meta property="og:title" content="Sillyusachi" />
	<meta property="og:description" content="Sillyusachi (Usachi) — artist and gamer open for commissions." />
	<meta property="og:site_name" content="Sillyusachi" />

	<!-- Twitter/X Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Sillyusachi" />
	<meta name="twitter:description" content="Sillyusachi (Usachi) — artist and gamer open for commissions." />

	<!-- JSON-LD Person schema -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Sillyusachi",
		"alternateName": "Usachi",
		"url": "https://sillyusachi.com",
		"sameAs": [
			"https://www.tiktok.com/@sillyusachi",
			"https://kirke.social/sillyusachi",
			"https://open.spotify.com/user/31y7ew3vvqq7a7rcm4ugw5hjn2ou"
		]
	})}</script>`}
</svelte:head>

<div
	class="h-[100dvh] overflow-hidden bg-gradient-to-br from-[#deefef] via-[#f5ddee] to-[#e3f0e2] bg-cover bg-fixed"
>
	{@render children()}
</div>
