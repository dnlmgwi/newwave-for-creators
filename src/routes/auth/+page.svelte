<script lang="ts">
  import { goto } from "$app/navigation";
  import Input from "$lib/components/ui/input/input.svelte";
  import { baseUrl } from "$lib/utils/constants";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";

  // export let data;

  let phone = "";
  let password = "";
  let error = "";

  // async function handleLogin(event: Event) {
  //   try {
  //     const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ phone, password }),
  //     });

  //     if (response.ok) {
  //       const { data } = await response.json();

  //       data.jwt = data;

  //       goto("/dashboard");
  //       invalidateAll();
  //     } else {
  //       const { error } = await response.json();
  //       toast.error(error || "Login failed");
  //     }
  //   } catch (err) {
  //     toast.error("Login failed");
  //   }
  // }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <form method="POST" action="?/login" class="w-full max-w-md">
    <div class="mx-auto max-w-md space-y-6">
      <div class="space-y-2 text-center">
        <h1 class="text-3xl font-bold">Login</h1>
        <p class="text-gray-500"></p>
      </div>
      <div class="space-y-4">
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="phone"
          >
            Phone
          </label>
          <Input
            class="w-full"
            id="phone"
            name="phone"
            placeholder="265-00-000-0000"
            required
            type="tel"
            bind:value={phone}
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="password"
          >
            Password
          </label>
          <Input
            class=" w-full"
            id="password"
            name="password"
            required
            type="password"
            bind:value={password}
          />
        </div>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          type="submit"
        >
          Login
        </button>
      </div>
      <div class="inline-flex items-center justify-center w-full">
        <p>
          Don't Have an account? <span
            ><a href="/auth/signup">Create Account</a></span
          >
        </p>
      </div>
    </div>
  </form>
</div>
