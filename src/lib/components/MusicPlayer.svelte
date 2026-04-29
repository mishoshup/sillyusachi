<script lang="ts">
	import { Play, Pause, Volume2, VolumeX } from '@lucide/svelte';

	interface Props {
		src: string;
		title?: string;
		artist?: string;
		autoPlay?: boolean;
	}

	let { src, title = 'Unknown Track', artist = 'Unknown Artist', autoPlay = false }: Props = $props();

	let audio: HTMLAudioElement | undefined = $state();
	let isPaused = $state(true);
	let duration = $state(0);
	let currentTime = $state(0);
	let isMuted = $state(false);

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

	function toggleMute() {
		isMuted = !isMuted;
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div
	class="bg-white/50 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-white/40 flex items-center gap-4 w-full max-w-sm font-caviar transition-all hover:shadow-md group mx-auto mt-4"
>
	<audio
		bind:this={audio}
		{src}
		autoplay={autoPlay}
		bind:muted={isMuted}
		ontimeupdate={handleTimeUpdate}
		onloadedmetadata={handleLoadedMetadata}
		onplay={() => (isPaused = false)}
		onpause={() => (isPaused = true)}
		onended={() => (isPaused = true)}
	></audio>

	<button
		onclick={togglePlay}
		class="w-12 h-12 rounded-full bg-[#A9C4DB] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md"
		aria-label={isPaused ? 'Play' : 'Pause'}
	>
		{#if isPaused}
			<Play size={24} fill="currentColor" class="ml-1" />
		{:else}
			<Pause size={24} fill="currentColor" />
		{/if}
	</button>

	<div class="flex flex-col gap-1.5 flex-1 min-w-[120px]">
		<div class="flex flex-col leading-tight">
			<span class="text-sm font-bold text-gray-800 truncate">{title}</span>
			<span class="text-[10px] uppercase tracking-wider text-gray-500 truncate">{artist}</span>
		</div>

		<div class="flex items-center gap-2">
			<input
				type="range"
				min="0"
				max={duration || 0}
				step="0.1"
				value={currentTime}
				oninput={handleSeek}
				class="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A9C4DB] hover:accent-[#98b3ca] transition-colors"
			/>
			<span class="text-[10px] text-gray-400 tabular-nums min-w-[30px]">
				{formatTime(currentTime)}
			</span>
		</div>
	</div>

	<button
		onclick={toggleMute}
		class="text-gray-400 hover:text-[#A9C4DB] transition-colors p-1"
		aria-label={isMuted ? 'Unmute' : 'Mute'}
	>
		{#if isMuted}
			<VolumeX size={18} />
		{:else}
			<Volume2 size={18} />
		{/if}
	</button>
</div>

<style>
	/* Custom range styling for a cleaner look */
	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 12px;
		height: 12px;
		background: #a9c4db;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: transform 0.1s ease;
	}

	input[type='range']:hover::-webkit-slider-thumb {
		transform: scale(1.2);
	}
</style>
