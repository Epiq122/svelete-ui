<script lang="ts">
	import { formatTime } from '$lib/utils/formatTime';
	import { Play, Pause, Volume2, VolumeX } from 'lucide-svelte';

	let {
		src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		title = 'Sample Video'
	}: {
		src?: string;
		title?: string;
	} = $props();

	let video = $state<HTMLVideoElement>();

	let paused = $state(true);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(1);
	let muted = $state(false);

	function togglePlay() {
		if (!video) return;
		if (paused) {
			video.play();
		} else {
			video.pause();
		}
	}

	function toggleMute() {
		muted = !muted;
	}

	const currentLabel = $derived(formatTime(currentTime));
	const durationLabel = $derived(formatTime(duration));
</script>

<div class="space-y-4">
	<header>
		<h2 class="mb-3 text-2xl font-bold">Video Player</h2>
		<p class="opactity-70 text-sm">Two-way binding keep UI and video in sync automatically.</p>
	</header>

	<div class="card bg-black/50 shadow-xl">
		<div class="card-body p-4">
			<div class="aspect-video overflow-hidden rounded-lg bg-black/50">
				<video
					bind:this={video}
					bind:currentTime
					bind:paused
					bind:duration
					bind:volume
					bind:muted
					class="h-full w-full"
					preload="metadata"
					{src}
				>
					<track kind="captions" label="English" />
				</video>
			</div>

			<!-- controls -->
			<div class="space-y-3">
				<input
					type="range"
					min="0"
					max={duration || 0}
					bind:value={currentTime}
					class="range range-primary range-xs"
					aria-label="Video Progress"
				/>

				<!-- control bar -->
				<div class="flex items-center justify-between gap-4">
					<button class="btn btn-circle btn-sm btn-primary" onclick={togglePlay}>
						{#if paused}
							<Play size={16} />
						{:else}
							<Pause size={16} />
						{/if}
					</button>

					<span class="font-mono text-sm">
						{currentLabel} / {durationLabel}
					</span>

					<div class="flex items-center gap-2">
						<button
							class="btn btn-square btn-ghost btn-sm"
							onclick={toggleMute}
							aria-label={muted ? 'Unmute' : 'Mute'}
						>
							{#if muted}<VolumeX size={16} />
							{:else}
								<Volume2 size={16} />
							{/if}
						</button>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							bind:value={volume}
							class="range w-24 range-xs"
							disabled={muted}
							aria-label="Volume"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
