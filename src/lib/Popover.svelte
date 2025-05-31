<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    let { target, popover } = $props<{
        target: (open: () => void) => any;
        popover: (close: () => void) => any;
    }>();

    let targetEl = $state<HTMLElement>();
    let popoverEl = $state<HTMLElement>();
    let resizeObserver = $state<ResizeObserver>();

    function togglePopover() {
        if (!popoverEl || !targetEl) {
            return;
        }
        if (popoverEl.matches(":popover-open")) {
            popoverEl.hidePopover();
        } else {
            // ボタンの位置を取得してポップオーバーを配置
            const rect = targetEl.getBoundingClientRect();
            popoverEl.style.position = "absolute";
            popoverEl.style.top = `${rect.bottom + window.scrollY}px`;
            popoverEl.style.left = `${rect.left + window.scrollX}px`;

            popoverEl.showPopover();
        }
    }
    function updatePopoverPosition() {
        if (!popoverEl || !targetEl) {
            return;
        }
        const rect = targetEl.getBoundingClientRect();
        popoverEl.style.position = "absolute";
        popoverEl.style.top = `${rect.bottom + window.scrollY}px`;
        popoverEl.style.left = `${rect.left + window.scrollX}px`;
    }
    onMount(() => {
        if (!targetEl) {
            return;
        }
        resizeObserver = new ResizeObserver(updatePopoverPosition);
        resizeObserver.observe(targetEl);
        window.addEventListener("scroll", updatePopoverPosition, true);
        window.addEventListener("resize", updatePopoverPosition);
    });

    onDestroy(() => {
        resizeObserver?.disconnect();
        window.removeEventListener("scroll", updatePopoverPosition, true);
        window.removeEventListener("resize", updatePopoverPosition);
    });
</script>

<div bind:this={targetEl}>
    {@render target(togglePopover)}
</div>
<div popover="auto" class="m-0 bg-transparent" bind:this={popoverEl}>
    {@render popover(togglePopover)}
</div>
