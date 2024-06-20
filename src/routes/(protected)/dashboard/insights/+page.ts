import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { createBenefitSchema } from "$lib/domain/validators/Benefit";
import { baseUrl } from "$lib/utils/constants";

export const load: PageLoad = async ({ fetch, parent }) => {
  const form = await superValidate(zod(createBenefitSchema));

  const { jwt } = await parent();

  const response = await fetch(
    `${baseUrl}/api/v1/benefit/benefactor/all/claimed`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      // credentials: "include", // Ensure cookies are included in the request
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch protected data ${await response.json()}`);
  }

  const { data: markers } = await response.json();

  return {
    markers,
    form,
  };
};
