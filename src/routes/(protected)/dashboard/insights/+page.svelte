<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Map from "$lib/components/map/Map.svelte";
  import { onMount } from "svelte";
  import * as Resizable from "$lib/components/ui/resizable";
  export let data;

  let url = `${$page.url}/users`;
  let error = "";
  let latitude: number;
  let longitude: number;

  $: lat = latitude;
  $: long = longitude;

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
  <div class="h-screen overflow-auto w-full">
    <Resizable.PaneGroup direction="horizontal" class=" rounded-lg border">
      <Resizable.Pane defaultSize={40}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Options</span>
        </div>
      </Resizable.Pane>
      <Resizable.Handle withHandle />
      <Resizable.Pane defaultSize={60}>
        <div class="flex h-full items-center justify-center p-6">
          <Map
            latitude={lat}
            longitude={long}
            markers={data.markers}
            interactive={true}
          ></Map>
        </div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </div>
</main>
