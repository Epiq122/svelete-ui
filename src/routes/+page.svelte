<script lang="ts">
	import AnimatedGallery from '$lib/components/AnimatedGallery.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';

	let activeTab = $state('gallery' as 'gallery' | 'video');
</script>

<svelte:head>
	<title>EpiqFlow UI Studio</title>
</svelte:head>

<div class="container mx-auto max-w-6xl space-y-6 px-4 py-6">
	<header>
		<h1 class="mb-2 text-3xl font-bold">EpiqFlow Ui Studio</h1>
		<p class="text-lg opacity-70">Reusable actions, smooth animations, and media controls.</p>
	</header>

	<div class="tabs-boxed tabs">
		<button
			class="tab"
			class:tab-active={activeTab === 'gallery'}
			onclick={() => (activeTab = 'gallery')}
		>
			Animanted Gallery
		</button>
		<button
			class="tab"
			class:tab-active={activeTab === 'video'}
			onclick={() => (activeTab = 'video')}>Video Player</button
		>
	</div>

	<div class="card border border-base-300 bg-base-100 shadow-xl">
		<div class="card-body">
			{#if activeTab === 'gallery'}
				<AnimatedGallery />
			{:else}
				<VideoPlayer />
			{/if}
		</div>
	</div>
</div>
