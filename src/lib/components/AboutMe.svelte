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

<div class="h-full w-full flex items-center justify-center p-4">
	<div
		class="max-w-[600px] w-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-[0_0_20px_rgba(212,168,83,0.08)] p-6 md:p-8"
	>
		<!-- Header -->
		<div class="text-center mb-6">
			<h2 class="font-amoria gold-gradient-text text-[2.5rem] md:text-[3rem] leading-none">
				{name}
			</h2>
			<p class="font-caviar text-[#8899aa] text-sm mt-1">{subtitle}</p>
		</div>

		<!-- Earth Globe -->
		<div class="flex flex-col items-center gap-2 mb-6">
			<div class="earth-globe" aria-hidden="true"></div>
			<span class="font-caviar text-[#8899aa] text-xs">← earth — home</span>
			<span class="font-caviar text-[#8899aa] text-sm">{location}</span>
		</div>

		<!-- Info Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
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
			<div
				class="md:col-span-2 bg-white/[0.04] border border-gold/[0.2] rounded-xl p-3"
			>
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					My Typo™
				</p>
				<p class="font-amoria italic text-[#d4a853] text-sm mt-1">"{typoQuote}"</p>
			</div>

			<!-- Favourite Characters (full width) -->
			<div class="md:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
				<p class="font-caviar font-bold uppercase text-[#7ba7c9] text-[0.6rem] tracking-[0.1em]">
					Favourite Characters
				</p>
				<p class="font-caviar text-[#f0eae8] text-sm mt-1">{favoriteCharacters}</p>
			</div>
		</div>

		<!-- Quote Footer -->
		<p class="font-amoria italic text-[#8899aa] text-center mt-6">
			"the stars incline us, they do not bind us."
		</p>

		<!-- Age descriptor (hidden decorative) -->
		<p class="text-center font-caviar text-[#8899aa] text-[0.55rem] mt-3 uppercase tracking-[0.15em] opacity-50">
			{ageDescriptor}
		</p>
	</div>
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
