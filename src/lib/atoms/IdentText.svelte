<script lang="ts">
    import type { Snippet } from "svelte";
    let { children, ...restProps }: { children: Snippet; [x: string]: any } =
        $props();
</script>

<span
    class="block text-sm font-bold text-gray-700 dark:text-gray-300"
    {...restProps}
>
    {@render children()}
</span>
