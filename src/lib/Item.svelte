<script lang="ts">
    import type { Log, Profile } from "src/logic/model";
    import ResizeTextarea from "./ResizeTextarea.svelte";
    import { PlusOutline, CloseOutline } from "flowbite-svelte-icons";
    import { Card } from "flowbite-svelte";
    import Popover from "./Popover.svelte";
    let {
        log = $bindable(),
        height = $bindable(0),
        profiles,
        ondelete,
        oninsert,
    }: {
        log: Log;
        profiles: Profile[];
        height: number;
        ondelete: () => void;
        oninsert: () => void;
    } = $props();
</script>

<div class="item w-full flex px-2 md:px-8" bind:clientHeight={height}>
    <div
        class="w-1 mr-2 my-1 bottom-10 top-10 rounded-sm"
        style="background-color: {profiles.find((x) => x.id === log.profile_id)
            ?.color};"
    ></div>
    <div class="flex-grow mr-2">
        <div class="flex">
            <Popover>
                {#snippet target(onclick)}
                    <button {onclick}>
                        <span
                            class="text-sm font-bold"
                            style="color: {profiles.find(
                                (x) => x.id === log.profile_id,
                            )?.color};"
                        >
                            {profiles.find((x) => x.id === log.profile_id)
                                ?.name} :
                        </span>
                    </button>
                {/snippet}
                {#snippet popover(onclick)}
                    <Card class="p-2">
                        {#each profiles as profile}
                            <button
                                class="flex w-full text-left"
                                onclick={() => {
                                    log = {
                                        ...log,
                                        profile_id: profile.id,
                                    };
                                    onclick();
                                }}
                            >
                                <div
                                    class="w-1 mr-2 my-1 bottom-10 top-10 rounded-sm"
                                    style="background-color: {profile.color};"
                                ></div>
                                <span
                                    class="font-bold"
                                    style="color: {profile.color}"
                                >
                                    {profile.name || "-"}
                                </span>
                            </button>
                        {/each}
                    </Card>
                {/snippet}
            </Popover>

            <span class="flex-grow"></span>
            <button class="control mr-4" onclick={oninsert}>
                <PlusOutline
                    class="h-5 w-5 rounded-full text-gray-600 dark:text-white"
                />
            </button>
            <button class="control" onclick={ondelete}>
                <CloseOutline
                    class="h-5 w-5 rounded-full text-gray-600 dark:text-white"
                />
            </button>
        </div>
        <ResizeTextarea
            style="line-height: 30px;"
            bind:value={
                () => log.message, (msg) => (log = { ...log, message: msg })
            }
            class="
                mr-2
                py-0.5
                rounded-lg
                border-none

                bg-transparent
                
                hover:bg-gray-50  dark:hover:bg-gray-800
                text-gray-900     dark:text-white
                focus:bg-gray-100 dark:focus:bg-gray-700
                text-sm"
            name="log-message"
        />
    </div>
</div>

<style>
    .control {
        display: none;
    }

    .item:hover .control {
        display: block;
    }
</style>
