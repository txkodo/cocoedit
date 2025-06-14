<script lang="ts">
    import type { Snippet } from "svelte";

    let { right, children }: { right?: Snippet; children?: Snippet } = $props();
</script>

<div
    class="flex px-2 py-4 rounded-sm dark:hover:bg-white dark:hover:bg-opacity-10 hover:bg-black hover:bg-opacity-5"
>
    {#if children}{@render children()}{/if}
    {#if right}
        <div class="flex-grow"></div>
        {@render right()}
    {/if}
</div>
