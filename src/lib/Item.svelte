<script lang="ts">
    import ResizeTextarea from "./ResizeTextarea.svelte";

    let {
        message = $bindable(),
        estimatedHeight,
        onHeightChanged,
    }: {
        message: string;
        estimatedHeight?: number;
        onHeightChanged: (height: number) => void;
    } = $props();

    let height = $state<number>(estimatedHeight ?? 0);

    let oldH = estimatedHeight ?? 0;

    $effect(() => {
        if (height !== estimatedHeight) {
            console.log(
                "Height changed:",
                height,
                "Estimated:",
                estimatedHeight,
                message,
            );
        }
        if (height !== oldH) {
            onHeightChanged(height);
            oldH = height * 1;
        }
    });
</script>

<div class="w-full h-full relative">
    <div class="absolute w-full" bind:clientHeight={height}>
        <span class="text-md text-red-500 dark:text-red-500">
            @HELLO{height}
        </span>
        <ResizeTextarea style="line-height: 30px;" bind:value={message} />
    </div>
</div>
