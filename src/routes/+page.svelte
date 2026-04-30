<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Portfolio from '$lib/components/Portfolio.svelte';
	import ComingSoon from '$lib/components/ComingSoon.svelte';
	import GlitterOverlay from '$lib/components/GlitterOverlay.svelte';
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
	const pageNames = ['portfolio', 'coming soon'];

	onMount(() => {
		if (audio) {
			audio.volume = volume;
			audio.src = playlist[0].src;
			audio.load();
		}

		const pageEls = Array.from(
			scrollContainer?.querySelectorAll('[data-page]') ?? []
		) as HTMLElement[];

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
						currentPage = Number(entry.target.getAttribute('data-page'));
					}
				});
			},
			{ threshold: 0.6, root: scrollContainer }
		);

		pageEls.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});

	function scrollToPage(index: number) {
		const el = scrollContainer?.querySelector(`[data-page="${index}"]`);
		el?.scrollIntoView({ behavior: 'smooth' });
	}

	// ── Music player functions ────────────────────────────────────────────────
	function playTrack(index: number) {
		if (!playlist[index]) return;
		currentTrackIndex = index;
		if (audio) {
			audio.src = playlist[index].src;
			audio.load();
			audio.play();
			isPaused = false;
		}
	}

	function togglePlay() {
		if (!audio) return;
		if (isPaused) {
			audio.play();
		} else {
			audio.pause();
		}
		isPaused = !isPaused;
	}

	function handleTimeUpdate() {
		if (audio) currentTime = audio.currentTime;
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
		return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
	}
</script>

<!-- Hidden audio element -->
<audio
	bind:this={audio}
	ontimeupdate={handleTimeUpdate}
	onloadedmetadata={handleLoadedMetadata}
	onplay={() => (isPaused = false)}
	onpause={() => (isPaused = true)}
	onended={nextTrack}
></audio>

