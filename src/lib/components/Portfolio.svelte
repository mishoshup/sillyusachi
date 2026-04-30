<script lang="ts">
	import floreGif from '$lib/images/linhas-de-flores.gif';
	import brantNasuha from '$lib/images/brant_nasuha.jpeg';
	import catHeart from '$lib/images/cat_heart.gif';
	import SocialIcons from '@rodneylab/svelte-social-icons';
	import KirkeIcon from './KirkeIcon.svelte';
	import { Spotlight } from '@lucide/svelte';
	import MusicPlayer from './MusicPlayer.svelte';
</script>

<div class="flex justify-center items-center min-h-screen w-full">
	<div
		class="flex flex-col justify-center items-center max-w-150 w-full py-8 sm:py-12 relative text-center gap-4"
	>
		<section class="header">
			<img src={floreGif} alt="" class="w-[70%] h-auto mx-auto" />
		</section>

		<section class="hero">
			<h1 class="font-amoria text-4xl sm:text-3xl mt-4 mb-2 font-normal">Sillyusachi</h1>
		</section>

		<section class="about flex flex-col font-caviar font-bold leading-relaxed text-gray-700 gap-2">
			<p class="">
				Greetings, name's Sillyusachi. You can call me Usachi I'm an artist who play games! 𐙚 ‧₊˚ ⋅
				⊹˚. ♡.𖥔 ݁ ˖
			</p>
			<p class="">Check out my socials and DM me for commissions! ᯓ★</p>
			<p class="font-amoria pt-4">ask me anything!</p>
		</section>

		<section class="socials">
			<div class="flex justify-center gap-2">
				<!-- Discord -->
				<a
					href="https://discord.com/users/985572869708869662/"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<SocialIcons alt="" network="discord" fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
				<!-- TikTok -->
				<a
					href="https://www.tiktok.com/@sillyusachi"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<SocialIcons alt="" network="tiktok" fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
				<!-- Spotify -->
				<a
					href="https://open.spotify.com/user/31y7ew3vvqq7a7rcm4ugw5hjn2ou?si=59d8805cb01c45cc"
					class="flex flex-col items-center gap-2 group"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<SocialIcons alt="" network="spotify" fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
				<!-- Kirke -->
				<a
					href="https://kirke.social/sillyusachi"
					class="flex flex-col items-center gap-2 group hover:"
				>
					<div class="transition-transform duration-300 group-hover:-translate-y-1">
						<KirkeIcon fgColor="#eeeeee" bgColor="#A9C4DB" />
					</div>
				</a>
			</div>
		</section>

		<section class="image">
			<img src={brantNasuha} alt="Brant Nasuha" class="w-full h-auto" />
		</section>

		<section class="w-[80%] footer">
			<p class="font-caviar font-bold"><a href="/"> Art Commission Info! ₊‧°𐐪♡𐑂°‧₊</a></p>
			<img src={catHeart} alt="Cat heart" class="w-20 h-auto mx-auto mt-2" />
			<div class="w-full">
				<MusicPlayer />
			</div>
		</section>
	</div>
</div>
