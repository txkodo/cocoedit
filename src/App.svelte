<script lang="ts">
  import "./app.css";
  import { Button, DarkMode, Navbar, NavBrand } from "flowbite-svelte";
  import ListEditor from "./lib/ListEditor.svelte";
  import jsonData from "./lib/logs.json";
  import { LogDocEdit } from "./lib/logEditor.svelte";
  import Sidebar from "./lib/parts/Sidebar.svelte";

  const logdoc = new LogDocEdit(jsonData);
  let spanClass = "flex-1 ms-3 whitespace-nowrap";

  let isOpen = $state(false);
</script>

<main class="h-screen flex flex-col">
  <div>
    <Navbar fluid>
      <!-- オーバーレイ＋サイドバー -->
      <NavBrand href="/">
        <span
          class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
          >Log</span
        >
      </NavBrand>
      <Button
        class="md:hidden"
        onclick={() => (isOpen = !isOpen)}
        aria-label="Toggle sidebar"
      />
      <DarkMode />
    </Navbar>
  </div>
  <div class="flex overflow-hidden">
    <Sidebar {logdoc} />
    <div class="h-full w-full">
      <ListEditor {logdoc} />
    </div>
  </div>
</main>
