import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { baseUrl, nodeEnv } from "$lib/utils/constants";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/dashboard");
  }

  return {
    user: locals.user,
    jwt: locals.jwt,
  };
};

export const actions: Actions = {
  login: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });

    if (response.ok) {
      const { data } = await response.json();

      cookies.set("jwt", data, {
        httpOnly: true,
        secure: nodeEnv === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      throw redirect(302, "/dashboard");
    } else {
      const { error } = await response.json();
      return { error: error };
    }
  },

  logout: async ({ locals, cookies }) => {
    await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("jwt")}`,
        "Content-Type": "application/json",
      },
      // credentials: "include",
    });

    locals.user = null;

    // Clear the JWT cookie
    cookies.delete("jwt", { path: "/" });

    throw redirect(302, "/auth");
  },
};
