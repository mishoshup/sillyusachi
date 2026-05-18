<script lang="ts">
	let { status = 'open' }: { status?: 'open' | 'closed' } = $props();

	let statusText = $derived(status === 'open' ? '● open' : '● closed');
	let statusDotColor = $derived(status === 'open' ? '#4ade80' : '#ef4444');
	let statusBadgeClasses = $derived(
		status === 'open'
			? 'bg-green-500/10 text-green-400 border-green-500/30'
			: 'bg-red-500/10 text-red-400 border-red-500/30'
	);
	let statusCardBorder = $derived(status === 'open' ? 'border-green-500/20' : 'border-red-500/20');
</script>

<div class="relative flex flex-col items-center w-full py-12 px-3 sm:px-6 gap-6">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
		<!-- 1. Header — full width -->
		<div class="col-span-1 md:col-span-2 lg:col-span-3 text-center mb-1">
			<h1 class="font-amoria text-[2.8rem] sm:text-[3.5rem] leading-none text-cream">
				commission <span class="text-[#d4a853]">info</span>
			</h1>
		</div>

		<!-- 2. Gallery placeholder -->
		<div
			class="bg-white/[0.04] border border-dashed border-white/[0.15] rounded-2xl p-6 flex items-center justify-center min-h-[180px] backdrop-blur-md"
		>
			<p class="font-caviar text-[#8899aa] text-sm text-center">art samples coming soon ✦</p>
		</div>

		<!-- 3. Pricing -->
		<div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md">
			<h3 class="font-caviar font-bold uppercase text-[#d4a853] text-xs tracking-[0.12em] mb-2">
				Pricing
			</h3>
			<p class="font-caviar text-[#8899aa] text-sm leading-relaxed">
				contact for current rates, varies by complexity
			</p>
			<p class="font-space text-[#8899aa] text-[0.65rem] mt-2 opacity-70">
				sketches · lineart · full render · emotes
			</p>
		</div>

		<!-- 4. Terms of Service — lg:col-span-2 -->
		<div
			class="lg:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md"
		>
			<h3 class="font-caviar font-bold uppercase text-[#d4a853] text-xs tracking-[0.12em] mb-3">
				Terms of Service
			</h3>
			<dl class="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div>
					<dt class="font-caviar font-bold text-[#d4a853] text-[0.6rem] uppercase tracking-[0.1em]">
						Payment
					</dt>
					<dd class="font-caviar text-[#8899aa] text-sm mt-1">
						50% upfront<br />50% on completion
					</dd>
				</div>
				<div>
					<dt class="font-caviar font-bold text-[#d4a853] text-[0.6rem] uppercase tracking-[0.1em]">
						Turnaround
					</dt>
					<dd class="font-caviar text-[#8899aa] text-sm mt-1">
						2–4 weeks<br />depending on complexity
					</dd>
				</div>
				<div>
					<dt class="font-caviar font-bold text-[#d4a853] text-[0.6rem] uppercase tracking-[0.1em]">
						Revisions
					</dt>
					<dd class="font-caviar text-[#8899aa] text-sm mt-1">
						Unlimited sketch revisions<br />minor changes after
					</dd>
				</div>
			</dl>
		</div>

		<!-- 5. Dos & Don'ts -->
		<div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md">
			<h3 class="font-caviar font-bold uppercase text-[#d4a853] text-xs tracking-[0.12em] mb-3">
				Dos &amp; Don'ts
			</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p
						class="font-caviar text-[#4ade80] text-xs font-bold uppercase tracking-[0.08em] mb-1.5"
					>
						✅ Do
					</p>
					<ul class="font-caviar text-[#8899aa] text-xs leading-relaxed space-y-1">
						<li>• OCs</li>
						<li>• Fanart</li>
						<li>• References</li>
					</ul>
				</div>
				<div>
					<p
						class="font-caviar text-[#ef4444] text-xs font-bold uppercase tracking-[0.08em] mb-1.5"
					>
						❌ Don't
					</p>
					<ul class="font-caviar text-[#8899aa] text-xs leading-relaxed space-y-1">
						<li>• NSFW</li>
						<li>• AI training</li>
						<li>• Commercial use</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 6. Payment methods -->
		<div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md">
			<h3 class="font-caviar font-bold uppercase text-[#d4a853] text-xs tracking-[0.12em] mb-2">
				Payment
			</h3>
			<div
				class="font-caviar text-[#8899aa] text-sm leading-relaxed flex flex-wrap gap-x-3 gap-y-1"
			>
				<span>PayPal</span>
				<span>ShopeePay</span>
				<span>Touch 'n Go eWallet</span>
			</div>
		</div>

		<!-- 7. Commission status -->
		<div
			class="bg-white/[0.04] border-2 rounded-2xl p-5 backdrop-blur-md {statusCardBorder}"
			role="status"
		>
			<h3 class="font-caviar font-bold uppercase text-[#d4a853] text-xs tracking-[0.12em] mb-2">
				Status
			</h3>
			<div class="flex items-center gap-2 mb-2">
				<span class="relative flex h-2.5 w-2.5">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
						style="background-color: {statusDotColor};"
					></span>
					<span
						class="relative inline-flex rounded-full h-2.5 w-2.5"
						style="background-color: {statusDotColor};"
					></span>
				</span>
				<span class="font-space font-bold text-sm" style="color: {statusDotColor};">
					{statusText}
				</span>
			</div>
			<p class="font-caviar text-[#8899aa] text-sm">DM to discuss your idea ✦</p>
		</div>
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.animate-ping {
			animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
		}
		.animate-bounce {
			animation: bounce 2s infinite;
		}
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		50% {
			transform: translateY(-6px);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}
</style>
