# FilmFlow Universe – Project 2: UI Patterns & Reusable Actions
## Animated Gallery + Media Player

**Tech Stack:** Svelte 5.45 · SvelteKit · TypeScript (strict) · Tailwind 4 · DaisyUI · Vitest  
**Edition:** Fixed & Job-Ready

---

## 📋 What You're Building

A **mini UI studio** that teaches patterns you'll use in every real job:
- **Reusable actions** (clickOutside, longpress, tooltip)
- **FLIP animations** (smooth list reordering)
- **Media bindings** (video player controls)
- **Component testing** (Vitest basics)
- **Error boundaries** (graceful failures)

**What's different from Project 1:**
- P1: You learned local state in one component
- P2: You learn **reusable behaviors** that work across components

---

## 🎯 Project Goals

### You Will Build

1. **Actions Library**
   - `clickOutside` - Close dropdowns/modals
   - `longpress` - Context menus on mobile
   - `tooltip` - Wrap tippy.js cleanly

2. **Animated Movie Gallery**
   - Smooth reordering with FLIP
   - Add/remove with animations
   - Sort and shuffle

3. **Video Player**
   - Two-way media bindings
   - Custom controls
   - Time formatting

4. **Testing Setup**
   - Vitest configuration
   - First action test
   - Component testing basics

### What "Job-Ready" Means

- ✅ Full TypeScript strict mode
- ✅ ESLint + Prettier configured
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Tests passing
- ✅ No console errors
- ✅ Deployable to Vercel/Netlify

---

## 🧠 Concepts Covered

### From Project 1 (Prerequisites)
- `$state`, `$derived`, `$effect`
- Component props & callbacks
- Basic event handling
- Forms & validation

### New in Project 2
- **Actions** - Reusable DOM behaviors
- **FLIP animations** - Position transitions
- **Media bindings** - Video/audio control
- **Error boundaries** - Isolated failures
- **Testing** - Vitest + component tests

---

## 📚 Concept Deep Dive

### Prerequisites Check

**Before starting Project 2, make sure you understand from Project 1:**
- [ ] `$state` - Reactive state variables
- [ ] `$derived` - Computed values
- [ ] `$effect` - Side effects after rendering
- [ ] Component props with `$props()`
- [ ] Event handlers with `onclick=`
- [ ] Conditional rendering with `{#if}`
- [ ] Lists with `{#each items as item (item.id)}`

**If any of these are unclear, review Project 1 first!**

---

### 1. Actions (The Core Pattern)

**What they are:**
Functions that attach behavior to DOM elements with lifecycle management.

```svelte
<div use:clickOutside onclickoutside={handler}>
  Dropdown content
</div>
```

**Why they matter:**
- Reusable across projects
- Testable in isolation
- Prevent duplicated code
- Clean up automatically

**When to use:**
- Click outside detection
- Long press gestures
- Third-party library wrappers
- Focus trapping
- Intersection observers

**When NOT to use:**
- Simple onclick handlers (overkill)
- Component-specific logic (keep in component)
- Complex state management (use stores/context)

---

### 2. FLIP Animations

**FLIP = First, Last, Invert, Play**

Svelte's `animate:flip` handles this automatically:
1. **F**irst: Record element's starting position
2. **L**ast: Element moves to new position
3. **I**nvert: Transform to look like it's still at First
4. **P**lay: Animate from Inverted to Last

**Critical requirements:**
```svelte
<!-- ✅ CORRECT -->
{#each items as item (item.id)}
  <div animate:flip>content</div>
{/each}

<!-- ❌ WRONG: No key -->
{#each items as item}
  <div animate:flip>content</div>
{/each}

<!-- ❌ WRONG: Wrapper between each and animate -->
{#each items as item (item.id)}
  <div class="wrapper">
    <div animate:flip>content</div>
  </div>
{/each}
```

---

### 3. Media Bindings

**Two-way reactive bindings for video/audio:**

```svelte
<video
  bind:paused
  bind:currentTime
  bind:duration
  bind:volume
>
```

**Why this is powerful:**
- Video pauses → `paused` updates → UI updates
- User drags slider → `currentTime` updates → video seeks
- No manual event listeners needed
- Always in sync

---

### 4. Error Boundaries

**Isolate component failures:**

