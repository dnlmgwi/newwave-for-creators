<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { writable } from "svelte/store";
  import { baseUrl } from "$lib/utils/constants.js";

  export let data;

  const dialogStore = createDialogStore();

  function createDialogStore() {
    const { subscribe, update } = writable(new Map<string, boolean>());

    return {
      subscribe,
      open: (id: string) => update((state) => new Map(state).set(id, true)),
      close: (id: string) => update((state) => new Map(state).set(id, false)),
      reset: () => update(() => new Map()),
    };
  }

  async function handleActivate(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/user/restore`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const { data } = await response.json();
        toast(data);
        invalidateAll();
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error: unknown) {}
  }

  function handleActiveClick(event: Event, id: string) {
    event.preventDefault();
    handleActivate(id);
    dialogStore.close(id);
  }
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <!-- <div class="flex items-center gap-4">
    <div class="relative flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500  text-gray-400"
        ><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"
        ></path></svg
      ><input
        class="flex h-10 border border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-white px-10 py-2 text-sm shadow-sm  bg-gray-950"
        type="search"
        placeholder="Search users..."
        value=""
      />
    </div>
    <div class="flex items-center gap-2"></div>
  </div> -->
  <div class="overflow-auto">
    <div class="relative w-full overflow-auto">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&amp;_tr]:border-b"
          ><tr
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >ID</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Role</th
            ><th
              class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
              >Actions</th
            ></tr
          ></thead
        ><tbody class="[&amp;_tr:last-child]:border-0">
          {#each data.data as user}
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              ><td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{user.id}</td
              ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                ><div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {user.role}
                </div></td
              ><td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
                ><div class="flex items-center justify-end gap-2">
                  <!-- <button
                    on:click={(event) => handleViewClick(event, user.id)}
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >View</button
                  > -->
                  <AlertDialog.Root open={$dialogStore.get(user.id)}>
                    <AlertDialog.Trigger
                      class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >Enable</AlertDialog.Trigger
                    >
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title>Enable</AlertDialog.Title>
                        <AlertDialog.Description>
                          Are you sure you want to enable this account?
                        </AlertDialog.Description>
                      </AlertDialog.Header>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action
                          on:click={(event) =>
                            handleActiveClick(event, user.id)}
                          >Continue</AlertDialog.Action
                        >
                      </AlertDialog.Footer>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                  <!-- <button
                    on:click={(event) => handleDisableClick(event, user.id)}
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >Disable</button
                  > -->
                  <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    color="red">Edit</button
                  > -->
                </div></td
              ></tr
            >
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-400">Showing {data.data.length} users</span
      >
    </div>
    <div class="flex items-center gap-2">
      <button
        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
        disabled
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg
        ></button
      ><button
        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
        >1</button
      ><button
        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
        disabled
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"><path d="m9 18 6-6-6-6"></path></svg
        ></button
      >
    </div>
  </div>
</main>
