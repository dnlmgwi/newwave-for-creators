import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  return {
    // user: locals.user,
    jwt: cookies.get("jwt"),
  };
};
