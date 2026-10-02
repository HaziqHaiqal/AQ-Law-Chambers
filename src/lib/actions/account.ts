"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { field, fullNameError, phoneError } from "@/lib/validation/forms";
import { unmetPasswordRules } from "@/lib/validation/password";

export type AccountFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<string, string>>;
  savedAt?: number;
};

export async function updateProfile(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const fullName = field(formData, "full_name");
  const phone = field(formData, "phone");
  const organisation = field(formData, "organisation");

  const fieldErrors: AccountFormState["fieldErrors"] = {};
  const nameProblem = fullNameError(fullName);
  if (nameProblem) fieldErrors.full_name = nameProblem;
  const phoneProblem = phoneError(phone);
  if (phoneProblem) fieldErrors.phone = phoneProblem;
  if (organisation.length > 150)
    fieldErrors.organisation = "Organisation must be 150 characters or fewer";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      organisation: organisation || null,
    })
    .eq("id", profile.id);
  if (error)
    return { error: "Your details couldn't be saved. Please try again." };

  revalidatePath("/", "layout");
  return { success: "Your details have been saved.", savedAt: Date.now() };
}

export async function changePassword(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  const fieldErrors: AccountFormState["fieldErrors"] = {};
  if (!current) fieldErrors.current_password = "Enter your current password";
  const unmet = unmetPasswordRules(next);
  if (unmet.length)
    fieldErrors.new_password = `Your new password still needs: ${unmet.join(", ").toLowerCase()}.`;
  else if (next === current)
    fieldErrors.new_password =
      "Choose a password different from your current one";
  if (!confirm) fieldErrors.confirm_password = "Re-enter your new password";
  else if (confirm !== next)
    fieldErrors.confirm_password = "Passwords do not match";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error: wrongPassword } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: current,
  });
  if (wrongPassword) {
    if (wrongPassword.status === 429)
      return {
        error: "Too many attempts. Please wait a few minutes and try again.",
      };
    return {
      fieldErrors: { current_password: "Your current password is incorrect" },
    };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    if (error.code === "weak_password")
      return {
        fieldErrors: {
          new_password:
            "That password is too weak. Use upper and lower case letters, a number and a special character.",
        },
      };
    if (error.code === "same_password")
      return {
        fieldErrors: {
          new_password: "Choose a password different from your current one",
        },
      };
    return { error: "Your password couldn't be changed. Please try again." };
  }

  return { success: "Your password has been changed.", savedAt: Date.now() };
}