```svelte
<svelte:boundary onerror={(e) => console.error(e)}>
  {#snippet failed(error)}
    <ErrorUI {error} />
  {/snippet}
  
  <RiskyComponent />
</svelte:boundary>
```

**What they catch:**
- ✅ Render errors
- ✅ Effect errors

**What they DON'T catch:**
- ❌ Event handler errors (use try/catch)
- ❌ Async errors (use try/catch)

---

## 📝 Notes to Write Down (Project 2 Rules)

**Create a "Project 2 - Actions & Animations" section in your notes:**

### Actions
1. **Actions are for DOM behaviors** - If it touches the DOM directly, it's probably an action
2. **Always return destroy()** - Memory leaks happen when you forget cleanup
3. **Use capture phase (true)** - Ensures you run before child handlers
4. **Wrap third-party libraries** - One action = one source of truth
5. **Test actions in isolation** - They're pure functions, easy to test

### FLIP Animations
1. **Keyed {#each} is mandatory** - `{#each items as item (item.id)}`
2. **animate:flip on immediate child** - No wrappers between {#each} and animated element
3. **Stable IDs required** - Never use array index as key
4. **Duration affects UX** - 200-400ms feels natural, >500ms feels slow
5. **Easing matters** - quintOut/cubicOut feel more natural than linear

### Media Bindings
1. **bind: creates two-way sync** - Video updates UI, UI updates video
2. **Read-only bindings exist** - duration, buffered (can't be set)
3. **Read-write bindings** - paused, currentTime, volume, muted
4. **Always check isFinite()** - duration can be NaN before metadata loads
5. **Use formatTime() utility** - Keep time formatting pure and testable

### Testing
1. **Test actions first** - Easiest to test, no UI needed
2. **Test utilities next** - Pure functions = easy tests
3. **Test components last** - More complex, but still doable
4. **Use describe/it/expect** - Industry standard pattern
5. **Cleanup after each test** - Prevents test pollution

### TypeScript
1. **Action types need 3 generics** - Element, Params, Events
2. **Event names match handlers** - `onclickoutside` not `'onclickoutside'`
3. **Use CustomEvent<T>** - Type the event detail properly
4. **strict: true catches bugs** - Don't turn it off because it's "hard"
5. **Generated types are your friend** - SvelteKit creates `./$types`

**Write these down before you start coding!**

---

## 🚀 Complete Setup

### Step 1: Project Initialization

```bash
# Start from your Project 1 or create new
cd filmflow-p1-watchlist
# OR create new:
npx sv create filmflow-p2-ui-studio
cd filmflow-p2-ui-studio
```

### Step 2: Install Dependencies

```bash
# Core dependencies (should already have from P1)
npm install

# Actions library
npm install tippy.js

# Testing
npm install -D vitest @vitest/ui
npm install -D @testing-library/svelte@latest
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jsdom
npm install -D happy-dom

# Icons
npm install lucide-svelte

# ESLint + Prettier (if not already installed)
npm install -D eslint prettier
npm install -D eslint-plugin-svelte
npm install -D @typescript-eslint/eslint-plugin
npm install -D @typescript-eslint/parser
npm install -D eslint-config-prettier
npm install -D prettier-plugin-svelte

# TypeScript types
npm install -D @types/node
```

### Step 3: TypeScript Configuration

**Create/update `tsconfig.json`:**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["vitest/globals"]
  }
}
```

**Why these settings:**
- `strict: true` - Catch bugs TypeScript can find
- `types: ["vitest/globals"]` - Allow `describe`, `it`, `expect`
- `skipLibCheck: true` - Speed up builds

---

### Step 4: Vitest Configuration

**Create `vitest.config.ts`:**

```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
```

**Create `vitest.setup.ts`:**

```typescript
import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**Why this config:**
- Uses `sveltekit()` plugin for proper SvelteKit integration
- `globals: true` - Use `describe`, `it`, `expect` without imports
- `jsdom` - Browser-like environment for component testing
- `setupFiles` - Runs before each test file

---

### Step 5: ESLint Configuration

**Create `.eslintrc.cjs`:**

```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ]
};
```

---

### Step 6: Prettier Configuration

**Create `.prettierrc`:**

```json
{
  "useTabs": true,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

---

### Step 7: Update package.json Scripts

**Add these scripts to your `package.json`:**

```json
{
  "name": "filmflow-p2-ui-studio",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/svelte": "^5.0.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "daisyui": "^4.6.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-svelte": "^2.35.1",
    "happy-dom": "^12.10.3",
    "jsdom": "^23.0.1",
    "prettier": "^3.1.1",
    "prettier-plugin-svelte": "^3.1.2",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.0",
    "vitest": "^1.1.0",
    "@vitest/ui": "^1.1.0"
  },
  "dependencies": {
    "lucide-svelte": "^0.303.0",
    "tippy.js": "^6.3.7"
  },
  "type": "module"
}
```

**Key versions to note:**
- Svelte 5.0+ (runes support)
- SvelteKit 2.0+ (latest)
- Tailwind 4.0+ (new features)
- Vitest 1.0+ (stable API)

---

### Step 8: VS Code Settings

**Create `.vscode/settings.json`:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── actions/
│   │   ├── clickOutside.svelte.ts
│   │   ├── clickOutside.test.ts        ← NEW: Testing!
│   │   ├── longpress.svelte.ts
│   │   └── tooltip.svelte.ts
│   ├── components/
│   │   ├── AnimatedGallery.svelte
│   │   ├── AnimatedGallery.test.ts     ← NEW: Testing!
│   │   └── VideoPlayer.svelte
│   └── utils/
│       └── formatTime.ts
├── routes/
│   └── studio/
│       └── +page.svelte
└── app.css
```

