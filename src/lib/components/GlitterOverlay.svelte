<script lang="ts">
	interface Props {
		count?: number;
		floatingCount?: number;
		fixed?: boolean;
	}

	let { count = 300, floatingCount = 12, fixed = false }: Props = $props();

	type Star = {
		id: number;
		x: number;
		y: number;
		size: number;
		delay: number;
		duration: number;
	};

	type FloatingStar = {
		id: number;
		x: number;
		y: number;
		size: number;
		delay: number;
		duration: number;
		char: string;
		color: string;
	};

	// Eager init — stars exist from SSR
	function generateStars(n: number): Star[] {
		return Array.from({ length: n }).map((_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: 0.5 + Math.random() * 2.5,
			delay: Math.random() * 4,
			duration: 2 + Math.random() * 4
		}));
	}

	function generateFloating(n: number): FloatingStar[] {
		const chars = ['✦', '✧', '⋆'];
		const colors = ['#ffffff', '#d4a853', '#7ba7c9'];
		return Array.from({ length: n }).map((_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: 0.8 + Math.random() * 1.2,
			delay: Math.random() * 6,
			duration: 4 + Math.random() * 4,
			char: chars[Math.floor(Math.random() * chars.length)],
			color: colors[Math.floor(Math.random() * colors.length)]
		}));
	}

	let stars = generateStars(count);
	let floating = generateFloating(floatingCount);
</script>

<div
	class="pointer-events-none overflow-hidden select-none z-0"
	class:fixed
	class:absolute={!fixed}
	class:inset-0={true}
>
	<!-- Tiny dot stars (dense starfield) -->
	{#each stars as star (star.id)}
		<div
			class="star-dot"
			style="
				left: {star.x}%;
				top: {star.y}%;
				width: {star.size}px;
				height: {star.size}px;
				animation-delay: {star.delay}s;
				animation-duration: {star.duration}s;
			"
		></div>
	{/each}

	<!-- Floating decorative stars (bigger unicode) -->
	{#each floating as f (f.id)}
		<span
			class="floating-star"
			style="
				left: {f.x}%;
				top: {f.y}%;
				font-size: {f.size}rem;
				color: {f.color};
				animation-delay: {f.delay}s;
				animation-duration: {f.duration}s;
			">{f.char}</span
		>
	{/each}
</div>

<style>
	.fixed {
		position: fixed;
	}
	.absolute {
		position: absolute;
	}
	.inset-0 {
		inset: 0;
	}

	.star-dot {
		position: absolute;
		background: white;
		border-radius: 50%;
		opacity: 0;
		animation: twinkle infinite ease-in-out;
	}

	.floating-star {
		position: absolute;
		opacity: 0.6;
		animation: floatStar infinite ease-in-out;
		pointer-events: none;
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.1;
			transform: scale(0.5);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes floatStar {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
		}
	}
</style>
