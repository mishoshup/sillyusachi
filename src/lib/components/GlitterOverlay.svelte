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
			size: 1.2 + Math.random() * 2.5, // Made larger
			delay: Math.random() * 5,
			duration: 2 + Math.random() * 3, // Faster twinkle
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
                --glow-color: {star.color};
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
		/* Stronger multi-layer glow */
		text-shadow: 
			0 0 10px var(--glow-color),
			0 0 20px var(--glow-color),
			0 0 30px rgba(255, 255, 255, 0.8);
		will-change: transform, opacity;
	}

	@keyframes y2k-twinkle {
		0%,
		100% {
			transform: scale(0.3) rotate(-10deg);
			opacity: 0.1;
			filter: blur(1px);
		}
		50% {
			transform: scale(1.4) rotate(180deg);
			opacity: 1;
			filter: blur(0px);
			/* Pulsing glow effect */
			text-shadow: 
				0 0 15px var(--glow-color),
				0 0 30px var(--glow-color),
				0 0 45px var(--glow-color),
				0 0 60px rgba(255, 255, 255, 1);
		}
	}
</style>
