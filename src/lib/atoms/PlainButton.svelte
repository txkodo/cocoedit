<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        children,
        class: className,
        ...rest
    }: { children?: Snippet; [key: string]: any } = $props();
</script>

<button
    class="dark:hover:bg-white dark:hover:bg-opacity-10 hover:bg-black hover:bg-opacity-5 text-left {className ??
        ''}"
    {...rest}
>
    {#if children}{@render children()}{/if}
</button>
