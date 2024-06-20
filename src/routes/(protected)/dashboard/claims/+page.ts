import { redirect, type Actions } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Profile, User } from "../../../../types";
import { baseUrl } from "$lib/utils/constants";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { user, jwt } = await parent();

  const response = await fetch(`${baseUrl}/api/v1/claim/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    // credentials: "include", // Ensure cookies are included in the request
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch protected data ${await response.json()}`);
  }

  const { data } = await response.json();

  return {
    user: user,
    data,
    jwt,
  };
};
