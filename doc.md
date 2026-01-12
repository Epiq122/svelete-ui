# FilmFlow Universe – Project 2  
## UI Studio + Animated Gallery

**Tech Stack:**  
Svelte 5.45 · SvelteKit · TypeScript · Tailwind 4 · DaisyUI  

**Edition:** Learning-Annotated

---

## 📋 Project Overview

### What you're building

A UI "studio" app where you practice patterns you will reuse forever:

- Reusable components  
- Actions  
- Snippets  
- Motion rules  
- Media bindings  
- Small canvas editor  

**Core idea:**  
This project is not about shipping features – it's about learning how UI systems are built and reasoned about.

---

## 🔑 How to Read This Project

- Comments explain **WHY**, not **WHAT** – focus on reasoning, not just syntax  
- "Teaching-only" markers indicate safe experimentation zones (not production patterns)  
- "Production pattern" markers show what teams actually ship  
- State mutation notes explain why direct mutation is OK in Svelte 5  

---

## 🎯 Project Goals & Scope

### You Will Build

- UI Studio (tabs)  
- Playground (buttons, tooltips, gestures)  
- Animated Gallery (FLIP)  
- Crossfade Shelves  
- Trailer Wall (media bindings)  
- Scene Board (Konva canvas)  

---

## What "Portfolio-Worthy" Means Here

- ✅ Strict typing  
- ✅ Reusable components  
- ✅ Predictable motion  
- ✅ Accessibility by default  
- ✅ No hidden magic  

## 🧠 Mental Models (Read Before Coding)

### 1. Snippets (Svelte 5's Composition Primitive)

**What they are:**  
Snippets are functions that return UI chunks.

```svelte
{@render snippet()}
<script lang="ts">
  import type { Snippet } from 'svelte';
  
  type Props = {
    icon?: Snippet<[{ size: number }]>;
  };
  
  let { icon }: Props = $props();
</script>

{#if icon}
  {@render icon({ size: 24 })}
{/if}
```

### 2. `$state` Mutation (IMPORTANT)

In Svelte 5, `$state` values are proxied.

This means:

