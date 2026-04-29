<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div
	class="min-h-screen bg-gradient-to-br from-[#deefef] via-[#f5ddee] to-[#e3f0e2] bg-cover bg-fixed flex items-center justify-center"
>
	{@render children()}
</div>
