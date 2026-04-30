<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div
	class="h-[100dvh] overflow-hidden bg-gradient-to-br from-[#deefef] via-[#f5ddee] to-[#e3f0e2] bg-cover bg-fixed"
>
	{@render children()}
</div>
