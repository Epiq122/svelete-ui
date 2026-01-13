<script lang="ts">
	import { Plus, Shuffle, ArrowUp, ArrowDown, X } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	type Movie = {
		id: string;
		title: string;
		year: number;
		genre: string;
	};

	let movies = $state<Movie[]>([
		{ id: 'm1', title: 'Die Hard', year: 1988, genre: 'Action' },
		{ id: 'm2', title: 'Terminator 2: Judgment Day', year: 1991, genre: 'Sci-Fi Action' },
		{ id: 'm3', title: 'The Matrix', year: 1999, genre: 'Sci-Fi Action' },
		{ id: 'm4', title: 'Lethal Weapon', year: 1987, genre: 'Action' }
	]);

	let newTitle = $state('');

	function addMovie() {
		if (newTitle.trim().length < 2) return;

		movies.unshift({
			id: crypto.randomUUID(),
			title: newTitle.trim(),
			year: new Date().getFullYear(),
			genre: 'Drama'
		});

		newTitle = '';
	}

	function move(id: string, direction: -1 | 1) {
		const i = movies.findIndex((m) => m.id === id);
		const j = i + direction;

		if (i < 0 || j < 0 || j >= movies.length) return;

		// swap elements
		const copy = movies.slice();
		[copy[i], copy[j]] = [copy[j], copy[i]];
		movies = copy;
	}

	function remove(id: string) {
		movies = movies.filter((m) => m.id != id);
	}

	function shuffle() {
		// fisher yates shuffle
		const copy = movies.slice();
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		movies = copy;
	}

	function sortByTitle() {
		movies = movies.slice().sort((a, b) => a.title.localeCompare(b.title));
	}

	function sortByYear() {
		movies = movies.slice().sort((a, b) => a.year - b.year);
	}
</script>

<section data-theme="synthwave" class="bg-neutral text-neutral-content space-y-6 rounded-xl p-6">
	<header class="border-primary/40 border-b pb-4">
		<h2 class="text-primary text-3xl font-extrabold tracking-widest">ANIMATED GALLERY</h2>
		<p class="text-secondary/80 mt-1 text-sm">Keyed FLIP animations. Immediate child only.</p>
	</header>

	<form
		class="flex gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			addMovie();
		}}
	>
		<input
			class="input input-bordered text-primary placeholder:text-secondary/50 focus:border-primary flex-1 bg-black/40 focus:outline-none"
			placeholder="ENTER MOVIE TITLE"
			bind:value={newTitle}
			aria-label="New movie title"
		/>
		<button
			type="submit"
			class="btn btn-primary btn-square disabled:opacity-40"
			disabled={newTitle.trim().length < 2}
		>
			<Plus size={18} />
		</button>
	</form>

	<div class="border-primary/30 flex items-center gap-1 rounded-lg border bg-black/50 p-1">
		<button class="btn btn-xs btn-primary gap-1 tracking-wide" onclick={shuffle}>
			<Shuffle size={14} />
			SHUFFLE
		</button>

		<div class="bg-primary/30 mx-1 h-5 w-px"></div>

		<button class="btn btn-xs btn-ghost text-secondary hover:bg-secondary/20" onclick={sortByTitle}>
			TITLE
		</button>

		<button class="btn btn-xs btn-ghost text-secondary hover:bg-secondary/20" onclick={sortByYear}>
			YEAR
		</button>
	</div>

	<div class="grid gap-3">
		{#each movies as movie (movie.id)}
			<div
				animate:flip={{ duration: 300, easing: quintOut }}
				class="border-primary/30 rounded-lg border bg-black/40 shadow-inner"
			>
				<div class="flex items-center justify-between gap-4 p-4">
					<div class="min-w-0">
						<h3 class="text-primary truncate font-bold tracking-wide">
							{movie.title}
						</h3>
						<p class="text-secondary text-xs">
							{movie.year} • {movie.genre}
						</p>
					</div>

					<div class="flex gap-1">
						<button
							class="btn btn-xs btn-ghost text-primary"
							onclick={() => move(movie.id, -1)}
							disabled={movies[0].id === movie.id}
						>
							<ArrowUp size={14} />
						</button>

						<button
							class="btn btn-xs btn-ghost text-primary"
							onclick={() => move(movie.id, 1)}
							disabled={movies[movies.length - 1].id === movie.id}
						>
							<ArrowDown size={14} />
						</button>

						<button class="btn btn-xs btn-ghost text-error" onclick={() => remove(movie.id)}>
							<X size={14} />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
