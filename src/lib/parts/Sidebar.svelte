<script lang="ts">
    import { slide } from "svelte/transition";
    import {
        UsersSolid,
        ChevronUpOutline,
        ChevronDownOutline,
    } from "flowbite-svelte-icons";
    import Label from "../atoms/Label.svelte";
    import NavText from "../atoms/NavText.svelte";
    import Expander from "../atoms/Expander.svelte";
    import DescText from "../atoms/DescText.svelte";
    import LeftBar from "../atoms/LeftBar.svelte";
    import ProfileConfig from "./ProfileConfig.svelte";

    let { logdoc } = $props();

    let usersOpen = $state(true);
</script>

<div class="w-64 py-4 bg-gray-50 dark:bg-gray-800">
    <Expander>
        {#snippet expander(isOpen, toggle)}
            <button onclick={toggle} class="w-full">
                <Label>
                    <UsersSolid
                        class="h-5 w-5 mr-2 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    />
                    <NavText>Profiles</NavText>
                    {#snippet right()}
                        {#if isOpen}
                            <ChevronUpOutline
                                class="h-5 w-5 mr-2 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                            />
                        {:else}
                            <ChevronDownOutline
                                class="h-5 w-5 mr-2 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                            />
                        {/if}
                    {/snippet}
                </Label>
            </button>
        {/snippet}

        <div transition:slide={{ duration: 100 }} class="w-full">
            {#each logdoc.profiles as profile}
                <ProfileConfig {profile} />
            {/each}
        </div>
    </Expander>
</div>
