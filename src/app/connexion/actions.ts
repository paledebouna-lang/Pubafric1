"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type LoginState = { error?: string };

export async function loginUser(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      redirectTo: "/missions",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Identifiant ou mot de passe incorrect." };
    }
    throw error;
  }
}
