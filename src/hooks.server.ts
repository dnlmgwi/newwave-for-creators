import { redirect, type Handle } from "@sveltejs/kit";
import type { User } from "./types";
import { baseUrl } from "$lib/utils/constants";
import { jwtDecode } from "jwt-decode";

export const handle: Handle = async ({ event, resolve }) => {
  const jwt = event.cookies.get("jwt");

  // try {
  if (jwt) {
    // Decode the JWT to get the expiration time
    const decodedToken: { exp: number } = jwtDecode(jwt);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      // Token is expired
      event.cookies.set("jwt", "", { path: "/", maxAge: -1 }); // Clear the cookie
      event.locals.user = null;
      throw redirect(302, "/auth");
    }
    // else {
    // try {
    //   const res = await fetch(`${baseUrl}/api/v1/user/me`, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${jwt}`,
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   if (res.ok) {
    //     const { data } = await res.json();
    //     event.locals.user = data as User;
    //   } else {
    //     event.locals.user = null;
    //     event.cookies.set("jwt", "", { path: "/", maxAge: -1 }); // Clear the cookie
    //     throw redirect(302, "/auth");
    //   }
    // } catch (fetchError) {
    // Handle fetch error (e.g., ECONNREFUSED)
    // event.locals.user = null;
    // event.cookies.set("jwt", "", { path: "/", maxAge: -1 }); // Clear the cookie
    // throw redirect(302, "/auth");
    // }
    // }
    // } else {
    //   event.locals.user = null;
    // }
    // } catch (err) {
    //   event.locals.user = null;
    //   event.cookies.set("jwt", "", { path: "/", maxAge: -1 }); // Clear the cookie in case of error
    //   throw redirect(302, "/auth");
  }

  const protectedRoutes = ["/dashboard"]; // Add more protected routes as needed

  const isProtectedRoute = protectedRoutes.some((route) =>
    event.url.pathname.startsWith(route)
  );

  if (!jwt && isProtectedRoute) {
    return redirect(302, "/auth");
  }

  return resolve(event);
};