---

## 🔨 Build Phase 1: Actions

### File 1: `src/lib/actions/clickOutside.svelte.ts`

**Teaching Goals:**
- Understand action lifecycle (setup → destroy)
- Learn capture phase event handling
- Practice TypeScript for actions
- See why cleanup is mandatory

**Production Pattern:**
- Centralize click-outside logic in ONE place
- Use composedPath() for portal/shadow DOM support
- Always remove event listeners in destroy()

```typescript
import type { Action } from 'svelte/action';

/**
 * Action: clickOutside
 * 
 * Fires 'clickoutside' event when user clicks outside the element.
 * 
 * Common uses:
 * - Close dropdowns
 * - Dismiss modals
 * - Hide popovers
 * 
 * Why this pattern:
 * - Reusable across all FilmFlow projects
 * - Handles edge cases (portals, shadow DOM)
 * - Cleans up automatically
 */

// FIXED: Remove quotes from event name
export type ClickOutsideEvents = {
	onclickoutside: (e: CustomEvent<{ originalEvent: PointerEvent }>) => void;
};

export const clickOutside: Action<
	HTMLElement,
	undefined,
	ClickOutsideEvents
> = (node) => {
	function onPointerDown(e: PointerEvent) {
		// composedPath() returns array of all elements from target to window
		// This handles:
		// - Portaled elements (modals in document.body)
		// - Shadow DOM elements
		// - Nested components
		if (!e.composedPath().includes(node)) {
			// Dispatch custom event that components can listen to
			node.dispatchEvent(
				new CustomEvent('clickoutside', {
					detail: { originalEvent: e }
				})
			);
		}
	}

	// Capture phase (true) ensures we run BEFORE child handlers
	// This prevents child elements from stopPropagation() blocking us
	document.addEventListener('pointerdown', onPointerDown, true);

	return {
		destroy() {
			// CRITICAL: Remove listener when element unmounts
			// Forgetting this causes memory leaks
			document.removeEventListener('pointerdown', onPointerDown, true);
		}
	};
};
```

**Usage Example:**
```svelte
<script lang="ts">
  import { clickOutside } from '$lib/actions/clickOutside.svelte';
  
  let open = $state(false);
</script>

<div use:clickOutside onclickoutside={() => open = false}>
  <button onclick={() => open = !open}>Toggle</button>
  {#if open}
    <div class="dropdown">Content</div>
  {/if}
</div>
```

---

### File 2: `src/lib/actions/clickOutside.test.ts`

**Teaching Goals:**
- Learn Vitest basics
- Test actions in isolation
- Practice test-driven development

