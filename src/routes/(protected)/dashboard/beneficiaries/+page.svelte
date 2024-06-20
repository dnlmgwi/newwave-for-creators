<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { derived, writable } from "svelte/store";
  import { baseUrl } from "$lib/utils/constants.js";
  import * as Resizable from "$lib/components/ui/resizable";
  import { Result } from "$lib/domain/valueObjects/Result";
  import type { UserDTO } from "$lib/domain/valueObjects/ProfileDTO.js";
  import { superForm } from "sveltekit-superforms";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label";
  import Map from "$lib/components/map/Map.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { createBenefitSchema } from "$lib/domain/validators/Benefit/createBenefitSchema.js";
  import { zod } from "sveltekit-superforms/adapters";

  import { format } from "timeago.js";
  import SuperDebug from "sveltekit-superforms";
  import type { CreateBenefitDTO } from "$lib/domain/validators/Benefit/createBenefitSchema.js";

  import { BenefitStatus } from "$lib/utils/enums/BenefitStatus.js";
  import { onMount } from "svelte";
  import { debounce } from "throttle-debounce";
  import { page } from "$app/stores";

  export let data;

  let location = "";
  let error = "";

  export const currentPath = derived(page, ($page) => $page.url.pathname);

  const dialogOpen = writable(false);

  const createDialogOpen = writable(false);

  const { form, errors, constraints, message, enhance, validateForm } =
    superForm(data.form, {
      dataType: "json",
    });

  async function handleCreate(createBenefit: UserDTO) {
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

  const debounceCreateBenefitFunc = debounce(
    5000,
    async (createBenefit: UserDTO) => {
      await handleCreate(createBenefit);
    },
    { atBegin: true }
  );

  // Fix This
  async function handleCreateClick(event: Event, data: UserDTO) {
    event.preventDefault();
    const result = await validateForm();

    if (result.valid) {
      //We need to debounce this
      debounceCreateBenefitFunc(data);
    } else {
      toast.error("Incomplete Form");
    }
  }

  async function handleView(id: string): Promise<Result<UserDTO>> {
    try {
      const response = await fetch(`${baseUrl}/api/v1/user/profile/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        return Result.ok<UserDTO>(data);
      } else {
        const { error } = await response.json();
        console.log("data", error);
        toast.error(error);
        return Result.fail<UserDTO>(error);
      }
    } catch (error: unknown) {
      toast.error("Server Error");
      dialogOpen.set(false);
      return Result.fail<UserDTO>("Server Error");
    }
  }

  async function handleViewClick(event: Event, id: string) {
    event.preventDefault();
    console.log("Selected Profile", id);
    $form = (await handleView(id)).getValue();
  }

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
      f.profile.latitude = parseFloat(position.coords.latitude.toString());
      f.profile.longitude = parseFloat(position.coords.longitude.toString());
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

<div class="flex p-4 justify-end">
  <Button
    class={buttonVariants({ variant: "default" })}
    on:click={(event) => goto(`${$currentPath}/new`)}
  >
    Add Beneficiary
  </Button>
</div>
<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div class="h-screen overflow-auto w-full">
    <Resizable.PaneGroup direction="horizontal" class=" rounded-lg border">
      <Resizable.Pane defaultSize={50}>
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
      ><Input
        class="flex h-10 border border-Input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-white px-10 py-2 text-sm shadow-sm  bg-gray-950"
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
                      ><td
                        class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                        ><div
                          class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          data-v0-t="badge"
                        >
                          {user.role}
                        </div></td
                      ><td
                        class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
                        ><div class="flex items-center justify-end gap-2">
                          <button
                            on:click={async (event) =>
                              await handleViewClick(event, user.id)}
                            class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                            >View</button
                          >
                          <!-- <AlertDialog.Root bind:open={$dialogOpen}>
                    <AlertDialog.Trigger
                      class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >Disable</AlertDialog.Trigger
                    >
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title>Disable</AlertDialog.Title>
                        <AlertDialog.Description>
                          Are you sure you want to disable this account?
                        </AlertDialog.Description>
                      </AlertDialog.Header>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action
                          on:click={(event) =>
                            handleDisableClick(event, user.id)}
                          >Continue</AlertDialog.Action
                        >
                      </AlertDialog.Footer>
                    </AlertDialog.Content>
                  </AlertDialog.Root> -->
                          <!-- <button
                    on:click={(event) => handleDisableClick(event, user.id)}
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >Disable</button
                  > -->
                          <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
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
              <span class="text-sm text-gray-400"
                >Showing {data.data.length} users</span
              >
            </div>
            <div class="flex items-center gap-2">
              <button
                class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
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
                class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
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
      </Resizable.Pane>
      <Resizable.Handle withHandle />
      <Resizable.Pane defaultSize={50}>
        {#if $form.id}
          <div class="flex h-full p-6 flex-col overflow-y-auto">
            <!-- <pre class="font-semibold">{JSON.stringify($form, null, 2)}</pre> -->

            <form class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- <div class="grid col-span-2">
                <div class="w-full aspect-[4/3]">
                  <div style="width: 100%; height: 100%;">
                    <Map
                      latitude={$form.profile.latitude}
                      longitude={$form.profile.longitude}
                      markers={[
                        {
                          latitude: $form.profile.latitude,
                          longitude: $form.profile.longitude,
                        },
                      ]}
                      interactive={true}
                    ></Map>
                  </div>
                </div>
              </div> -->
              <div>
                <Label for="id">ID</Label>
                <Input
                  id="id"
                  type="text"
                  disabled
                  bind:value={$form.profile.id}
                  readonly
                />
              </div>

              <div>
                <Label for="role">Role</Label>
                <Input
                  id="role"
                  type="text"
                  disabled
                  bind:value={$form.role}
                  readonly
                />
              </div>

              <div>
                <Label for="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  disabled
                  bind:value={$form.profile.firstName}
                  readonly
                />
              </div>

              <div>
                <Label for="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  disabled
                  bind:value={$form.profile.lastName}
                  readonly
                />
              </div>

              <div>
                <Label for="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  disabled
                  bind:value={$form.profile.dateOfBirth}
                  readonly
                />
              </div>

              <div>
                <Label for="gender">Gender</Label>
                <select
                  id="gender"
                  disabled
                  bind:value={$form.profile.gender}
                  class="input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label for="ageGroup">Age Group</Label>
                <select
                  id="ageGroup"
                  disabled
                  bind:value={$form.profile.ageGroup}
                  class="input"
                >
                  <option value="child">Child</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div>
                <Label for="currentLivingSituation"
                  >Current Living Situation</Label
                >
                <Input
                  id="currentLivingSituation"
                  type="text"
                  disabled
                  bind:value={$form.profile.currentLivingSituation}
                />
              </div>

              <div>
                <Label for="referringAgency">Referring Agency</Label>
                <Input
                  id="referringAgency"
                  type="text"
                  disabled
                  bind:value={$form.profile.referringAgency}
                />
              </div>

              <div>
                <Label for="caseManager">Case Manager</Label>
                <Input
                  id="caseManager"
                  type="text"
                  disabled
                  bind:value={$form.profile.caseManager}
                />
              </div>

              <div>
                <Label for="alternateContact">Alternate Contact</Label>
                <Input
                  id="alternateContact"
                  type="text"
                  disabled
                  bind:value={$form.profile.alternateContact}
                />
              </div>

              <div>
                <Label for="qualifyingDisability">Qualifying Disability</Label>
                <select
                  id="qualifyingDisability"
                  disabled
                  bind:value={$form.profile.qualifyingDisability}
                  class="input"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <Label for="knownHealthIssues">Known Health Issues</Label>
                <Input
                  id="knownHealthIssues"
                  type="text"
                  disabled
                  bind:value={$form.profile.knownHealthIssues}
                />
              </div>

              <div>
                <Label for="householdMembers">Household Members</Label>
                <Input
                  id="householdMembers"
                  type="number"
                  disabled
                  bind:value={$form.profile.householdMembers}
                />
              </div>

              <!-- <div>
                <Label for="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  disabled
                  bind:value={$form.profile.latitude}
                  readonly
                />
              </div>

              <div>
                <Label for="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  disabled
                  bind:value={$form.profile.longitude}
                  readonly
                />
              </div> -->
            </form>
          </div>
        {:else}
          <div class="flex h-full items-center justify-center p-6 flex-col">
            <i class="iconoir-profile-circle scale-125"></i>
            <p class="text-gray-900">Select a profile</p>
          </div>
        {/if}
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </div>
</main>
