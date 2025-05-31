export class Vlist {
    scrollOffset: number;
    containerHeight: number;
    overscanPixels: number;
    totalHeight: number;
    renderItems: { offset: number; index: number; id: number }[];
    constructor(
        heights: () => { id: number, height: number }[]
    ) {
        this.scrollOffset = $state(0);
        this.containerHeight = $state(0);
        this.overscanPixels = $state(0);

        let heightAndOffsets = $derived(
            (() => {
                const offsets: { offset: number, id: number }[] = [];
                let offset = 0;
                for (const { height, id } of heights()) {
                    offsets.push({ offset, id });
                    offset += height;
                }
                return { totalHeight: offset, offsets, };
            })(),
        );
        this.renderItems = $derived(
            (() => {
                const scrollOffset = this.scrollOffset;
                const containerHeight = this.containerHeight;
                const overscanPixels = this.overscanPixels;
                const offsets = heightAndOffsets.offsets.map(({ offset }) => offset);
                let minIndex = binarySearchMaxLE(
                    offsets,
                    scrollOffset - overscanPixels,
                );
                let maxIndex = binarySearchMaxLE(
                    offsets,
                    scrollOffset + containerHeight + overscanPixels,
                );
                minIndex = Math.max(minIndex, 0);
                return heightAndOffsets.offsets
                    .slice(minIndex, maxIndex + 1)
                    .map((offset, index) => ({
                        offset: offset.offset,
                        id: offset.id,
                        index: minIndex + index,
                    }));
            })(),
        );
        this.totalHeight = $derived(heightAndOffsets.totalHeight);
    }
}
function binarySearchMaxLE(list: number[], value: number): number {
    let low = 0;
    let high = list.length - 1;
    let result = -1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (list[mid] <= value) {
            result = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}
