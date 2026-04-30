<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		count?: number;
		color?: string;
	}

	let { count = 15, color = '#a9c4db' }: Props = $props();

	type Star = {
		id: number;
		x: number;
		y: number;
		size: number;
		delay: number;
		duration: number;
		char: string;
		color: string;
	};

	let stars = $state<Star[]>([]);
	const chars = ['✦', '⊹', '˚', '✧', '⋆', '･', '｡'];
	const colors = ['#a9c4db', '#f2b8d4', '#ffffff', '#deefef', '#deefef'];

	onMount(() => {
		stars = Array.from({ length: count }).map((_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: 0.8 + Math.random() * 1.5,
			delay: Math.random() * 5,
			duration: 3 + Math.random() * 4,
			char: chars[Math.floor(Math.random() * chars.length)],
			color: colors[Math.floor(Math.random() * colors.length)]
		}));
	});
</script>

<div class="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
	{#each stars as star (star.id)}
		<span
			class="glitter absolute"
			style="
                left: {star.x}%; 
                top: {star.y}%; 
                font-size: {star.size}rem; 
                animation-delay: {star.delay}s;
                animation-duration: {star.duration}s;
                color: {star.color};
            "
		>
			{star.char}
		</span>
	{/each}
</div>

<style>
	.glitter {
		opacity: 0;
		animation: y2k-twinkle infinite ease-in-out;
		filter: drop-shadow(0 0 5px currentColor);
		will-change: transform, opacity;
	}

	@keyframes y2k-twinkle {
		0%,
		100% {
			transform: scale(0.5) rotate(0deg);
			opacity: 0.2;
		}
		50% {
			transform: scale(1.2) rotate(180deg);
			opacity: 0.9;
			filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 12px currentColor);
		}
	}
</style>