```typescript
import { describe, it, expect, vi } from 'vitest';
import { clickOutside } from './clickOutside.svelte';

describe('clickOutside action', () => {
	it('should call handler when clicking outside element', () => {
		// Setup: Create element and mock handler
		const element = document.createElement('div');
		document.body.appendChild(element);
		
		const handler = vi.fn();
		element.addEventListener('clickoutside', handler);
		
		// Mount action
		const action = clickOutside(element);
		
		// Act: Click outside element
		const outsideClick = new PointerEvent('pointerdown', {
			bubbles: true,
			composed: true
		});
		document.body.dispatchEvent(outsideClick);
		
		// Assert: Handler was called
		expect(handler).toHaveBeenCalledOnce();
		
		// Cleanup
		action?.destroy?.();
		element.remove();
	});
	
	it('should NOT call handler when clicking inside element', () => {
		const element = document.createElement('div');
		document.body.appendChild(element);
		
		const handler = vi.fn();
		element.addEventListener('clickoutside', handler);
		
		const action = clickOutside(element);
		
		// Click inside element
		const insideClick = new PointerEvent('pointerdown', {
			bubbles: true,
			composed: true
		});
		element.dispatchEvent(insideClick);
		
		// Should NOT have been called
		expect(handler).not.toHaveBeenCalled();
		
		action?.destroy?.();
		element.remove();
	});
	
	it('should cleanup event listener on destroy', () => {
		const element = document.createElement('div');
		document.body.appendChild(element);
		
		const action = clickOutside(element);
		const spy = vi.spyOn(document, 'removeEventListener');
		
		// Destroy action
		action?.destroy?.();
		
		// Should have removed listener
		expect(spy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true);
		
		element.remove();
		spy.mockRestore();
	});
});
```

**Run tests:**
```bash
npm test
```

---

### File 3: `src/lib/actions/longpress.svelte.ts`

**Teaching Goals:**
- Learn timer management patterns
- Understand all PointerEvent states
- Practice update() method for params

```typescript
import type { Action } from 'svelte/action';

/**
 * Action: longpress
 * 
 * Fires 'longpress' event when user holds pointer down for X ms.
 * 
 * Common uses:
 * - Context menus on mobile
 * - Delete confirmations
 * - Alternative to right-click
 * 
 * Why PointerEvent:
 * - Unifies mouse, touch, and pen input
 * - Better than separate MouseEvent/TouchEvent
 * - Future-proof for new input devices
 */

export type LongpressParams = {
	ms?: number;
};

export type LongpressEvents = {
	onlongpress: (e: CustomEvent<{ pointerType: string }>) => void;
};

export const longpress: Action<
	HTMLElement,
	LongpressParams,
	LongpressEvents
> = (node, params) => {
	let timer: number | null = null;
	let ms = params?.ms ?? 600;

	function clear() {
		if (timer !== null) clearTimeout(timer);
		timer = null;
	}

	function start(e: PointerEvent) {
		clear();
		
		// Prevent text selection during long press
		node.style.userSelect = 'none';

		timer = window.setTimeout(() => {
			node.dispatchEvent(
				new CustomEvent('longpress', {
					detail: {
						// 'mouse' | 'touch' | 'pen'
						pointerType: e.pointerType
					}
				})
			);
			clear();
		}, ms);
	}

	function stop() {
		// Restore text selection
		node.style.userSelect = '';
		clear();
	}

	// Listen to ALL pointer lifecycle events
	node.addEventListener('pointerdown', start);
	node.addEventListener('pointerup', stop);
	node.addEventListener('pointercancel', stop); // System interruption
	node.addEventListener('pointerleave', stop);  // Moved outside element

	return {
		update(next) {
			// Called when params change
			ms = next?.ms ?? 600;
		},
		destroy() {
			// Clean up ALL listeners
			node.removeEventListener('pointerdown', start);
			node.removeEventListener('pointerup', stop);
			node.removeEventListener('pointercancel', stop);
			node.removeEventListener('pointerleave', stop);
			clear();
		}
	};
};
```

---

### File 4: `src/lib/actions/tooltip.svelte.ts`

**Teaching Goals:**
- Learn third-party library wrapping
- Understand instance lifecycle
- Practice defensive programming

