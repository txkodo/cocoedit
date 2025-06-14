<script lang="ts">
    let { ...restProps }: { [x: string]: any } = $props();
</script>

<div class="w-2 mr-2 my-1 bottom-10 top-10 rounded-sm" {...restProps}></div>
