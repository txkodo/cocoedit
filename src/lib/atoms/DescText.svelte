<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        children,
        class: className,
        ...restProps
    }: { children: Snippet; class?: string; [x: string]: any } = $props();
</script>

<span
    class={"block text-sm text-gray-800 dark:text-gray-200 " +
        (className ?? "")}
    {...restProps}
>
    {@render children()}
</span>
