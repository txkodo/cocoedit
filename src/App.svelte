<script lang="ts">
  import "./app.css";
  import { DarkMode, Navbar, NavBrand } from "flowbite-svelte";
  import ListEditor from "./lib/ListEditor.svelte";
</script>

<main class="h-screen flex flex-col">
  <div>
    <Navbar fluid>
      <NavBrand href="/">
        <span
          class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
          >Log</span
        >
      </NavBrand>
      <DarkMode />
    </Navbar>
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- <div
      id="sidebar1"
      aria-controls="sidebar1"
      aria-labelledby="sidebar1"
      class="overflow-y-auto z-50 p-4 inset-y-0 start-0 w-80"
      tabindex="-1"
    >
    </div> -->

    <div class="h-full w-full">
      <ListEditor />
    </div>
  </div>
</main>
