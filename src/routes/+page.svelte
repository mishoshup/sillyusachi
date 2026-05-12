<script lang="ts">
	import { onMount } from 'svelte';
	import { setupScrollSnap } from '$lib/scroll.js';
	import { fly } from 'svelte/transition';
	import Portfolio from '$lib/components/Portfolio.svelte';
	import GlitterOverlay from '$lib/components/GlitterOverlay.svelte';
	import CommissionInfo from '$lib/components/CommissionInfo.svelte';
import AboutMe from '$lib/components/AboutMe.svelte';
	import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from '@lucide/svelte';
	import Cece754 from '$lib/music/754.mp3';
	import Roommates from '$lib/music/roommates.mp3';

	// ── Music player ──────────────────────────────────────────────────────────
	let audio: HTMLAudioElement | undefined = $state();
	let isPaused = $state(true);
	let duration = $state(0);
	let currentTime = $state(0);
	let isMuted = $state(false);
	let volume = $state(0.5);
	let currentTrackIndex = $state(0);
	let playerExpanded = $state(false);

	interface Track {
		name: string;
		artist: string;
		src: string;
		album?: string;
	}

	const playlist: Track[] = [
		{ name: '754', artist: 'Cece Natalie', src: Cece754, album: 'Miss Behaves' },
		{ name: 'Roommates', artist: 'Malcolm Todd', src: Roommates, album: 'Sweet Boy' }
	];

	let progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	// ── Navigation ────────────────────────────────────────────────────────────
	let scrollContainer: HTMLElement | undefined = $state();
	let currentPage = $state(0);
	let scrollCleanup: (() => void) | undefined = $state();
	let navExpanded = $state(false);
	const pageNames = ['Portfolio', 'Commissions', 'About Me'];
	const tabColors = ['#7ba7c9', '#d4a853', '#5a8ab5'];
	const tabIcons = ['✦', '♡', '⊹'];
	const tabRotations = [-1, 1.5, -0.5];

	onMount(() => {
		if (audio) audio.volume = volume;
		if (!scrollContainer) return;
		scrollCleanup = setupScrollSnap(scrollContainer, (page) => { currentPage = page; });
		return () => scrollCleanup?.();
	});

	function scrollToPage(index: number) {
		if (!scrollContainer) return;
		const el = scrollContainer.querySelector(`[data-page="${index}"]`) as HTMLElement | null;
		if (el) {
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			scrollContainer.scrollTo({ top: el.offsetTop, behavior: prefersReduced ? 'instant' : 'smooth' });
		}
	}

	// ── Music player functions ────────────────────────────────────────────────
	function playTrack(index: number) {
		if (!playlist[index] || !audio) return;
		currentTrackIndex = index;
		audio.src = playlist[index].src;
		audio.play();
		isPaused = false;
	}

	function togglePlay() {
		if (!audio) return;
		if (!audio.src) {
			audio.src = playlist[currentTrackIndex].src;
		}
		if (isPaused) {
			audio.play();
		} else {
			audio.pause();
		}
		isPaused = !isPaused;
	}

	function handleTimeUpdate() {
		if (!audio) return;
		const t = audio.currentTime;
		if (Math.abs(t - currentTime) >= 0.25) currentTime = t;
	}
	function handleLoadedMetadata() {
		if (audio) duration = audio.duration;
	}
	function handleSeek(e: Event) {
		const t = e.target as HTMLInputElement;
		if (audio) audio.currentTime = Number(t.value);
	}
	function handleVolumeChange(e: Event) {
		const t = e.target as HTMLInputElement;
		volume = Number(t.value);
		if (audio) audio.volume = volume;
	}
	function toggleMute() {
		if (!audio) return;
		isMuted = !isMuted;
		audio.muted = isMuted;
	}
	function nextTrack() {
		playTrack((currentTrackIndex + 1) % playlist.length);
	}
	function prevTrack() {
		playTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
	}
	function formatTime(s: number) {
		const m = Math.floor(s / 60);
		return `${m}:${Math.floor(s % 60)
			.toString()
			.padStart(2, '0')}`;
	}
</script>

<!-- Hidden audio element -->
<audio
	bind:this={audio}
	preload="none"
	ontimeupdate={handleTimeUpdate}
	onloadedmetadata={handleLoadedMetadata}
	onplay={() => (isPaused = false)}
	onpause={() => (isPaused = true)}
	onended={nextTrack}
