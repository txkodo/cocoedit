<script lang="ts">
    let items = $state(["りんご", "バナナ", "みかん", "ぶどう"]);
    let dragging = $state(false);
    let startY = $state(0);
    let currentIndex = $state(null);
    let overIndex = $state(null);

    function handleTouchStart(e, index) {
        e.preventDefault();
        startY = e.touches[0].clientY;
        dragging = true;
        currentIndex = index;
    }
    function handleMouseDown(e, index) {
        e.preventDefault();
        startY = e.clientY;
        dragging = true;
        currentIndex = index;
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (!dragging) return;
        const y = e.touches[0].clientY;
        const offset = y - startY;
        const listItems = document.querySelectorAll("li");

        listItems.forEach((li, index) => {
            const rect = li.getBoundingClientRect();
            if (y > rect.top && y < rect.bottom) {
                overIndex = index;
            }
        });
    }
    function handleMouseMove(e) {
        e.preventDefault();
        if (!dragging) return;
        const y = e.clientY;
        const offset = y - startY;
        const listItems = document.querySelectorAll("li");

        listItems.forEach((li, index) => {
            const rect = li.getBoundingClientRect();
            if (y > rect.top && y < rect.bottom) {
                overIndex = index;
            }
        });
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (
            dragging &&
            overIndex !== null &&
            currentIndex !== null &&
            overIndex !== currentIndex
        ) {
            const updated = [...items];
            const [moved] = updated.splice(currentIndex, 1);
            updated.splice(overIndex, 0, moved);
            items = updated;
        }
        dragging = false;
        currentIndex = null;
        overIndex = null;
    }
    function handleMouseUp(e) {
        e.preventDefault();
        if (
            dragging &&
            overIndex !== null &&
            currentIndex !== null &&
            overIndex !== currentIndex
        ) {
            const updated = [...items];
            const [moved] = updated.splice(currentIndex, 1);
            updated.splice(overIndex, 0, moved);
            items = updated;
        }
        dragging = false;
        currentIndex = null;
        overIndex = null;
    }
</script>

<ul>
    {#each items as item, index}
        <li
            class:dragging={dragging && index === currentIndex}
            ontouchstart={(e) => handleTouchStart(e, index)}
            ontouchmove={handleTouchMove}
            ontouchend={handleTouchEnd}
            onmousedown={(e) => handleMouseDown(e, index)}
            onmousemove={handleMouseMove}
            onmouseup={handleMouseUp}
            style="padding: 12px; border: 1px solid #ccc; margin: 4px 0; user-select: none;"
        >
            {item}
        </li>
    {/each}
</ul>

<style>
    li.dragging {
        background-color: #eee;
        opacity: 0.7;
    }
    li {
        touch-action: none;
    }
</style>