```ts
// ✅ All of these are REACTIVE (no reassignment needed)
movies.push(newMovie);
movies.splice(index, 1);
obj.value = 123;
user.name = 'Alice';
````
**Why this matters:**

- Arrays and objects can be mutated directly  
- No need for `movies = [...movies, newMovie]`  
- More intuitive, less boilerplate  

This is a deliberate mental-model change from Svelte 3/4.

### 3. Actions

**What they are:**  
Functions that attach behavior to DOM nodes.

```svelte
<div use:clickOutside on:clickoutside={handler} />
```
**Properties:**

- Lifecycle-aware (cleanup on destroy)  
- Reusable across components  
- Composable  

**Rule:**  
If behavior touches the DOM directly, it probably belongs in an action.

**When to use actions:**

- Click outside detection  
- Long-press gestures  
- Third-party library wrappers (tooltips, drag-and-drop)  
- Focus trapping  
- Resize observers  


### 4. Motion Rules (Non-Negotiable)

**`animate:flip` requirements:**

- Must use keyed `{#each}` block  
- Animated element must be the immediate child of the `{#each}`  
- Element must have a stable identity (via key)  

**`crossfade` requirements:**

- Requires stable IDs across both lists  
- Both elements must use the same crossfade pair  

**Debugging tip:**  
If motion doesn't work, check:

- Is the `{#each}` keyed? `{#each items as item (item.id)}`  
- Is there an intermediate wrapper between `{#each}` and animated element?  
- Are IDs stable across re-renders?



### 5. Boundaries

**What they do:**  
`<svelte:boundary>` isolates render/effect crashes.

```svelte
<svelte:boundary onerror={(e) => console.error(e)}>
  <RiskyComponent />
</svelte:boundary>
```

**What they catch:**

- Render errors  
- Effect errors  

**What they DON'T catch:**

- Event handler errors  
- Async promise rejections  

**Use them for:**  
Risky UI islands, not business logic.

📁 Project Structure
```txt
src/
├── routes/
│   └── studio/
│       └── +page.svelte          # Main studio page with tabs
│
├── lib/
│   ├── ui/                        # Reusable UI primitives
│   │   ├── SmartButton.svelte     # Polymorphic button/link
│   │   ├── Popover.svelte         # Portal-based popover
│   │   ├── ToastStack.svelte      # Notification system
│   │   └── FilterChip.svelte      # Toggleable chip
│   │
│   ├── actions/                   # DOM behavior actions
│   │   ├── clickOutside.svelte.ts
│   │   ├── longpress.svelte.ts
│   │   └── tippy.svelte.ts
│   │
│   └── studio/                    # Studio-specific components
│       ├── AnimatedGallery.svelte
│       ├── CrossfadeShelves.svelte
│       ├── TrailerWall.svelte
│       ├── SceneBoard.svelte
│       └── FlakyPoster.svelte

``` 
1️⃣ Actions

clickOutside.svelte.ts
```svelte
typescriptimport type { Action } from 'svelte/action';

/**
 * Teaching goal:
 * - Show how actions can dispatch custom events
 * - Demonstrate capture-phase handling
 *
 * Production pattern:
 * - Click-outside logic should live in ONE place (this action)
 * - Prevents scattered document listeners across components
 */

export type ClickOutsideEvents = {
  'onclickoutside': (e: CustomEvent<{ originalEvent: PointerEvent }>) => void;
};

export const clickOutside: Action<
  HTMLElement,
  undefined,
  ClickOutsideEvents
> = (node) => {
  function onPointerDown(e: PointerEvent) {
    // composedPath() handles portals + shadow DOM correctly
    // Without it, clicks inside portaled content would trigger "outside" events
    if (!e.composedPath().includes(node)) {
      node.dispatchEvent(
        new CustomEvent('clickoutside', {
          detail: { originalEvent: e }
        })
      );
    }
  }

  // Capture phase (true) ensures we run even if inner handlers stopPropagation()
  // This is critical for nested interactive elements
  document.addEventListener('pointerdown', onPointerDown, true);

  return {
    destroy() {
      // Cleanup is mandatory for actions to prevent memory leaks
      document.removeEventListener('pointerdown', onPointerDown, true);
    }
  };
};
Usage:
svelte<script lang="ts">
  let open = $state(false);
</script>

<div
  use:clickOutside
  on:clickoutside={() => open = false}
>
  <button onclick={() => open = !open}>Toggle</button>
  {#if open}
    <div class="dropdown">Content</div>
  {/if}
</div>

longpress.svelte.ts
typescriptimport type { Action } from 'svelte/action';

/**
 * Teaching goal:
 * - Pointer events unify mouse/touch/pen interactions
 * - Timer management + cleanup patterns
 * - Preventing text selection during long press
 *
 * Production pattern:
 * - Always use PointerEvent (not MouseEvent/TouchEvent)
 * - Always clear timers in ALL exit paths
 */

export type LongpressParams = { 
  ms?: number; // Duration threshold in milliseconds
};

export type LongpressEvents = {
  'onlongpress': (e: CustomEvent<{ pointerType: string }>) => void;
};

export const longpress: Action<
  HTMLElement,
  LongpressParams,
  LongpressEvents
> = (node, params) => {
  let timer: number | null = null;
  let ms = params?.ms ?? 600; // Default 600ms

  function clear() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }

  function start(e: PointerEvent) {
    clear(); // Clear any existing timer
    
    // Prevent text selection during long press
    node.style.userSelect = 'none';

    timer = window.setTimeout(() => {
      node.dispatchEvent(
        new CustomEvent('longpress', {
          detail: { 
            pointerType: e.pointerType // 'mouse', 'touch', or 'pen'
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

  // Listen to all pointer lifecycle events
  node.addEventListener('pointerdown', start);
  node.addEventListener('pointerup', stop);
  node.addEventListener('pointercancel', stop); // Handle interruptions
  node.addEventListener('pointerleave', stop);  // Handle leaving element

  return {
    update(next) {
      // Teaching-only: legacy update pattern still common in older codebases
      // This allows dynamic parameter changes: use:longpress={{ ms: dynamicValue }}
      ms = next?.ms ?? 600;
    },
    destroy() {
      // Clean up ALL event listeners
      node.removeEventListener('pointerdown', start);
      node.removeEventListener('pointerup', stop);
      node.removeEventListener('pointercancel', stop);
      node.removeEventListener('pointerleave', stop);
      clear(); // Clear any pending timer
    }
  };
};
Usage:
svelte<script lang="ts">
  function handleLongpress(e: CustomEvent<{ pointerType: string }>) {
    console.log('Long pressed with:', e.detail.pointerType);
    // Show context menu, delete confirmation, etc.
  }
</script>

<button
  use:longpress={{ ms: 800 }}
  on:longpress={handleLongpress}
>
  Long press me
</button>

tippy.svelte.ts
typescriptimport type { Action } from 'svelte/action';
import tippy, { type Instance, type Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

/**
 * Teaching goal:
 * - Wrap third-party libraries behind one interface
 * - Centralize instance management
 *
 * Production pattern:
 * - NEVER scatter tippy() calls across components
 * - One action = one source of truth = easier debugging
 */

export type TippyParams = {
  content: string;
  placement?: Props['placement']; // 'top' | 'bottom' | 'left' | 'right' etc.
};

export const tooltip: Action<HTMLElement, TippyParams> = (node, params) => {
  let instance: Instance | null = null;

  function setup(p: TippyParams) {
    // Destroy existing instance before creating new one
    instance?.destroy();
    
    instance = tippy(node, {
      content: p.content,
      placement: p.placement ?? 'top'
    });
  }

  setup(params);

  return {
    update(next) {
      // Recreate tooltip when params change
      setup(next);
    },
    destroy() {
      instance?.destroy();
    }
  };
};
Usage:
svelte<script lang="ts">
  import { tooltip } from '$lib/actions/tippy.svelte';
</script>

<button
  use:tooltip={{ content: 'Click to save', placement: 'bottom' }}
>
  Save
</button>

2️⃣ Core UI Components
SmartButton.svelte (Fully Annotated)
svelte<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  /**
   * Teaching goal:
   * - Wrapper components that DO NOT break native semantics
   * - Dynamic element typing (button vs anchor)
   * - Snippet-based composition for icons/content
   *
   * Production pattern:
   * - Use discriminated union for href (button XOR anchor)
   * - Preserve all native attributes via rest props
   * - Never fake disabled state on links
   */

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

  type BaseProps = {
    variant?: Variant;
    loading?: boolean;
    // Snippets can receive arguments (here: loading state)
    leading?: Snippet<[{ loading: boolean }]>;
    trailing?: Snippet<[{ loading: boolean }]>;
    children?: Snippet;
  };

  // Discriminated union: either button OR anchor, not both
  type ButtonLike = BaseProps & (
    SvelteHTMLElements['button'] & { href?: undefined }
  );
  
  type AnchorLike = BaseProps & (
    SvelteHTMLElements['a'] & { href: string }
  );
  
  type Props = ButtonLike | AnchorLike;

  let {
    variant = 'primary',
    loading = false,
    leading,
    trailing,
    children,
    href,
    class: className,
    disabled,
    ...rest // All other native props (aria-*, data-*, onClick, etc.)
  }: Props = $props();

  // Derived state (auto-recomputes when dependencies change)
  const isLink = $derived(typeof href === 'string');
  const tag = $derived(isLink ? 'a' : 'button');

  // Explicit mapping prevents "mystery styles"
  // Always prefer explicit over implicit for learning
  const variantClass = $derived(() => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'ghost': return 'btn-ghost';
      case 'danger': return 'btn-error';
    }
  });

  const computedDisabled = $derived(Boolean(disabled) || loading);
</script>

<!--
  svelte:element allows dynamic tag rendering
  Critical: preserve native semantics (disabled for button, pointer-events for link)
-->
<svelte:element
  this={tag}
  {href}
  {...rest}
  class={`btn ${variantClass()} ${className ?? ''}`}
  class:btn-disabled={computedDisabled}
  aria-disabled={computedDisabled}
  disabled={!isLink && computedDisabled ? true : undefined}
  style={!isLink ? undefined : computedDisabled ? 'pointer-events: none; opacity: 0.6;' : undefined}
>
  {#if leading}
    {@render leading({ loading })}
  {/if}

  {#if loading}
    <span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
  {/if}

  {#if children}
    {@render children()}
  {/if}

  {#if trailing}
    {@render trailing({ loading })}
  {/if}
</svelte:element>
Usage Example:
svelte<script lang="ts">
  import SmartButton from '$lib/ui/SmartButton.svelte';
  import { IconSave } from 'lucide-svelte';
  
  let saving = $state(false);
  
  async function save() {
    saving = true;
    await fetch('/api/save', { method: 'POST' });
    saving = false;
  }
</script>

<!-- As button -->
<SmartButton
  variant="primary"
  loading={saving}
  onclick={save}
>
  {#snippet leading({ loading })}
    {#if !loading}
      <IconSave size={16} />
    {/if}
  {/snippet}
  Save Changes
</SmartButton>

<!-- As link -->
<SmartButton
  variant="secondary"
  href="/dashboard"
>
  Go to Dashboard
</SmartButton>

3️⃣ Studio Features
AnimatedGallery.svelte
svelte<script lang="ts">
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';

  /**
   * Teaching goal:
   * - Show FLIP constraints clearly
   * - Highlight key + immediate child rule
   *
   * FLIP = First, Last, Invert, Play
   * Svelte handles this automatically with animate:flip
   *
   * Critical rules:
   * 1. Must use keyed {#each}: {#each items as item (item.id)}
   * 2. Animated element must be IMMEDIATE child of {#each}
   * 3. No wrapper divs between {#each} and animated element
   */

  type Movie = { 
    id: string; 
    title: string; 
    year: number;
  };

  // $state with mutation (Svelte 5 style)
  let movies = $state<Movie[]>([
    { id: 'm1', title: 'Nebula Heist', year: 2024 },
    { id: 'm2', title: 'Glass Harbor', year: 2023 },
    { id: 'm3', title: 'Signal Runner', year: 2025 },
    { id: 'm4', title: 'Midnight Archive', year: 2022 }
  ]);

  /**
   * Move movie up or down in list
   * Uses direct array mutation (allowed in Svelte 5)
   */
  function move(id: string, dir: -1 | 1) {
    const i = movies.findIndex(m => m.id === id);
    const j = i + dir;
    
    // Bounds check
    if (i < 0 || j < 0 || j >= movies.length) return;

    // Teaching-only: showing splice pattern
    // Production: consider using a library like immutable.js for complex state
    const copy = movies.slice();
    const [item] = copy.splice(i, 1);
    copy.splice(j, 0, item);
    
    // Reassignment triggers reactivity
    movies = copy;
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

  function sortByYear() {
    movies = movies.slice().sort((a, b) => a.year - b.year);
  }
</script>

<div class="p-6 space-y-4">
  <div class="flex gap-2">
    <button class="btn btn-sm btn-primary" onclick={shuffle}>
      Shuffle
    </button>
    <button class="btn btn-sm btn-secondary" onclick={sortByYear}>
      Sort by Year
    </button>
  </div>

  <div class="grid gap-3">
    <!--
      CRITICAL: (movie.id) is the key
      animate:flip REQUIRES this to work
    -->
    {#each movies as movie (movie.id)}
      <!--
        This div is the IMMEDIATE child of {#each}
        animate:flip MUST be on this element, not a nested child
      -->
      <div
        animate:flip={{ duration: 400, easing: quintOut }}
        class="card bg-base-200 shadow-lg"
      >
        <div class="card-body flex-row items-center justify-between">
          <div>
            <h3 class="card-title">{movie.title}</h3>
            <p class="text-sm opacity-70">{movie.year}</p>
          </div>
          
          <div class="flex gap-1">
            <button
              class="btn btn-sm btn-circle btn-ghost"
              onclick={() => move(movie.id, -1)}
              disabled={movies[0].id === movie.id}
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              class="btn btn-sm btn-circle btn-ghost"
              onclick={() => move(movie.id, 1)}
              disabled={movies[movies.length - 1].id === movie.id}
              aria-label="Move down"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
Key Takeaways:

animate:flip requires keyed {#each}
Animated element must be immediate child
Duration and easing are customizable
Works automatically with any DOM changes (sort, filter, reorder)


CrossfadeShelves.svelte
svelte<script lang="ts">
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  /**
   * Teaching goal:
   * - Crossfade creates smooth transitions between two lists
   * - Requires stable IDs across both lists
   *
   * How it works:
   * - When item moves from list A to list B, it appears to fly between them
   * - Both send and receive functions must use same crossfade pair
   */

  type Movie = {
    id: string;
    title: string;
  };

  // Create crossfade pair (MUST be at module scope)
  const [send, receive] = crossfade({
    duration: 400,
    easing: quintOut
  });

  let watchlist = $state<Movie[]>([
    { id: 'm1', title: 'Inception' },
    { id: 'm2', title: 'Interstellar' },
    { id: 'm3', title: 'The Matrix' }
  ]);

  let watched = $state<Movie[]>([]);

  function markWatched(id: string) {
    const movie = watchlist.find(m => m.id === id);
    if (!movie) return;

    // Remove from watchlist
    watchlist = watchlist.filter(m => m.id !== id);
    
    // Add to watched
    watched = [...watched, movie];
  }

  function markUnwatched(id: string) {
    const movie = watched.find(m => m.id === id);
    if (!movie) return;

    // Remove from watched
    watched = watched.filter(m => m.id !== id);
    
    // Add to watchlist
    watchlist = [...watchlist, movie];
  }
</script>

<div class="grid grid-cols-2 gap-6 p-6">
  <!-- Watchlist -->
  <div class="space-y-2">
    <h2 class="text-xl font-bold">Watchlist</h2>
    <div class="space-y-2">
      {#each watchlist as movie (movie.id)}
        <div
          in:receive={{ key: movie.id }}
          out:send={{ key: movie.id }}
          class="card bg-base-200 shadow"
        >
          <div class="card-body p-4 flex-row justify-between items-center">
            <span>{movie.title}</span>
            <button
              class="btn btn-xs btn-primary"
              onclick={() => markWatched(movie.id)}
            >
              Mark Watched →
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Watched -->
  <div class="space-y-2">
    <h2 class="text-xl font-bold">Watched</h2>
    <div class="space-y-2">
      {#each watched as movie (movie.id)}
        <div
          in:receive={{ key: movie.id }}
          out:send={{ key: movie.id }}
          class="card bg-success/20 shadow"
        >
          <div class="card-body p-4 flex-row justify-between items-center">
            <span>{movie.title}</span>
            <button
              class="btn btn-xs btn-ghost"
              onclick={() => markUnwatched(movie.id)}
            >
              ← Unwatch
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
````

Key Takeaways:

crossfade() returns [send, receive] pair
Both transitions need same key (the item's ID)
Works between ANY two lists, not just adjacent ones
Creates illusion of physical movement


4️⃣ Studio Page Layout
src/routes/studio/+page.svelte

```svelte
<script lang="ts">
  import AnimatedGallery from '$lib/studio/AnimatedGallery.svelte';
  import CrossfadeShelves from '$lib/studio/CrossfadeShelves.svelte';
  import TrailerWall from '$lib/studio/TrailerWall.svelte';
  import SceneBoard from '$lib/studio/SceneBoard.svelte';
  import FlakyPoster from '$lib/studio/FlakyPoster.svelte';

  /**
   * Teaching goal:
   * - Show tab pattern with Svelte 5 state
   * - Demonstrate error boundaries for risky components
   * - Show bind:this for imperative API access
   *
   * Production pattern:
   * - Tabs should preserve scroll position (not shown here for brevity)
   * - Consider lazy loading tab content
   */

  type Tab = 'gallery' | 'shelves' | 'trailer' | 'scene' | 'flaky';

  let activeTab = $state<Tab>('gallery');

  // Example: imperative reference to canvas component
  let sceneBoard: SceneBoard | null = $state(null);

  function exportCanvas() {
    if (sceneBoard) {
      // Access imperative API from component instance
      sceneBoard.exportImage();
    }
  }
</script>

<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">UI Studio</h1>

  <!-- Tabs Navigation -->
  <div class="tabs tabs-boxed mb-6">
    <button
      class="tab"
      class:tab-active={activeTab === 'gallery'}
      onclick={() => activeTab = 'gallery'}
    >
      Animated Gallery
    </button>
    <button
      class="tab"
      class:tab-active={activeTab === 'shelves'}
      onclick={() => activeTab = 'shelves'}
    >
      Crossfade Shelves
    </button>
    <button
      class="tab"
      class:tab-active={activeTab === 'trailer'}
      onclick={() => activeTab = 'trailer'}
    >
      Trailer Wall
    </button>
    <button
      class="tab"
      class:tab-active={activeTab === 'scene'}
      onclick={() => activeTab = 'scene'}
    >
      Scene Board
    </button>
    <button
      class="tab"
      class:tab-active={activeTab === 'flaky'}
      onclick={() => activeTab = 'flaky'}
    >
      Flaky Component
    </button>
  </div>

  <!-- Tab Content -->
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      {#if activeTab === 'gallery'}
        <AnimatedGallery />
      
      {:else if activeTab === 'shelves'}
        <CrossfadeShelves />
      
      {:else if activeTab === 'trailer'}
        <TrailerWall />
      
      {:else if activeTab === 'scene'}
        <div class="space-y-4">
          <div class="flex justify-end">
            <button
              class="btn btn-sm btn-primary"
              onclick={exportCanvas}
            >
              Export Canvas
            </button>
          </div>
          <SceneBoard bind:this={sceneBoard} />
        </div>
      
      {:else if activeTab === 'flaky'}
        <!--
          Error boundary catches render/effect errors
          Use for components that might fail (API calls, heavy computation, etc.)
        -->
        <svelte:boundary onerror={(error) => {
          console.error('FlakyPoster crashed:', error);
        }}>
          {#snippet failed(error)}
            <div class="alert alert-error">
              <span>Component crashed: {error.message}</span>
              <button
                class="btn btn-sm"
                onclick={() => activeTab = 'gallery'}
              >
                Go Back
              </button>
            </div>
          {/snippet}
          
          <FlakyPoster />
        </svelte:boundary>
      {/if}
    </div>
  </div>
</div>
## Key Learning Points

- **Why boundaries exist:** Prevent entire app crash from one bad component  
- **Why `bind:this` is used:** Access imperative APIs (canvas export, focus, etc.)  
- **Why shared module state is safe here:** Tabs don't unmount, just hide/show  
- **Why each block is always keyed:** Enable proper reconciliation and animations  

---

## ✅ Final Learning Checklist

Before moving to Project 3, ensure you understand:

- **Snippets** – How to pass render functions as props  
- **`$state` mutation** – Direct mutation is reactive in Svelte 5  
- **Actions** – Reusable DOM behavior patterns  
- **`animate:flip`** – FLIP animation requirements and constraints  
- **`crossfade`** – Smooth transitions between lists  
- **Polymorphic components** – Type-safe button/link components  
- **Error boundaries** – Isolating component crashes  
- **`bind:this`** – When and why to use imperative refs  

---

## 🎓 Next Steps

- **Build the project** – Don't just read, code along  
- **Break things intentionally** – Remove keys, add wrappers, see what breaks  
- **Add your own features** – Drag-and-drop reordering, filters, search  
- **Read the comments** – Every “why” is there for a reason