```typescript
import type { Action } from 'svelte/action';
import tippy, { type Instance, type Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

/**
 * Action: tooltip
 * 
 * Wraps tippy.js for consistent tooltip behavior.
 * 
 * Why wrap libraries as actions:
 * - Centralize configuration
 * - Ensure cleanup happens
 * - Make testing easier
 * - Update all tooltips in one place
 */

export type TooltipParams = {
	content: string;
	placement?: Props['placement'];
};

export const tooltip: Action<HTMLElement, TooltipParams> = (node, params) => {
	let instance: Instance | null = null;

	function setup(p: TooltipParams) {
		// Destroy old instance if exists
		instance?.destroy();
		
		instance = tippy(node, {
			content: p.content,
			placement: p.placement ?? 'top',
			// Add more options as needed:
			// animation: 'fade',
			// delay: [200, 0],
			// arrow: true
		});
	}

	setup(params);

	return {
		update(next) {
			setup(next);
		},
		destroy() {
			instance?.destroy();
		}
	};
};
```

---

## 🔨 Build Phase 2: Animated Gallery

### File 5: `src/lib/components/AnimatedGallery.svelte`

**Teaching Goals:**
- Master FLIP animation requirements
- Practice array mutations with Svelte 5
- Learn keyed each blocks
- Understand immediate child rule

```svelte
<script lang="ts">
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { ArrowUp, ArrowDown, Shuffle, Plus, X } from 'lucide-svelte';

	/**
	 * Animated Gallery Component
	 * 
	 * Demonstrates:
	 * - FLIP animations (smooth position changes)
	 * - Keyed each blocks (required for animations)
	 * - Direct array mutations (Svelte 5 style)
	 * - Accessible controls
	 * 
	 * FLIP Requirements:
	 * 1. Keyed {#each}: {#each items as item (item.id)}
	 * 2. animate:flip on IMMEDIATE child of {#each}
	 * 3. Stable IDs (don't use array index!)
	 */

	type Movie = {
		id: string;
		title: string;
		year: number;
		genre: string;
	};

	// Svelte 5: Direct mutations are reactive
	let movies = $state<Movie[]>([
		{ id: 'm1', title: 'Nebula Heist', year: 2024, genre: 'Sci-Fi' },
		{ id: 'm2', title: 'Glass Harbor', year: 2023, genre: 'Drama' },
		{ id: 'm3', title: 'Signal Runner', year: 2025, genre: 'Thriller' },
		{ id: 'm4', title: 'Midnight Archive', year: 2022, genre: 'Mystery' }
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
		
		// Bounds check
		if (i < 0 || j < 0 || j >= movies.length) return;

		// Swap elements
		const copy = movies.slice();
		[copy[i], copy[j]] = [copy[j], copy[i]];
		movies = copy;
	}

	function remove(id: string) {
		movies = movies.filter((m) => m.id !== id);
	}

	function shuffle() {
		// Fisher-Yates shuffle
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

<section class="space-y-4">
	<header>
		<h2 class="text-2xl font-bold mb-2">Animated Gallery</h2>
		<p class="text-sm opacity-70">
			FLIP animations require keyed #each blocks. The animated element must be the immediate child.
		</p>
	</header>

	<!-- Add Movie Form -->
	<form class="flex gap-2" onsubmit={(e) => { e.preventDefault(); addMovie(); }}>
		<input
			class="input input-bordered flex-1"
			placeholder="Movie title..."
			bind:value={newTitle}
			aria-label="New movie title"
		/>
		<button
			type="submit"
			class="btn btn-primary"
			disabled={newTitle.trim().length < 2}
		>
			<Plus size={16} />
			Add
		</button>
	</form>

	<!-- Controls -->
	<div class="flex gap-2 flex-wrap">
		<button class="btn btn-sm btn-primary" onclick={shuffle}>
			<Shuffle size={16} />
			Shuffle
		</button>
		<button class="btn btn-sm btn-outline" onclick={sortByTitle}>
			Sort by Title
		</button>
		<button class="btn btn-sm btn-outline" onclick={sortByYear}>
			Sort by Year
		</button>
	</div>

	<!-- Movie List -->
	<div class="grid gap-3">
		<!--
			CRITICAL PATTERN:
			1. Keyed each: (movie.id) tells Svelte which element is which
			2. animate:flip goes on IMMEDIATE child
			3. No wrapper between {#each} and animated element
		-->
		{#each movies as movie (movie.id)}
			<div
				animate:flip={{ duration: 300, easing: quintOut }}
				class="card bg-base-100 shadow-sm border border-base-300"
			>
				<div class="card-body p-4 flex-row items-center justify-between gap-4">
					<div class="flex-1 min-w-0">
						<h3 class="font-semibold truncate">{movie.title}</h3>
						<p class="text-sm opacity-70">
							{movie.year} · {movie.genre}
						</p>
					</div>

					<div class="flex gap-1">
						<button
							class="btn btn-sm btn-circle btn-ghost"
							onclick={() => move(movie.id, -1)}
							disabled={movies[0].id === movie.id}
							aria-label="Move {movie.title} up"
						>
							<ArrowUp size={16} />
						</button>
						<button
							class="btn btn-sm btn-circle btn-ghost"
							onclick={() => move(movie.id, 1)}
							disabled={movies[movies.length - 1].id === movie.id}
							aria-label="Move {movie.title} down"
						>
							<ArrowDown size={16} />
						</button>
						<button
							class="btn btn-sm btn-circle btn-ghost text-error"
							onclick={() => remove(movie.id)}
							aria-label="Remove {movie.title}"
						>
							<X size={16} />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<!--
	DEBUGGING FLIP ANIMATIONS:
	
	Problem: Animations don't work
	Solutions:
	1. Check for key: {#each items as item (item.id)}
	2. Check animate:flip is on immediate child
	3. Check IDs are stable (not array index)
	
	Problem: Animations are jerky
	Solutions:
	1. Reduce duration (try 200ms)
	2. Try different easing (quintOut, cubicOut)
	3. Check for layout shifts during animation
-->
```

