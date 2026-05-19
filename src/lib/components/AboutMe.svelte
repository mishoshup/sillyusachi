<script lang="ts">
	interface Props {
		name?: string;
		age?: string;
		subtitle?: string;
		favSong?: string;
		games?: string;
		specialInterest?: string;
		birthday?: string;
		typoQuote?: string;
		favoriteCharacters?: string;
		location?: string;
	}

	let {
		name = 'Sillyusachi',
		age = '18+',
		subtitle = 'Usachi · 18+ · voyager of dreams',
		favSong = '754 — Cece Natalie',
		games = 'Genshin Impact, HSR, ZZZ',
		specialInterest = 'Art, space, music, character design',
		birthday = 'August · Leo season',
		typoQuote = "i'm just a silly little guy lost in space",
		favoriteCharacters = 'Mavuika (Genshin), Silver Wolf (HSR), Miyabi (ZZZ)',
		location = 'Malaysia 🇲🇾'
	}: Props = $props();

	let ageDescriptor = $derived(`${age} · celestial traveler`);
</script>

<div class="relative flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-8 py-8 sm:py-12 gap-6 overflow-hidden">
	<!-- Header + Quote in a top section -->
	<div class="text-center z-10">
		<h2 class="font-amoria gold-gradient-text text-[2.5rem] sm:text-[3.5rem] leading-none">
			{name}
		</h2>
		<p class="font-caviar text-[#8899aa] text-sm mt-1">{subtitle}</p>
	</div>

	<!-- Main content: globe + info grid side by side on desktop -->
	<div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 w-full max-w-3xl z-10">
		<!-- Left: Globe Column -->
		<div class="flex flex-col items-center gap-2 shrink-0">
			<div class="earth-globe" aria-hidden="true"></div>
			<span class="font-caviar text-[#8899aa] text-xs">← earth — home</span>
			<span class="font-caviar text-[#8899aa] text-sm">{location}</span>

			<!-- Age descriptor below globe -->
			<p class="font-caviar text-[#8899aa] text-[0.55rem] uppercase tracking-[0.15em] opacity-50 mt-2">
				{ageDescriptor}
			</p>
		</div>

		<!-- Right: Info Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
			<!-- Fav Song -->
			<div class="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					Fav Song
				</p>
				<p class="font-caviar text-[#f0eae8] text-sm mt-1">{favSong}</p>
			</div>

			<!-- Games -->
			<div class="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					Games
				</p>
				<p class="font-caviar text-[#f0eae8] text-sm mt-1">{games}</p>
			</div>

			<!-- Special Interest -->
			<div class="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					Special Interest
				</p>
				<p class="font-caviar text-[#f0eae8] text-sm mt-1">{specialInterest}</p>
			</div>

			<!-- Birthday -->
			<div class="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					Birthday
				</p>
				<p class="font-caviar text-[#f0eae8] text-sm mt-1">{birthday}</p>
			</div>

			<!-- My Typo (full width, gold border) -->
			<div class="sm:col-span-2 bg-white/[0.04] border border-gold/[0.2] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					My Typo™
				</p>
				<p class="font-amoria italic text-[#d4a853] text-sm mt-1">"{typoQuote}"</p>
			</div>

			<!-- Favourite Characters (full width) -->
			<div class="sm:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					Favourite Characters
				</p>
				<p class="font-caviar text-[#f0eae8] text-sm mt-1">{favoriteCharacters}</p>
			</div>
		</div>
	</div>

	<!-- Quote Footer -->
	<p class="font-amoria italic text-[#8899aa] text-center z-10">
		"the stars incline us, they do not bind us."
	</p>
</div>

<style>
	.gold-gradient-text {
		background: linear-gradient(135deg, #f0eae8, #d4a853, #f0eae8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.earth-globe {
		width: 110px;
		height: 110px;
		border-radius: 50%;
		background-image: url('/world-map.jpg');
		background-size: auto 100%;
		background-repeat: repeat-x;
		background-position-x: 0;
		box-shadow:
			inset 12px 0 20px rgba(0, 0, 0, 0.6),
			inset -6px 0 12px rgba(0, 0, 0, 0.3);
		position: relative;
		will-change: background-position;
		transform: translateZ(0);
	}

	.earth-globe::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.08), transparent 60%);
		pointer-events: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.earth-globe {
			animation: earth-rotate 12s linear infinite;
		}
	}

	@keyframes earth-rotate {
		0% {
			background-position-x: 0;
		}
		100% {
			background-position-x: -200%;
		}
	}
</style>