></audio>

<!-- ── Navigation tabs ─────────────────────────────────────────────────────── -->
<nav class="fixed left-0 top-8 z-50 flex flex-col gap-2 {navExpanded ? 'nav-expanded' : ''}" style="contain: layout style;">
	<!-- Master toggle — always on top -->
	<button
		onclick={() => (navExpanded = !navExpanded)}
		aria-label={navExpanded ? 'Collapse navigation' : 'Expand all tabs'}
		class="nav-toggle"
		class:expanded={navExpanded}
	>
		<span class="nav-toggle-icon font-xl">✦</span>
	</button>

	{#each pageNames as name, i}
		<button
			onclick={() => {
				scrollToPage(i);
				navExpanded = false;
			}}
			aria-label="Go to {name}"
			class="nav-tab {i === currentPage ? 'active' : ''}"
			style="--rot: {tabRotations[i % tabRotations.length]}deg; --bg: {tabColors[
				i % tabColors.length
			]};"
		>
			<span class="tab-label">{name}</span>
			<span class="tab-icon font-xl">{tabIcons[i % tabIcons.length]}</span>
		</button>
	{/each}
</nav>

<!-- ── Floating mini music player ─────────────────────────────────────────── -->
<div class="fixed bottom-5 left-5 z-50 font-caviar" style="contain: layout style;">
	{#if playerExpanded}
		<div
			transition:fly={{ y: 10, duration: 200, opacity: 0 }}
			class="mb-2 bg-[#080612]/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 w-64 shadow-[0_8px_40px_rgba(212,168,83,0.10),0_2px_12px_rgba(123,167,201,0.12)]"
		>
			<!-- Track info -->
			<div class="mb-3">
				<div class="font-amoria text-[1.05rem] leading-snug text-[#f0eae8]">
					{playlist[currentTrackIndex]?.name ?? 'No track'}
				</div>
				<div class="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#8899aa] mt-0.5">
					{playlist[currentTrackIndex]?.artist ?? ''}
					{#if playlist[currentTrackIndex]?.album}
						· {playlist[currentTrackIndex].album}
					{/if}
				</div>
			</div>

			<!-- Progress bar -->
			<div class="mb-3">
				<div class="relative h-4 flex items-center">
					<div
						class="absolute inset-x-0 h-[4px] bg-white/10 rounded-full pointer-events-none"
					></div>
					<div
						class="absolute left-0 h-[4px] bg-gradient-to-r from-[#d4a853] to-[#7ba7c9] rounded-full pointer-events-none max-w-full transition-[width] duration-100"
						style="width: {progress}%"
					></div>
					<input
						type="range"
						min="0"
						max={duration || 0}
						step="0.1"
						value={currentTime}
						oninput={handleSeek}
						class="absolute inset-0 w-full opacity-0 cursor-pointer"
					/>
				</div>
				<div class="flex justify-between text-[0.56rem] text-[#8899aa] mt-1">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center justify-center gap-3 mb-3">
				<button
					onclick={prevTrack}
					class="text-[#8899aa] hover:text-[#7ba7c9] transition-colors p-1"
					aria-label="Previous"
				>
					<SkipBack size={14} />
				</button>
				<button
					onclick={togglePlay}
					class="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a853] to-[#b8953a] text-white flex items-center justify-center shadow-[0_3px_12px_rgba(212,168,83,0.4)] hover:scale-110 active:scale-95 transition-all duration-200"
					aria-label={isPaused ? 'Play' : 'Pause'}
				>
					{#if isPaused}
						<Play size={16} fill="currentColor" class="ml-px" />
					{:else}
						<Pause size={16} fill="currentColor" />
					{/if}
				</button>
				<button
					onclick={nextTrack}
					class="text-[#8899aa] hover:text-[#7ba7c9] transition-colors p-1"
					aria-label="Next"
				>
					<SkipForward size={14} />
				</button>
				<div class="ml-auto hidden sm:flex items-center gap-1">
					<button
						onclick={toggleMute}
						class="text-[#8899aa] hover:text-[#7ba7c9] transition-colors p-1"
						aria-label={isMuted ? 'Unmute' : 'Mute'}
					>
						{#if isMuted}
							<VolumeX size={12} />
						{:else}
							<Volume2 size={12} />
						{/if}
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						oninput={handleVolumeChange}
						class="w-14 accent-[#d4a853] cursor-pointer"
						aria-label="Volume"
					/>
				</div>
			</div>

			<!-- Playlist -->
			<div class="border-t border-white/10 pt-2">
				<div class="text-[0.58rem] font-bold uppercase tracking-[0.09em] text-[#8899aa] mb-1.5">
					playlist
				</div>
				{#each playlist as track, i}
					<button
						onclick={() => playTrack(i)}
						class="w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-[#1a3a5c]/30 transition-colors duration-150 {i ===
						currentTrackIndex
							? 'bg-[#1a3a5c]/50 shadow-[inset_0_0_0_1px_rgba(212,168,83,0.15)]'
							: ''}"
					>
						<span
							class="w-1.5 h-1.5 rounded-full shrink-0 {i === currentTrackIndex && !isPaused
								? 'bg-[#d4a853] animate-pulse shadow-[0_0_5px_rgba(212,168,83,0.7)]'
								: i === currentTrackIndex
									? 'bg-[#d4a853]/60'
									: 'bg-[#d4a853]/25'}"
						></span>
						<div class="min-w-0 flex-1">
							<div class="text-[0.7rem] font-bold text-[#f0eae8] truncate">{track.name}</div>
							<div class="text-[0.56rem] text-[#8899aa] truncate">
								{track.artist} · {track.album}
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Mini pill -->
	<button
		onclick={() => (playerExpanded = !playerExpanded)}
		class="flex items-center bg-[#080612]/70 backdrop-blur-2xl border border-white/10 rounded-full transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_32px_rgba(212,168,83,0.15)] group {playerExpanded
			? 'p-1.5 pr-4 gap-2.5 ring-1 ring-[#d4a853]/30'
			: 'p-1'}"
	>
		<div
			class="w-8 h-8 rounded-full relative bg-[conic-gradient(from_0deg,#0a0a1a,#1a3a5c_45deg,#8899aa_90deg,#1a3a5c_135deg,#0a0a1a_180deg,#1a3a5c_225deg,#8899aa_270deg,#1a3a5c_315deg,#0a0a1a_360deg)] shadow-[0_2px_12px_rgba(0,0,0,0.5)] shrink-0 {!isPaused
				? 'animate-spin'
				: ''}"
			style={!isPaused ? 'animation-duration: 3.5s' : ''}
		>
			<!-- Vinyl grooves effect -->
			<div
				class="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_40%,rgba(255,255,255,0.03)_41%,transparent_42%,rgba(255,255,255,0.03)_48%,transparent_49%)]"
			></div>

			<!-- Sharp reflection rays -->
			<div
				class="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_40deg,white_45deg,transparent_50deg,transparent_220deg,white_225deg,transparent_230deg)] opacity-20"
			></div>

			<!-- Extra glossy sheen -->
			<div
				class="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,rgba(255,255,255,0.2)_10deg,transparent_20deg)]"
			></div>

			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#d4a853] to-[#b8953a] shadow-[0_1px_3px_rgba(0,0,0,0.5)] z-10"
				></div>
			</div>
		</div>

		{#if playerExpanded}
			<div
				transition:fly={{ x: -10, duration: 200 }}
				class="flex items-center gap-2.5 overflow-hidden"
			>
				<div class="flex flex-col min-w-0 max-w-[84px]">
					<span class="text-[0.68rem] font-bold text-[#f0eae8] truncate">
						{playlist[currentTrackIndex]?.name}
					</span>
					<span class="text-[0.56rem] text-[#8899aa] truncate">
						{playlist[currentTrackIndex]?.artist}
					</span>
				</div>
				<div class="flex items-end gap-[2px] h-3 ml-0.5" aria-hidden="true">
					{#each [750, 550, 850] as delay}
						<span
							class="w-[2.5px] rounded-[2px] bg-gradient-to-t from-[#7ba7c9] to-[#d4a853] transition-all duration-300 {!isPaused
								? 'animate-bounce'
								: ''}"
							style="height: {!isPaused ? '100%' : '35%'}; animation-duration: {delay}ms"
						></span>
					{/each}
				</div>
			</div>
		{/if}
	</button>
</div>

<!-- ── Scroll container ────────────────────────────────────────────────────── -->
<main
	bind:this={scrollContainer}
	class="h-[100dvh] w-full overflow-y-auto"
	style="scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-y;"
>
	<!-- Page 0: Portfolio -->
	<section
		data-page="0"
		class="w-full relative flex flex-col overflow-hidden"
		tabindex="0"
		role="region"
		aria-label="Portfolio"
	>
		<GlitterOverlay count={20} />
		<Portfolio />
	</section>

	<!-- Page 1: Commissions -->
	<section
		data-page="1"
		class="w-full relative flex flex-col overflow-hidden"
		tabindex="0"
		role="region"
		aria-label="Commissions"
	>
		<GlitterOverlay count={10} />
		<CommissionInfo status="open" />
	</section>

	<!-- Page 2: About Me -->
	<section
		data-page="2"
		class="w-full relative flex flex-col overflow-hidden"
		tabindex="0"
		role="region"
		aria-label="About Me"
	>
		<GlitterOverlay count={8} />
		<AboutMe />
	</section>
</main>

<style>
	.nav-tab {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		padding: 7px 10px 7px 12px;
		border-radius: 0 14px 14px 0;
		border: 1px solid rgba(255, 255, 255, 0.65);
		border-left: none;
		background: var(--bg);
		backdrop-filter: blur(10px);
		transform: rotate(var(--rot)) translateX(calc(-100% + 26px));
		transition:
			transform 0.6s cubic-bezier(0.4, 1.5, 0.68, 1),
			box-shadow 0.5s ease,
			opacity 0.5s ease;
		opacity: 0.75;
		box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	@media (hover: hover) {
		.nav-tab:hover {
			transform: rotate(var(--rot)) translateX(0px);
			opacity: 1;
			box-shadow:
				2px 2px 20px rgba(212, 168, 83, 0.15),
				inset 0 1px 0 rgba(255, 255, 255, 0.35);
		}
	}
	.nav-tab.active {
		transform: rotate(var(--rot)) translateX(0px);
		opacity: 1;
		box-shadow:
			2px 2px 20px rgba(212, 168, 83, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.35);
	}
	.tab-icon {
		font-size: 0.8rem;
		color: #f0eae8;
		line-height: 1;
		flex-shrink: 0;
	}
	.tab-label {
		font-family: var(--font-caviar);
		font-size: 0.58rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.13em;
		color: #f0eae8;
		white-space: nowrap;
		line-height: 1;
	}
	.nav-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 34px;
		border-radius: 0 13px 13px 0;
		border: 1px solid rgba(255, 255, 255, 0.72);
		border-left: none;
		background: linear-gradient(160deg, #1a3a5c, #0a0a2a);
		background-size: 300% 300%;
		backdrop-filter: blur(12px);
		transform: translateX(0);
		opacity: 0.85;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition:
			opacity 0.3s ease,
			box-shadow 0.3s ease;
	}
	@media (hover: hover) {
		.nav-toggle:hover {
			opacity: 1;
			animation: toggle-shimmer 5s ease infinite;
			box-shadow:
				3px 4px 18px rgba(212, 168, 83, 0.25),
				inset 0 1px 0 rgba(255, 255, 255, 0.6);
		}
	}
	.nav-toggle.expanded {
		opacity: 1;
		animation: toggle-shimmer 5s ease infinite;
		box-shadow:
			3px 4px 22px rgba(212, 168, 83, 0.3),
			0 0 14px rgba(123, 167, 201, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}
	@keyframes toggle-shimmer {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	.nav-toggle-icon {
		font-size: 1rem;
		color: #f0eae8;
		line-height: 1;
		display: block;
		transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.nav-toggle.expanded .nav-toggle-icon {
		transform: rotate(45deg);
	}
	/* Master toggle expanded — force all tabs slid out */
	.nav-expanded .nav-tab {
		transform: rotate(var(--rot)) translateX(0px);
		opacity: 1;
		box-shadow:
			3px 3px 18px rgba(0, 0, 0, 0.13),
			inset 0 1px 0 rgba(255, 255, 255, 0.55);
	}
main::-webkit-scrollbar {
  display: none;
}
</style>
