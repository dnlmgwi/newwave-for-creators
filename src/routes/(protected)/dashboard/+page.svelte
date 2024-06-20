<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Map from "$lib/components/map/Map.svelte";
  import { onMount } from "svelte";

  export let data;

  let url = `${$page.url}/users`;
  let error = "";
  let latitude: number;
  let longitude: number;

  $: lat = latitude;
  $: long = longitude;

  let markers = data.markers;

  const getLocationFromBrowser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      error = "Geolocation is not supported by this browser.";
    }
  };

  const showPosition = (position: GeolocationPosition) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
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

  onMount(() => {
    getLocationFromBrowser();
  });
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
  >
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Users
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number of registered Benefactors.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalUsers}</div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Beneficiaries
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number of registered Beneficiaries.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalBeneficiaries}</div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Benefits
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number of benefits currently available.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalBenefits}</div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Claims
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number of benefits claimed.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalClaims}</div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Activity
        </h3>
        <p class="text-sm text-muted-foreground">
          A map showing the locations of your benefits.
        </p>
      </div>
      <div class="p-6">
        <div class="w-full aspect-[4/3]">
          <div style="width: 100%; height: 100%;">
            <Map latitude={lat} longitude={long} {markers} interactive={true}
            ></Map>
          </div>
        </div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Top Benefits
        </h3>
        <p class="text-sm text-muted-foreground">
          A chart showing the most claimed type of benefit.
        </p>
      </div>
      <div class="p-6">
        <div class="w-full aspect-[4/3]">
          <div style="width: 100%; height: 100%;">
            <div style="position: relative;">
              <!-- Claims By Type  -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
