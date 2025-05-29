<script lang="ts">
    import VirtualList from "svelte-tiny-virtual-list";
    import jsonData from "./logs.json";
    import Item from "./Item.svelte";
    import { onMount } from "svelte";

    const logs = jsonData.logs;
    let heights = $state<number[]>(logs.map(() => 64));

    let height = $state<number>(0);
    let width = $state<number>(0);
    let virtualList = $state<VirtualList>();

    // 各アイテムの高さを推定するための関数
    // 実際の高さはonHeightChangedで得られるが、
    // VirtualScrollのためにItemのDomを作成する前にだいたいの高さがわかる必要がある
    // Itemの内部実装によってパラメタが変わるのであまり良い設計ではない
    const heightEstimator = (width: number, lineHeight: number) => {
        const asciiWidth = 7; // ASCII文字の平均幅
        const nonAsciiWidth = 12; // 非ASCII文字の平均幅
        return (str: string): number => {
            let h = 0;
            let lineLen = 0;
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                if (code === 10) {
                    // 改行コード
                    h += Math.ceil(lineLen / width) || 1;
                    lineLen = 0;
                    continue;
                }
                if (code > 126) {
                    lineLen += nonAsciiWidth;
                } else {
                    lineLen += asciiWidth;
                }
            }
            h += Math.ceil(lineLen / width) || 1;
            return h * lineHeight;
        };
    };

    onMount(() => {
        const estimateHeight = heightEstimator(width, 30);
        heights = logs.map(({ message }) => estimateHeight(message) + 34);
    });
</script>

<div class="w-full h-full" bind:clientHeight={height} bind:clientWidth={width}>
    <VirtualList
        bind:this={virtualList}
        width="100%"
        {height}
        itemCount={logs.length}
        itemSize={heights}
    >
        <div slot="item" let:index let:style {style}>
            <Item
                message={logs[index].message}
                estimatedHeight={heights[index]}
                onHeightChanged={(h) => {
                    heights[index] = h;
                    heights = [...heights]; // Trigger reactivity
                }}
            />
        </div>
    </VirtualList>
</div>