---

### File 6: `src/lib/components/AnimatedGallery.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AnimatedGallery from './AnimatedGallery.svelte';

describe('AnimatedGallery', () => {
	it('should render movie list', () => {
		const { getByText } = render(AnimatedGallery);
		
		// Check initial movies are rendered
		expect(getByText('Nebula Heist')).toBeTruthy();
		expect(getByText('Glass Harbor')).toBeTruthy();
	});
	
	it('should have accessible controls', () => {
		const { getByLabelText } = render(AnimatedGallery);
		
		// Check ARIA labels exist
		expect(getByLabelText('New movie title')).toBeTruthy();
	});
});
```

---

## 🔨 Build Phase 3: Video Player

### File 7: `src/lib/utils/formatTime.ts`

```typescript
/**
 * Format seconds to MM:SS
 * 
 * Pure function: easy to test, no side effects
 */
export function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) {
		return '0:00';
	}
	
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

### File 8: `src/lib/utils/formatTime.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
	it('should format seconds correctly', () => {
		expect(formatTime(0)).toBe('0:00');
		expect(formatTime(30)).toBe('0:30');
		expect(formatTime(90)).toBe('1:30');
		expect(formatTime(3661)).toBe('61:01');
	});
	
	it('should handle edge cases', () => {
		expect(formatTime(NaN)).toBe('0:00');
		expect(formatTime(Infinity)).toBe('0:00');
		expect(formatTime(-10)).toBe('0:00');
	});
});
```

---

### File 9: `src/lib/components/VideoPlayer.svelte`

**Teaching Goals:**
- Master two-way media bindings
- Learn video element API
- Practice accessible controls
- Understand binding patterns

```svelte
<script lang="ts">
	import { Play, Pause, Volume2, VolumeX } from 'lucide-svelte';
	import { formatTime } from '$lib/utils/formatTime';

	/**
	 * Video Player Component
	 * 
	 * Demonstrates:
	 * - Two-way media bindings (bind:paused, bind:currentTime)
	 * - Video element API
	 * - Accessible custom controls
	 * - Reactive UI updates
	 * 
	 * Media Bindings (Two-Way):
	 * - bind:paused - Play/pause state
	 * - bind:currentTime - Playback position (seekable)
	 * - bind:duration - Video length (read-only)
	 * - bind:volume - Volume level (0.0 to 1.0)
	 * - bind:muted - Mute state
	 */

	let {
		src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		title = 'Sample Video'
	}: {
		src?: string;
		title?: string;
	} = $props();

	// Video element reference
	let video = $state<HTMLVideoElement>();

	// Bound state (two-way reactive)
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

	// Derived labels
	const currentLabel = $derived(formatTime(currentTime));
	const durationLabel = $derived(formatTime(duration));
