<script lang="ts">
  import { BenefitStatus } from "$lib/utils/enums/BenefitStatus.js";
  import { writable } from "svelte/store";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { format } from "timeago.js";
  import { baseUrl } from "$lib/utils/constants.js";

  export let data;

  const dialogOpen = writable(false);

  async function handleDisable(id: string) {
    return await fetch(`${baseUrl}/api/v1/benefit/disable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      // credentials: "include",
      body: JSON.stringify({ id }),
    });
  }

  async function handleEnable(id: string) {
    return await fetch(`${baseUrl}/api/v1/benefit/enable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      // credentials: "include",
      body: JSON.stringify({ id }),
    });
  }

  function handleEnableClick(event: Event, id: string) {
    event.preventDefault();
    handleEnable(id).catch((error) => {
      alert(error);
    });
    window.location.reload();
  }

  function handleDisableClick(event: Event, id: string) {
    event.preventDefault();
    handleDisable(id).catch((error) => {
      alert(error);
    });
    window.location.reload();
  }
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div class="overflow-auto">
    <div class="relative w-full overflow-auto">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&amp;_tr]:border-b"
          ><tr
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Benefit</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Beneficiary</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Benefactor</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Claimed</th
            ><th
              class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
              >Actions</th
            ></tr
          ></thead
        ><tbody class="[&amp;_tr:last-child]:border-0">
          {#each data.data as benefits}
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              ><td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{benefits.benefitId}</td
              ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                ><div
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >
                  {benefits.beneficiaryId}
                </div></td
              ><td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{benefits.benefactorId}</td
              ><td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{format(benefits.claimedAt)}</td
              ><td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
                ><div class="flex items-center justify-end gap-2">
                  <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >Disable</button
                  > -->
                  {#if benefits.status == BenefitStatus.Unavailable}
                    <AlertDialog.Root>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                        >Enable</AlertDialog.Trigger
                      >
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Enable</AlertDialog.Title>
                          <AlertDialog.Description>
                            Are you sure you want to enable this benefit?
                          </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={(event) =>
                              handleEnableClick(event, benefits.id)}
                            >Continue</AlertDialog.Action
                          >
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  {:else}
                    <AlertDialog.Root>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >
                        <i class="iconoir-map px-2 scale-125"
                        ></i>Map</AlertDialog.Trigger
                      >
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Disable</AlertDialog.Title>
                          <AlertDialog.Description>
                            Are you sure you want to disable this benefit?
                          </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={(event) =>
                              handleDisableClick(event, benefits.id)}
                            >Continue</AlertDialog.Action
                          >
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  {/if}

                  <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    color="red"
                  >
                    <i class="iconoir-priority-high px-2 scale-125"
                    ></i>Report</button
                  >
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
      <span class="text-sm text-gray-400"
        >Showing <!-- -->1<!-- --> to <!-- -->10<!-- --> of <!-- -->10<!-- --> users</span
      >
    </div>
    <!-- <div class="flex items-center gap-2">
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
    </div> -->
  </div>
</main>
