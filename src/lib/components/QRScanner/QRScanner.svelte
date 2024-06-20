<script lang="ts">
  import { onMount } from "svelte";
  import { Html5QrcodeScanner } from "html5-qrcode";

  export let result = "";

  onMount(() => {
    const config = { fps: 10, qrbox: 250 };
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      result = decodedText;
    };

    const qrCodeErrorCallback = (errorMessage: any) => {
      // parse error, ignore it.
    };

    const html5QrCodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      config,
      /* verbose= */ false
    );

    html5QrCodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
  });
</script>

<main>
  <div id="qr-reader" class="w-100"></div>
</main>

<style>
  #qr-reader {
    margin: 0 auto;
  }
</style>
