<script>
    import { onMount } from "svelte";
    let { value = $bindable(""), ...restProps } = $props();
    let textarea = $state();

    function resize() {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }
    onMount(() => {
        resize();
    });
</script>

<textarea
    bind:this={textarea}
    bind:value
    {...restProps}
    class="
    resize-none
    rounded-lg
    border-none
    bg-transparent
    py-0.5
    dark:placeholder-gray-400

    text-gray-900
    dark:text-white

    w-full
    text-sm
    overflow-hidden

    focus:bg-gray-100
    dark:focus:bg-gray-700
    "
    oninput={resize}
    rows="1"
></textarea>
