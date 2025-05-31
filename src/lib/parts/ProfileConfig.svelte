<script lang="ts">
    import type { Profile, ProfileDisplay } from "src/logic/model";
    import LeftBar from "../atoms/LeftBar.svelte";
    import DescText from "../atoms/DescText.svelte";
    import NavText from "../atoms/NavText.svelte";
    import PlainButton from "../atoms/PlainButton.svelte";
    let { profile = $bindable() }: { profile: Profile } = $props();

    function stringifyDisplay(display: ProfileDisplay) {
        switch (display) {
            case "full":
                return "PC名を含める";
            case "message":
                return "テキストのみ";
            case "hidden":
                return "非表示";
            default:
                return "PC名を含める";
        }
    }

    function switchDisplay() {
        switch (profile.display) {
            case "full":
                profile.display = "message";
                break;
            case "message":
                profile.display = "hidden";
                break;
            case "hidden":
                profile.display = "full";
                break;
            default:
                profile.display = "full";
        }
    }
</script>

<div class="ml-3">
    <PlainButton class="flex w-full" onclick={() => switchDisplay()}>
        <LeftBar style="background-color: {profile.color};" />
        <div>
            <NavText style="color: {profile.color}" class="mb-1">
                {profile.name || "-"}
            </NavText>
            <DescText class="mb-2">
                {stringifyDisplay(profile.display)}
            </DescText>
        </div>
    </PlainButton>
</div>
