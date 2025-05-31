<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        children,
        class: className,
        ...restProps
    }: { children: Snippet; class?: string; [x: string]: any } = $props();
</script>

<span
    class={"block text-sm font-medium text-gray-700 dark:text-gray-300 " +
        (className ?? "")}
    {...restProps}
>
    {@render children()}
</span>
