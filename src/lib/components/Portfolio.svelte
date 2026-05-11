<script lang="ts">
	// Celestial rings — flower GIF references removed
	import SocialIcons from '@rodneylab/svelte-social-icons';
	import KirkeIcon from './KirkeIcon.svelte';
</script>

<div
	class="relative flex flex-col justify-center items-center w-full h-full py-8 sm:py-12 px-4 text-center gap-4 overflow-hidden"
>
	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-4 max-w-2xl w-full">
		<section class="header">
			<!-- Celestial SVG rings -->
			<svg
				class="w-[55%] h-auto mx-auto floating-element"
				viewBox="0 0 200 200"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="100" cy="100" r="85" stroke="#7ba7c9" stroke-width="0.5" opacity="0.3" />
				<circle cx="100" cy="100" r="72" stroke="#d4a853" stroke-width="0.5" opacity="0.25" />
				<circle cx="100" cy="100" r="58" stroke="#7ba7c9" stroke-width="0.5" opacity="0.2" />
				<circle cx="100" cy="100" r="44" stroke="#d4a853" stroke-width="0.4" opacity="0.15" />
				<circle cx="100" cy="100" r="30" stroke="#7ba7c9" stroke-width="0.5" opacity="0.3" />
				<!-- Star center -->
				<text x="100" y="106" text-anchor="middle" fill="#d4a853" font-size="22" opacity="0.6">✦</text>
			</svg>
		</section>

		<section class="hero">
			<h1
				class="font-amoria font-normal leading-none tracking-wide gold-gradient-text"
				style="font-size: clamp(3.5rem, 16vw, 7rem);"
			>
				Sillyusachi
			</h1>
		</section>

		<section class="about flex flex-col font-caviar font-bold leading-relaxed text-[#c8c0d0] gap-2">
			<p>
				Greetings, name's Sillyusachi. You can call me Usachi I'm an artist who play games! 𐙚 ‧₊˚ ⋅
				⊹˚. ♡.𖥔 ݁ ˖
			</p>
			<p>Check out my socials and DM me for commissions! ᯓ★</p>
			<p class="font-amoria pt-4">ask me anything!</p>
		</section>

		<section class="socials">
			<div class="flex justify-center gap-2">
				<a
					href="https://discord.com/users/985572869708869662/"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]">
						<SocialIcons alt="" network="discord" fgColor="#f0eae8" bgColor="#1a3a5c" />
					</div>
				</a>
				<a
					href="https://www.tiktok.com/@sillyusachi"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]">
						<SocialIcons alt="" network="tiktok" fgColor="#f0eae8" bgColor="#1a3a5c" />
					</div>
				</a>
				<a
					href="https://open.spotify.com/user/31y7ew3vvqq7a7rcm4ugw5hjn2ou?si=59d8805cb01c45cc"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]">
						<SocialIcons alt="" network="spotify" fgColor="#f0eae8" bgColor="#1a3a5c" />
					</div>
				</a>
				<a href="https://kirke.social/sillyusachi" class="flex flex-col items-center gap-2 group">
					<div class="transition-transform duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]">
						<KirkeIcon fgColor="#f0eae8" bgColor="#1a3a5c" />
					</div>
				</a>
			</div>
		</section>

		<section class="w-[80%] footer"></section>
	</div>

	<!-- Scroll Hint -->
	<div
		class="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 animate-bounce transition-opacity duration-700"
		style="transition-delay: 480ms"
	>
		<span class="font-caviar text-[0.58rem] text-[#8899aa] tracking-[0.18em] uppercase">
			scroll
		</span>
		<span class="text-[#8899aa] text-xs">↓</span>
	</div>
</div>

<style>
	.gold-gradient-text {
		background: linear-gradient(135deg, #f0eae8, #d4a853, #f0eae8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
</style>

