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
    class={` w-full resize-none overflow-hidden` + restProps.class}
    oninput={resize}
    rows="1"
></textarea>
