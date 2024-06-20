import { baseUrl } from "$lib/utils/constants";
import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { userSchema } from "$lib/domain/validators/Profile/profileValidator";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { jwt } = await parent();

  // const response = await fetch(`${baseUrl}/api/v1/user/users/all/beneficiary`, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${jwt}`,
  //     "Content-Type": "application/json",
  //   },
  //   // credentials: "include", // Ensure cookies are included in the request
  // });

  // if (!response.ok) {
  //   throw new Error(`Failed to fetch protected data ${await response.json()}`);
  // }

  const form = await superValidate(zod(userSchema));

  // const { data } = await response.json();

  return {
    form,
    jwt,
  };
};