<!-- ── Navigation dots ─────────────────────────────────────────────────────── -->
<nav class="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center font-caviar">
	{#each pageNames as name, i}
		<button
			onclick={() => scrollToPage(i)}
			aria-label="Go to {name}"
			class="group relative flex items-center justify-end py-3 pr-0.5"
		>
			<span
				class="absolute right-5 text-[0.62rem] text-[#3a2248]/55 whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none capitalize"
			>
				{name}
			</span>
			<div
				class="w-2 h-2 rounded-full transition-all duration-300 {i === currentPage
					? 'bg-[#a9c4db] scale-125 shadow-[0_0_8px_rgba(169,196,219,0.9),0_0_16px_rgba(169,196,219,0.4)]'
					: 'bg-[#3a2248]/20 group-hover:bg-[#f2b8d4]/70 group-hover:scale-110'}"
			></div>
		</button>
		{#if i < pageNames.length - 1}
			<div class="w-px h-3 bg-gradient-to-b from-[#a9c4db]/25 to-[#f2b8d4]/25"></div>
		{/if}
	{/each}
</nav>

<!-- ── Floating mini music player ─────────────────────────────────────────── -->
<div class="fixed bottom-5 left-5 z-50 font-caviar">
	{#if playerExpanded}
		<div
			transition:fly={{ y: 10, duration: 200, opacity: 0 }}
			class="mb-2 bg-white/72 backdrop-blur-2xl border border-white/90 rounded-2xl p-4 w-64 shadow-[0_8px_40px_rgba(169,196,219,0.32),0_2px_12px_rgba(242,184,212,0.18)]"
		>
			<!-- Track info -->
			<div class="mb-3">
				<div class="font-amoria text-[1.05rem] leading-snug text-[#3a2248]">
					{playlist[currentTrackIndex]?.name ?? 'No track'}
				</div>
				<div class="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#7c6a8e] mt-0.5">
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
						class="absolute inset-x-0 h-[4px] bg-[#a9c4db]/20 rounded-full pointer-events-none"
					></div>
					<div
						class="absolute left-0 h-[4px] bg-gradient-to-r from-[#a9c4db] to-[#f2b8d4] rounded-full pointer-events-none max-w-full transition-[width] duration-100"
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
				<div class="flex justify-between text-[0.56rem] text-[#b0a6be] mt-1">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center justify-center gap-3 mb-3">
				<button
					onclick={prevTrack}
					class="text-[#b0a6be] hover:text-[#a9c4db] transition-colors p-1"
					aria-label="Previous"
				>
					<SkipBack size={14} />
				</button>
				<button
					onclick={togglePlay}
					class="w-9 h-9 rounded-full bg-gradient-to-br from-[#a9c4db] to-[#c8daeb] text-white flex items-center justify-center shadow-[0_3px_12px_rgba(169,196,219,0.55)] hover:scale-110 active:scale-95 transition-all duration-200"
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
					class="text-[#b0a6be] hover:text-[#a9c4db] transition-colors p-1"
					aria-label="Next"
				>
					<SkipForward size={14} />
				</button>
				<div class="ml-auto hidden sm:flex items-center gap-1">
					<button
						onclick={toggleMute}
						class="text-[#b0a6be] hover:text-[#a9c4db] transition-colors p-1"
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
						class="w-14 accent-[#a9c4db] cursor-pointer"
						aria-label="Volume"
					/>
				</div>
			</div>

			<!-- Playlist -->
			<div class="border-t border-[#a9c4db]/20 pt-2">
				<div class="text-[0.58rem] font-bold uppercase tracking-[0.09em] text-[#b0a6be] mb-1.5">
					playlist
				</div>
				{#each playlist as track, i}
					<button
						onclick={() => playTrack(i)}
						class="w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-[#a9c4db]/10 transition-colors duration-150 {i === currentTrackIndex ? 'bg-[#a9c4db]/[0.12]' : ''}"
					>
						<span
							class="w-1.5 h-1.5 rounded-full shrink-0 {i === currentTrackIndex && !isPaused
								? 'bg-[#a9c4db] animate-pulse shadow-[0_0_5px_rgba(169,196,219,0.7)]'
								: i === currentTrackIndex
									? 'bg-[#a9c4db]/60'
									: 'bg-[#a9c4db]/25'}"
						></span>
						<div class="min-w-0 flex-1">
							<div class="text-[0.7rem] font-bold text-[#3a2248] truncate">{track.name}</div>
							<div class="text-[0.56rem] text-[#b0a6be] truncate">
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
		class="flex items-center bg-white/72 backdrop-blur-2xl border border-white/90 rounded-full transition-all duration-500 shadow-[0_4px_24px_rgba(169,196,219,0.28)] hover:shadow-[0_6px_32px_rgba(169,196,219,0.44)] group {playerExpanded ? 'p-1.5 pr-4 gap-2.5 ring-1 ring-[#a9c4db]/35' : 'p-1'}"
	>
		<div
			class="w-8 h-8 rounded-full relative bg-[conic-gradient(from_0deg,#1a0f24,#4a3258_45deg,#b0a6be_90deg,#4a3258_135deg,#1a0f24_180deg,#4a3258_225deg,#b0a6be_270deg,#4a3258_315deg,#1a0f24_360deg)] shadow-[0_2px_12px_rgba(0,0,0,0.35)] shrink-0 {!isPaused ? 'animate-spin' : ''}"
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
					class="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#f5ddee] to-[#deefef] shadow-[0_1px_3px_rgba(0,0,0,0.3)] z-10"
				></div>
			</div>
		</div>

		{#if playerExpanded}
			<div
				transition:fly={{ x: -10, duration: 200 }}
				class="flex items-center gap-2.5 overflow-hidden"
			>
				<div class="flex flex-col min-w-0 max-w-[84px]">
					<span class="text-[0.68rem] font-bold text-[#3a2248] truncate">
						{playlist[currentTrackIndex]?.name}
					</span>
					<span class="text-[0.56rem] text-[#b0a6be] truncate">
						{playlist[currentTrackIndex]?.artist}
					</span>
				</div>
				<div class="flex items-end gap-[2px] h-3 ml-0.5" aria-hidden="true">
					{#each [750, 550, 850] as delay}
						<span
							class="w-[2.5px] rounded-[2px] bg-gradient-to-t from-[#a9c4db] to-[#f2b8d4] transition-all duration-300 {!isPaused ? 'animate-bounce' : ''}"
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
	style="scroll-snap-type: y mandatory; scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-y;"
>
	<!-- Page 1: Portfolio -->
	<section
		data-page="0"
		class="h-[100dvh] w-full relative"
		style="scroll-snap-align: start; scroll-snap-stop: always; touch-action: pan-y;"
	>
		<GlitterOverlay count={20} />
		<Portfolio />
	</section>

	<!-- Page 2: Coming Soon -->
	<section
		data-page="1"
		class="h-[100dvh] w-full relative"
		style="scroll-snap-align: start; scroll-snap-stop: always; touch-action: pan-y;"
	>
		<GlitterOverlay count={15} />
		<ComingSoon />
	</section>
</main>
