<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        children,
        expander,
    }: { children: Snippet; expander: Snippet<[boolean, () => void]> } =
        $props();
    let open = $state(false);
</script>

{@render expander(open, () => (open = !open))}
{#if open}
    {@render children()}
{/if}
