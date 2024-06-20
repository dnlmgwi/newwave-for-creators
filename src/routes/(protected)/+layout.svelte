<script lang="ts">
  export let data;
</script>

{#if data.jwt}
  <slot />
{:else if data.jwt === undefined}
  <!-- Loading state while waiting for data -->
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md">
      <div class="inline-flex items-center justify-center w-full">
        <p>Loading...</p>
      </div>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md">
      <div class="inline-flex items-center justify-center w-full">
        <p>Redirecting to login...</p>
      </div>
    </div>
  </div>
  <script>
    window.location.href = "/auth";
  </script>
{/if}
