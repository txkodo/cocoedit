<script lang="ts">
  import Item from "./Item.svelte";
  import { Vlist } from "./vlist.svelte";
  import { onMount } from "svelte";
  import type { LogDocEdit } from "./logEditor.svelte";

  let {
    logdoc,
  }: {
    logdoc: LogDocEdit;
  } = $props();

  let heights = $state<Record<number, number>>(
    logdoc.logOrder.reduce(
      (acc, id) => {
        acc[id] = 64;
        return acc;
      },
      {} as Record<number, number>,
    ),
  );
  const vlist = new Vlist(() =>
    logdoc.logOrder.map((id) => ({ id, height: heights[id] })),
  );
  let width = $state<number>(0);
  vlist.overscanPixels = 200;

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
    heights = logdoc.logOrder.reduce((acc, id) => {
      const log = logdoc.getLog(id);
      if (log) {
        acc[id] = estimateHeight(log.message) + 34;
      }
      return { ...acc };
    }, heights);
  });
</script>

<div
  class="w-full h-full overflow-auto scrollbar-custom"
  bind:clientWidth={width}
  bind:clientHeight={vlist.containerHeight}
  onscroll={(e: Event) => {
    const target = e.target as HTMLDivElement;
    vlist.scrollOffset = target.scrollTop;
  }}
>
  <div class="relative" style="height: {vlist.totalHeight}px;">
    {#each vlist.renderItems.map((x) => x) as item (item.id)}
      <div class="w-full absolute" style="top: {item.offset}px;">
        <Item
          bind:log={
            () => logdoc.getLog(item.id)!, (log) => logdoc.setLog(item.id, log)
          }
          bind:height={
            () => heights[item.id] ?? 64,
            (h) => {
              if (h === heights[item.id]) return;
              heights[item.id] = h;
              heights = { ...heights }; // Trigger reactivity
            }
          }
          ondelete={() => {
            logdoc.deleteLog(item.id);
            delete heights[item.id];
            heights = { ...heights };
          }}
          oninsert={() => {
            const newId = logdoc.insertLogAfter(item.id);
            if (newId !== undefined) {
              heights = { ...heights, [newId]: 64 }; // Add new log with default height
            }
          }}
          profiles={logdoc.profiles}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  :global {
    .scrollbar-custom {
      scrollbar-color: #cbd5e0 transparent;
    }
    .scrollbar-custom::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .scrollbar-custom::-webkit-scrollbar-track {
      background: transparent;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb {
      background-color: #94a3b8; /* slate-400 */
      border-radius: 9999px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
      background-color: #64748b; /* slate-500 */
    }
  }
</style>
