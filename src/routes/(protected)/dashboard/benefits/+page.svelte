<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { superForm } from "sveltekit-superforms";
  import { writable, get } from "svelte/store";
  import { createBenefitSchema } from "$lib/domain/validators/Benefit/createBenefitSchema.js";
  import { zod } from "sveltekit-superforms/adapters";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { format } from "timeago.js";
  import SuperDebug from "sveltekit-superforms";
  import type { CreateBenefitDTO } from "$lib/domain/validators/Benefit/createBenefitSchema.js";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";
  import { BenefitStatus } from "$lib/utils/enums/BenefitStatus.js";
  import { onMount } from "svelte";
  import { baseUrl } from "$lib/utils/constants.js";
  import { debounce } from "throttle-debounce";

  export let data;

  let location = "";
  let error = "";

  const createDialogOpen = writable(false);
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

  const { form, errors, constraints, message, enhance, validateForm } =
    superForm(data.form, {
      validators: zod(createBenefitSchema),
    });

  async function handleDisable(id: string) {
    const response = await fetch(`${baseUrl}/api/v1/benefit/disable`, {
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
  }

  async function handleCreate(createBenefit: CreateBenefitDTO) {
    const response = await fetch(`${baseUrl}/api/v1/benefit`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({ ...createBenefit }),
    });

    if (response.ok) {
      createDialogOpen.set(false);
      const { data } = await response.json();
      toast(data);
      invalidateAll();
    } else {
      const { error } = await response.json();
      toast.error(error);
    }
  }

  async function handleEnable(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/benefit/enable`, {
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
    } catch (err) {
      toast.error("Server Error");
    }
  }

  function handleEnableClick(event: Event, id: string) {
    event.preventDefault();
    handleEnable(id);
    dialogStore.close(id);
  }

  const debounceCreateBenefitFunc = debounce(
    5000,
    async (createBenefit: CreateBenefitDTO) => {
      await handleCreate(createBenefit);
    },
    { atBegin: true }
  );

  // Fix This
  async function handleCreateClick(event: Event, data: CreateBenefitDTO) {
    event.preventDefault();
    const result = await validateForm();

    if (result.valid) {
      //We need to debounce this
      debounceCreateBenefitFunc(data);
    } else {
      toast.error("Incomplete Form");
    }
  }

  function handleDisableClick(event: Event, id: string) {
    event.preventDefault();
    handleDisable(id);
    dialogStore.close(id);
  }

  const benefits = [
    { value: "food", label: "Food" },
    { value: "shelter", label: "Shelter" },
    { value: "resources", label: "Resources" },
    { value: "medical", label: "Medical" },
  ];

  const benefitsStatus = [
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

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
</script>

<form>
  <Dialog.Root bind:open={$createDialogOpen}>
    <div class="flex p-4 justify-end">
      <Dialog.Trigger
        class={buttonVariants({ variant: "default" })}
        on:click={() => {
          getLocationFromBrowser();
        }}
      >
        Add Benefit
      </Dialog.Trigger>
    </div>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Add Benefit</Dialog.Title>
        <Dialog.Description>
          Benefits must be made available once created. Click save when you're
          done.
        </Dialog.Description>
      </Dialog.Header>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input
            id="name"
            bind:value={$form.name}
            class="col-span-3"
            aria-invalid={$errors.name ? "true" : undefined}
            {...$constraints.name}
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input
            id="description"
            bind:value={$form.description}
            class="col-span-3"
            aria-invalid={$errors.description ? "true" : undefined}
            {...$constraints.description}
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="location" class="text-right">Location</Label>
          <div class="location-input col-span-3">
            <!-- <Button on:click={getLocationFromBrowser}>
              Get Current Location
            </Button> -->

            <p class="text-nowrap text-sm">
              Lat: {$form.latitude} Long: {$form.longitude}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="type" class="text-right">Type</Label>
          <div class="col-span-3">
            {#each benefits as benefit}
              <div>
                <input
                  type="radio"
                  id={`type-${benefit.value}`}
                  name="type"
                  value={benefit.value}
                  bind:group={$form.type}
                />
                <label for={`type-${benefit.value}`}>{benefit.label}</label>
              </div>
            {/each}
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="status" class="text-right">Status</Label>
          <div class="col-span-3">
            {#each benefitsStatus as status}
              <div>
                <input
                  type="radio"
                  id={`status-${status.value}`}
                  name="status"
                  value={status.value}
                  bind:group={$form.status}
                />
                <label for={`status-${status.value}`}>{status.label}</label>
              </div>
            {/each}
          </div>
        </div>
      </div>
      <Dialog.Footer>
        <Button
          on:click={async (event) => await handleCreateClick(event, $form)}
        >
          Create Benefit
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</form>

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
          {#each data.data as benefits}
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
                  {#if benefits.status === BenefitStatus.Unavailable}
                    <AlertDialog.Root>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >
                        <i class="iconoir-check-circle px-2 scale-125"
                        ></i>Enable
                      </AlertDialog.Trigger>
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
                          >
                            Continue
                          </AlertDialog.Action>
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                    <button
                      class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >
                      <i class="iconoir-edit px-2 scale-125"></i>Edit
                    </button>
                  {:else}
                    <AlertDialog.Root>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >
                        <i class="iconoir-prohibition px-2 scale-125"></i> Disable
                      </AlertDialog.Trigger>
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
                          >
                            Continue
                          </AlertDialog.Action>
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
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
