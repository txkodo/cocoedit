<script lang="ts">
  import "./app.css";
  import {
    DarkMode,
    Dropdown,
    DropdownItem,
    Navbar,
    NavBrand,
  } from "flowbite-svelte";
  import ListEditor from "./lib/ListEditor.svelte";
  import jsonData from "./lib/logs.json";
  import { LogDocEdit } from "./lib/logEditor.svelte";

  const logdoc = new LogDocEdit(jsonData);
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
    <div class="h-full w-full">
      <ListEditor {logdoc} />
      <!-- <Dnd /> -->
    </div>
  </div>
</main>
