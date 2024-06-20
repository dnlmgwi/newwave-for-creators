<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { superForm } from "sveltekit-superforms";
  import { writable, get } from "svelte/store";
  import { createBenefitSchema } from "$lib/domain/validators/Benefit";
  import { zod } from "sveltekit-superforms/adapters";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { format } from "timeago.js";
  import SuperDebug from "sveltekit-superforms";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";
  import { BenefitStatus } from "$lib/utils/enums/BenefitStatus.js";
  import { onMount } from "svelte";
  import {
    claimBenefitSchema,
    type ClaimBenefitDTO,
  } from "$lib/domain/validators/Benefit/claimBenefitSchema.js";
  import QRScanner from "$lib/components/QRScanner/QRScanner.svelte";
  import { baseUrl } from "$lib/utils/constants.js";
  import { debounce } from "throttle-debounce";

  export let data;

  let location = "";
  let error = "";

  let scanned;

  const dialogOpen = writable(new Array(data.data.length).fill(false));

  const { form, errors, constraints, message, enhance, validateForm } =
    superForm(data.form, {
      validators: zod(claimBenefitSchema),
    });

  async function handleClaim(claimBenefit: ClaimBenefitDTO, index: number) {
    const response = await fetch(`${baseUrl}/api/v1/benefit/claim`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      // credentials: "include",
      body: JSON.stringify({ ...claimBenefit }),
    });

    if (response.ok) {
      const { data } = await response.json();
      toast(data);
      invalidateAll();
      dialogOpen.set(new Array(data.data.length).fill(false));
      toggleDialog(index);
    } else {
      const { error } = await response.json();
      toast.error(error);
    }
  }

  function handleClaimClick(
    event: Event,
    data: ClaimBenefitDTO,
    index: number
  ) {
    event.preventDefault();
    debounceClaimBenefitFunc(data, index);
  }

  const debounceClaimBenefitFunc = debounce(
    5000,
    async (data: ClaimBenefitDTO, index: number) => {
      await handleClaim(data, index);
    },
    { atBegin: true }
  );

  const getLocationFromBrowser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      error = "Geolocation is not supported by this browser.";
    }
  };

  const showPosition = (position: GeolocationPosition) => {
    location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    form.update((f) => {
      f.latitude = parseFloat(position.coords.latitude.toString());
      f.longitude = parseFloat(position.coords.longitude.toString());
      return f;
    });
  };

  const showError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
    }
  };

  function toggleDialog(index: number) {
    dialogOpen.update((n) => {
      const updated = [...n];
      updated[index] = !updated[index];
      return updated;
    });
  }
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div class="overflow-auto">
    <div class="relative w-full overflow-auto">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&amp;_tr]:border-b">
          <tr
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Type</th
            >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Name</th
            >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Status</th
            >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Created At</th
            >
            <th
              class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
              >Actions</th
            >
          </tr>
        </thead>
        <tbody class="[&amp;_tr:last-child]:border-0">
          {#each data.data as benefits, index}
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {benefits.type}
                </div>
              </td>
              <td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{benefits.name}</td
              >
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {benefits.status}
                </div>
              </td>
              <td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{format(new Date(benefits.createdAt), "Pp")}</td
              >
              <td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
              >
                <div class="flex items-center justify-end gap-2">
                  {#if benefits.status === BenefitStatus.Available}
                    <Dialog.Root bind:open={$dialogOpen[index]}>
                      <Dialog.Trigger
                        class={buttonVariants({ variant: "default" })}
                        on:click={() => {
                          $form.id = benefits.id;
                          toggleDialog(index);
                        }}>Claim</Dialog.Trigger
                      >
                      <Dialog.Content class="sm:max-w-[425px]">
                        <Dialog.Header>
                          <Dialog.Title>Claim Benefit</Dialog.Title>
                          <Dialog.Description>
                            A Benefit can only be claimed once.
                          </Dialog.Description>
                        </Dialog.Header>
                        <div class="grid gap-4 py-4">
                          <div class="grid grid-cols-1 items-center gap-4">
                            <QRScanner bind:result={$form.beneficiary}
                            ></QRScanner>
                          </div>
                          <div class="grid grid-cols-4 items-center gap-4">
                            <!-- <Label for="name" class="text-right"
                              >Beneficiary</Label
                            > -->
                            <Input
                              id="beneficiary"
                              disabled
                              bind:value={$form.beneficiary}
                              class="col-span-3 hidden"
                            />
                          </div>
                          <div class="grid grid-cols-4 items-center gap-4">
                            <!-- <Label for="benefit" class="text-right"
                              >Benefit</Label
                            > -->
                            <Input
                              id="benefit"
                              disabled
                              bind:value={$form.id}
                              class="col-span-3 hidden"
                            />
                          </div>
                        </div>
                        <Dialog.Footer>
                          <Button
                            type="submit"
                            on:click={(event) =>
                              handleClaimClick(event, $form, index)}
                            >Claim Benefit</Button
                          >
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500"
        >Showing <!-- -->1<!-- --> to <!-- -->10<!-- --> of <!-- -->10<!-- --> users</span
      >
    </div>
  </div>
</main>