</script>

<section class="space-y-4">
	<header>
		<h2 class="text-2xl font-bold mb-2">Video Player</h2>
		<p class="text-sm opacity-70">
			Two-way bindings keep UI and video in sync automatically.
		</p>
	</header>

	<div class="card bg-base-200 shadow-xl">
		<div class="card-body p-4">
			<!-- Video Element -->
			<div class="aspect-video bg-black rounded-lg overflow-hidden">
				<video
					bind:this={video}
					bind:paused
					bind:currentTime
					bind:duration
					bind:volume
					bind:muted
					{src}
					class="w-full h-full"
					preload="metadata"
				>
					<track kind="captions" label="English" />
				</video>
			</div>

			<!-- Controls -->
			<div class="space-y-3">
				<!-- Progress Bar -->
				<input
					type="range"
					min="0"
					max={duration || 0}
					bind:value={currentTime}
					class="range range-xs range-primary"
					aria-label="Video progress"
				/>

				<!-- Control Bar -->
				<div class="flex items-center justify-between gap-4">
					<!-- Play/Pause -->
					<button
						class="btn btn-sm btn-circle btn-primary"
						onclick={togglePlay}
						aria-label={paused ? 'Play video' : 'Pause video'}
					>
						{#if paused}
							<Play size={16} />
						{:else}
							<Pause size={16} />
						{/if}
					</button>

					<!-- Time Display -->
					<span class="text-sm font-mono">
						{currentLabel} / {durationLabel}
					</span>

					<div class="flex-1"></div>

					<!-- Volume -->
					<div class="flex items-center gap-2">
						<button
							class="btn btn-sm btn-ghost btn-square"
							onclick={toggleMute}
							aria-label={muted ? 'Unmute' : 'Mute'}
						>
							{#if muted}
								<VolumeX size={16} />
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
							class="range range-xs w-24"
							disabled={muted}
							aria-label="Volume"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!--
	MEDIA BINDING TIPS:
	
	Two-way bindings mean:
	- Video plays → paused becomes false → UI updates
	- User drags slider → currentTime changes → video seeks
	- Always in sync, no manual listeners needed
	
	Common Issues:
	1. Progress bar jumps: Use bind:value not value=
	2. Play button doesn't update: Use bind:paused
	3. Video doesn't seek: Check duration > 0
-->
```

---

## 🔨 Build Phase 4: Main Page

### File 10: `src/routes/studio/+page.svelte`

```svelte
<script lang="ts">
	import AnimatedGallery from '$lib/components/AnimatedGallery.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';

	let activeTab = $state<'gallery' | 'video'>('gallery');
</script>

<svelte:head>
	<title>FilmFlow UI Studio</title>
</svelte:head>

<div class="container mx-auto px-4 py-6 max-w-6xl space-y-6">
	<header>
		<h1 class="text-3xl font-bold mb-2">🎬 FilmFlow UI Studio</h1>
		<p class="text-lg opacity-70">
			Reusable actions, smooth animations, and media controls.
		</p>
	</header>

	<!-- Tabs -->
	<div class="tabs tabs-boxed">
		<button
			class="tab"
			class:tab-active={activeTab === 'gallery'}
			onclick={() => (activeTab = 'gallery')}
		>
			Animated Gallery
		</button>
		<button
			class="tab"
			class:tab-active={activeTab === 'video'}
			onclick={() => (activeTab = 'video')}
		>
			Video Player
		</button>
	</div>

	<!-- Tab Content -->
	<div class="card bg-base-100 shadow-xl border border-base-300">
		<div class="card-body">
			{#if activeTab === 'gallery'}
				<AnimatedGallery />
			{:else}
				<VideoPlayer />
			{/if}
		</div>
	</div>

	<!-- Learning Notes -->
	<div class="card bg-base-200">
		<div class="card-body">
			<h3 class="card-title text-lg">📚 What You Learned</h3>
			{#if activeTab === 'gallery'}
				<ul class="list-disc list-inside space-y-1 text-sm opacity-80">
					<li><strong>FLIP animations</strong> - Smooth position transitions</li>
					<li><strong>Keyed each blocks</strong> - Required for animations</li>
					<li><strong>Direct mutations</strong> - Svelte 5 reactivity</li>
					<li><strong>Accessible controls</strong> - ARIA labels</li>
				</ul>
			{:else}
				<ul class="list-disc list-inside space-y-1 text-sm opacity-80">
					<li><strong>Media bindings</strong> - bind:paused, bind:currentTime</li>
					<li><strong>Two-way sync</strong> - UI ↔ video always in sync</li>
					<li><strong>Custom controls</strong> - Native functionality preserved</li>
					<li><strong>Pure utilities</strong> - formatTime() is testable</li>
				</ul>
			{/if}
		</div>
	</div>
</div>
```

---

## ✅ Verification Checklist

### Functionality
- [ ] Click outside closes dropdown
- [ ] Long press triggers context menu
- [ ] Animations work when reordering
- [ ] Video plays/pauses correctly
- [ ] Progress bar seeks video
- [ ] Volume controls work
- [ ] All tests pass (`npm test`)

### Accessibility
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works
- [ ] Focus visible on all controls
- [ ] Error messages announced to screen readers

### Code Quality
- [ ] No TypeScript errors (`npm run check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] All tests passing (`npm test:run`)

---

## ✅ Project 2 Completion Checklist

**Before moving to Project 3, verify you can:**

### Concepts
- [ ] Explain what an action is and when to use one
- [ ] Describe the action lifecycle (setup → update → destroy)
- [ ] Explain why FLIP animations need keyed {#each} blocks
- [ ] Understand two-way binding with media elements
- [ ] Know difference between render errors and event handler errors

### Skills
- [ ] Write a custom action with proper cleanup
- [ ] Create smooth FLIP animations
- [ ] Build accessible video controls
- [ ] Write tests for actions and utilities
- [ ] Debug "animations not working" issues

### Code Quality
- [ ] All tests pass (`npm test:run`)
- [ ] No TypeScript errors (`npm run check`)
- [ ] No linting warnings (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Application runs (`npm run dev`)

### Understanding
- [ ] Can explain to someone else how actions work
- [ ] Know when to use actions vs components
- [ ] Understand why cleanup is mandatory
- [ ] Can debug FLIP animation issues
- [ ] Know how media bindings stay in sync

**If you can check all these boxes, you're ready for Project 3!** 🎉

---

## 🎓 Key Takeaways

### Actions Pattern
```typescript
// ✅ DO: Create reusable actions
export const myAction: Action = (node) => {
  // Setup
  node.addEventListener('event', handler);
  
  return {
    destroy() {
      // ALWAYS clean up
      node.removeEventListener('event', handler);
    }
  };
};

// ❌ DON'T: Scatter listeners across components
```

### FLIP Animations
```svelte
<!-- ✅ DO: Key + immediate child -->
{#each items as item (item.id)}
  <div animate:flip>content</div>
{/each}

<!-- ❌ DON'T: Missing key or wrapper -->
{#each items as item}
  <div animate:flip>content</div>
{/each}
```

### Media Bindings
```svelte
<!-- ✅ DO: Use bind for two-way sync -->
<video bind:paused bind:currentTime />

<!-- ❌ DON'T: Manual event listeners -->
<video on:play={() => paused = false} />
```

---

## 🚀 Next Steps

### Immediate (This Week)
1. ✅ Complete all checklist items above
2. ✅ Deploy to Vercel or Netlify
3. ✅ Add project to your portfolio
4. ✅ Write a blog post about what you learned

### Optional Enhancements
- Add keyboard shortcuts to video player (Space = play/pause, ← → = seek)
- Add more easing functions to animation demo
- Create a "favorites" list with crossfade transitions
- Add picture-in-picture support to video player

### Before Project 3
- Review your "Notes to Write Down" 
- Practice explaining actions to someone
- Understand FLIP requirements deeply
- Make sure all tests pass

---

## 📚 Resources

- [Svelte 5 Actions](https://svelte.dev/docs/svelte/svelte-action)
- [Svelte Animations](https://svelte.dev/docs/svelte/svelte-animate)
- [MDN: HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro)

---

**Project 2 Complete!** You now have:
- ✅ 3 production-ready actions
- ✅ Smooth FLIP animations
- ✅ Professional video player
- ✅ Testing foundation
- ✅ Job-ready code quality

**Ready for Project 3: State Management & Context API** 🎉
