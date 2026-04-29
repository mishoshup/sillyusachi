declare module '@rodneylab/svelte-social-icons' {
	import type { SvelteComponentTyped } from 'svelte';
	const SocialIcons: typeof SvelteComponentTyped<{
		network?: string;
		alt?: string;
		label?: string;
		fgColor?: string;
		bgColor?: string;
		width?: number;
		height?: number;
		style?: string;
	}>;
	export default SocialIcons;
	export { SocialIcons };
}
