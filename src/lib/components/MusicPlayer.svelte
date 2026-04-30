<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Play,
		Pause,
		SkipForward,
		SkipBack,
		Volume2,
		VolumeX,
		ChevronDown,
		ChevronUp
	} from '@lucide/svelte';
	import Cece754 from '$lib/music/754.mp3';
	import Roommates from '$lib/music/roommates.mp3';

	let audio: HTMLAudioElement | undefined = $state();
	let isPaused = $state(true);
	let duration = $state(0);
	let currentTime = $state(0);
	let isMuted = $state(false);
	let volume = $state(0.5);
	let showVolume = $state(false);
	let showPlaylist = $state(false);
	let currentTrackIndex = $state(0);

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

	onMount(() => {
		if (audio) {
			audio.volume = volume;
			audio.src = playlist[0].src;
			audio.load();
		}
	});

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
		const target = e.target as HTMLInputElement;
		if (audio) audio.currentTime = Number(target.value);
	}

	function handleVolumeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		volume = Number(target.value);
		if (audio) audio.volume = volume;
	}

	function toggleMute() {
		if (!audio) return;
		isMuted = !isMuted;
		audio.muted = isMuted;
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function nextTrack() {
		playTrack((currentTrackIndex + 1) % playlist.length);
	}

	function prevTrack() {
		playTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
	}
</script>

<div class="w-full max-w-lg mx-auto mt-4 flex flex-col gap-2 font-caviar">
	<audio
		bind:this={audio}
		ontimeupdate={handleTimeUpdate}
		onloadedmetadata={handleLoadedMetadata}
		onplay={() => (isPaused = false)}
		onpause={() => (isPaused = true)}
		onended={nextTrack}
	></audio>

	<!-- Player card -->
	<div
		class="bg-gradient-to-br from-white/70 via-[#f5ddee]/50 to-[#deefef]/50 backdrop-blur-xl border border-white rounded-3xl p-4 flex gap-4 items-center shadow-[0_6px_28px_rgba(169,196,219,0.22),0_1px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
	>
		<!-- Vinyl disc -->
		<div class="shrink-0 p-[3px] rounded-full bg-gradient-to-br from-[#f2b8d4]/60 to-[#a9c4db]/60">
			<div
				class="w-20 h-20 rounded-full relative bg-[conic-gradient(#1e1228_0deg,#2e1a40_45deg,#1e1228_90deg,#261535_135deg,#1e1228_180deg,#2e1a40_225deg,#1e1228_270deg,#261535_315deg,#1e1228_360deg)] shadow-[0_4px_18px_rgba(30,18,40,0.35),inset_0_1px_2px_rgba(255,255,255,0.08)] {!isPaused
					? 'animate-spin'
					: ''}"
				style={!isPaused ? 'animation-duration: 5s' : ''}
			>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[64px] h-[64px] rounded-full border border-white/[0.055] pointer-events-none"
				></div>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full border border-white/[0.04] pointer-events-none"
				></div>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[33px] h-[33px] rounded-full border border-white/[0.03] pointer-events-none"
				></div>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#f5ddee] to-[#deefef] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
				>
					<span class="text-[#a9c4db] text-[0.6rem] leading-none">♪</span>
				</div>
			</div>
		</div>

		<!-- Info + controls -->
		<div class="flex-1 min-w-0 flex flex-col gap-2">
			<!-- Track info -->
			<div class="flex flex-col gap-[0.08rem] overflow-hidden">
				<span class="font-amoria text-[1.15rem] text-[#3a2248] leading-[1.15] truncate">
					{playlist[currentTrackIndex]?.name ?? 'No track'}
				</span>
				<span class="text-[0.66rem] font-bold uppercase tracking-[0.07em] text-[#7c6a8e] truncate">
					{playlist[currentTrackIndex]?.artist ?? 'Unknown'}
				</span>
				<span class="text-[0.6rem] text-[#b0a6be] truncate">
					{playlist[currentTrackIndex]?.album ?? ''}
				</span>
			</div>

			<!-- Equalizer bars -->
			<div class="flex gap-[2.5px] items-end h-3" aria-hidden="true">
				<span
					class="w-[3px] rounded-[2px_2px_1px_1px] bg-gradient-to-t from-[#a9c4db] to-[#f2b8d4] {!isPaused
						? 'h-2 animate-bounce [animation-duration:750ms]'
						: 'h-[3px]'}"
				></span>
				<span
					class="w-[3px] rounded-[2px_2px_1px_1px] bg-gradient-to-t from-[#a9c4db] to-[#f2b8d4] {!isPaused
						? 'h-3 animate-bounce [animation-duration:550ms] [animation-delay:120ms]'
						: 'h-[3px]'}"
				></span>
				<span
					class="w-[3px] rounded-[2px_2px_1px_1px] bg-gradient-to-t from-[#a9c4db] to-[#f2b8d4] {!isPaused
						? 'h-2.5 animate-bounce [animation-duration:850ms] [animation-delay:40ms]'
						: 'h-[3px]'}"
				></span>
				<span
					class="w-[3px] rounded-[2px_2px_1px_1px] bg-gradient-to-t from-[#a9c4db] to-[#f2b8d4] {!isPaused
						? 'h-1.5 animate-bounce [animation-duration:650ms] [animation-delay:200ms]'
						: 'h-[3px]'}"
				></span>
				<span
					class="w-[3px] rounded-[2px_2px_1px_1px] bg-gradient-to-t from-[#a9c4db] to-[#f2b8d4] {!isPaused
						? 'h-3 animate-bounce [animation-duration:500ms] [animation-delay:80ms]'
						: 'h-[3px]'}"
				></span>
			</div>

			<!-- Progress bar -->
			<div class="flex flex-col gap-1">
				<div class="relative h-5 flex items-center">
					<div
						class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[5px] bg-[#a9c4db]/20 rounded-full pointer-events-none"
					></div>
					<div
						class="absolute left-0 top-1/2 -translate-y-1/2 h-[5px] bg-gradient-to-r from-[#a9c4db] to-[#f2b8d4] rounded-full pointer-events-none transition-[width] duration-100 max-w-full"
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
						aria-label="Seek"
					/>
				</div>
				<div class="flex justify-between text-[0.58rem] text-[#b0a6be]">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center gap-2 justify-center sm:justify-start">
				<button
					onclick={prevTrack}
					class="text-[#b0a6be] hover:text-[#a9c4db] hover:scale-110 transition-all duration-200 p-1 rounded-full flex items-center justify-center"
					aria-label="Previous"
				>
					<SkipBack size={15} />
				</button>

				<button
					onclick={togglePlay}
					class="w-9 h-9 rounded-full bg-gradient-to-br from-[#a9c4db] to-[#c8daeb] text-white flex items-center justify-center shadow-[0_3px_14px_rgba(169,196,219,0.55)] hover:scale-110 active:scale-95 transition-all duration-200"
					aria-label={isPaused ? 'Play' : 'Pause'}
				>
					{#if isPaused}
						<Play size={18} fill="currentColor" class="ml-px" />
					{:else}
						<Pause size={18} fill="currentColor" />
					{/if}
				</button>

				<button
					onclick={nextTrack}
					class="text-[#b0a6be] hover:text-[#a9c4db] hover:scale-110 transition-all duration-200 p-1 rounded-full flex items-center justify-center"
					aria-label="Next"
				>
					<SkipForward size={15} />
				</button>

				<!-- Volume (hidden on mobile — iOS doesn't allow JS volume control) -->
				<div class="relative ml-auto hidden sm:flex items-center gap-2">
					<button
						onclick={toggleMute}
						class="text-[#b0a6be] hover:text-[#a9c4db] hover:scale-110 transition-all duration-200 p-1 rounded-full flex items-center justify-center"
						aria-label={isMuted ? 'Unmute' : 'Mute'}
					>
						{#if isMuted}
							<VolumeX size={15} />
						{:else}
							<Volume2 size={15} />
						{/if}
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						oninput={handleVolumeChange}
						class="w-16 accent-[#a9c4db] cursor-pointer"
						aria-label="Volume"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Playlist card -->
	<div
		class="bg-gradient-to-br from-white/65 to-[#deefef]/50 backdrop-blur-xl border border-white/65 rounded-[1.25rem] overflow-hidden shadow-[0_4px_20px_rgba(169,196,219,0.15),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.75)]"
	>
		<button
			onclick={() => (showPlaylist = !showPlaylist)}
			class="w-full px-4 py-3 flex items-center justify-between text-[#b0a6be] hover:bg-white/35 transition-colors duration-200"
		>
			<div class="flex flex-col items-start gap-[0.05rem]">
				<span class="font-amoria text-[0.9rem] text-[#3a2248]">my playlist ♡</span>
				<span class="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#b0a6be]"
					>{playlist.length} songs</span
				>
			</div>
			{#if showPlaylist}
				<ChevronUp size={15} />
			{:else}
				<ChevronDown size={15} />
			{/if}
		</button>

		{#if showPlaylist}
			<div
				class="border-t border-white/45 max-h-40 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#a9c4db40_transparent]"
			>
				{#each playlist as track, i}
					<button
						onclick={() => playTrack(i)}
						class="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/35 transition-colors duration-200 {i ===
						currentTrackIndex
							? 'bg-[#a9c4db]/[0.14]'
							: ''}"
					>
						<span
							class="w-1.5 h-1.5 rounded-full shrink-0 {i === currentTrackIndex && !isPaused
								? 'bg-[#a9c4db] shadow-[0_0_6px_rgba(169,196,219,0.65)] animate-pulse'
								: i === currentTrackIndex
									? 'bg-[#a9c4db]/60'
									: 'bg-[#a9c4db]/30'}"
						></span>
						<div class="flex flex-col gap-[0.06rem] min-w-0">
							<span class="text-[0.78rem] font-bold text-[#3a2248] truncate">{track.name}</span>
							<span class="text-[0.6rem] text-[#b0a6be] truncate"
								>{track.artist} · {track.album}</span
							>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
