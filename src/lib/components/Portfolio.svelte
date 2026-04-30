<script lang="ts">
	import floreGif from '$lib/images/linhas-de-flores.gif';
	import brantNasuha from '$lib/images/brant_nasuha.jpeg';
	import catHeart from '$lib/images/cat_heart.gif';
	import SocialIcons from '@rodneylab/svelte-social-icons';
	import KirkeIcon from './KirkeIcon.svelte';
</script>

<div
	class="relative flex flex-col justify-center items-center w-full h-full py-8 sm:py-12 px-4 text-center gap-4 overflow-hidden"
>
	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-4 max-w-2xl w-full">
		<section class="header">
			<img src={floreGif} alt="" class="w-[50%] h-auto mx-auto floating-element" />
		</section>

		<section class="hero">
			<h1
				class="font-amoria font-normal text-[#3a2248] leading-none tracking-wide"
				style="font-size: clamp(3.5rem, 16vw, 7rem);"
			>
				Sillyusachi
			</h1>
		</section>

		<section class="about flex flex-col font-caviar font-bold leading-relaxed text-gray-700 gap-2">
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
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<SocialIcons alt="" network="discord" fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
				<a
					href="https://www.tiktok.com/@sillyusachi"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<SocialIcons alt="" network="tiktok" fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
				<a
					href="https://open.spotify.com/user/31y7ew3vvqq7a7rcm4ugw5hjn2ou?si=59d8805cb01c45cc"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<SocialIcons alt="" network="spotify" fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
				<a href="https://kirke.social/sillyusachi" class="flex flex-col items-center gap-2 group">
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<KirkeIcon fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
			</div>
		</section>

		<!-- <section class="image w-full max-w-sm"> -->
		<!-- 	<img -->
		<!-- 		src={brantNasuha} -->
		<!-- 		alt="Brant Nasuha" -->
		<!-- 		class="w-full h-auto rounded-xl shadow-[0_12px_40px_rgba(169,196,219,0.28)]" -->
		<!-- 	/> -->
		<!-- </section> -->

		<section class="w-[80%] footer">
			<!-- <p class="font-caviar font-bold"> -->
			<!-- 	<a href="/">Art Commission Info! ₊‧°𐐪♡𐑂°‧₊</a> -->
			<!-- </p> -->
			<!-- <img -->
			<!-- 	src={catHeart} -->
			<!-- 	alt="Cat heart" -->
			<!-- 	class="w-20 h-auto mx-auto mt-2 floating-element" -->
			<!-- 	style="animation-delay: 1s" -->
			<!-- /> -->
		</section>
	</div>

	<!-- Scroll Hint -->
	<div
		class="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 animate-bounce transition-opacity duration-700"
		style="transition-delay: 480ms"
	>
		<span class="font-caviar text-[0.58rem] text-[#3a2248] tracking-[0.18em] uppercase">
			scroll
		</span>
		<span class="text-[#3a2248] text-xs">↓</span>
	</div>
</div>

