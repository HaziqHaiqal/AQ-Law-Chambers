"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PRIVACY_NOTICE_VERSION } from "@/data/privacy";
import { homeFor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  emailError,
  field,
  fullNameError,
  normaliseEmail,
  phoneError,
} from "@/lib/validation/forms";
import { unmetPasswordRules } from "@/lib/validation/password";

export type AuthFormState = {
  error?: string;
  notice?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
  unconfirmedEmail?: string;
};

export type ResendState = { sent?: boolean; error?: string };

const RATE_LIMITED =
  "Too many attempts. Please wait a few minutes and try again.";

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "";
}

async function confirmRedirect() {
  const origin = (await headers()).get("origin") ?? "";
  return `${origin}/api/auth/confirm?next=/portal`;
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = normaliseEmail(field(formData, "email"));
  const password = String(formData.get("password") ?? "");
  const next = safeNext(field(formData, "next"));
  const values = { email };

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  const badEmail = emailError(email);
  if (badEmail) fieldErrors.email = badEmail;
  if (!password) fieldErrors.password = "Enter your password";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.status === 429) return { error: RATE_LIMITED, values };
    if (error.code === "email_not_confirmed")
      return {
        error:
          "Please confirm your email address first. Check your inbox for the link we sent.",
        values,
        unconfirmedEmail: email,
      };
    return { error: "Email or password is incorrect.", values };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  const home = homeFor(profile?.role ?? "client");
  redirect(
    next.startsWith(home) ||
      next.startsWith("/account") ||
      next.startsWith("/api/")
      ? next
      : home,
  );
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = field(formData, "full_name");
  const email = normaliseEmail(field(formData, "email"));
  const phone = field(formData, "phone");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  const consented = formData.get("consent") === "on";
  const values = { full_name: fullName, email, phone };

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  const nameProblem = fullNameError(fullName);
  if (nameProblem) fieldErrors.full_name = nameProblem;
  const emailProblem = emailError(email);
  if (emailProblem) fieldErrors.email = emailProblem;
  const phoneProblem = phoneError(phone);
  if (phoneProblem) fieldErrors.phone = phoneProblem;
  const unmet = unmetPasswordRules(password);
  if (unmet.length)
    fieldErrors.password = `Your password still needs: ${unmet.join(", ").toLowerCase()}.`;
  if (!confirm) fieldErrors.confirm_password = "Re-enter your password";
  else if (confirm !== password)
    fieldErrors.confirm_password = "Passwords do not match";
  if (!consented)
    fieldErrors.consent =
      "You need to agree to the Privacy Notice to create an account";

  if (Object.keys(fieldErrors).length)
    return { error: "Please fix the highlighted fields.", fieldErrors, values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: await confirmRedirect(),
      data: {
        full_name: fullName,
        phone: phone || null,
        privacy_notice_version: PRIVACY_NOTICE_VERSION,
      },
    },
  });

  if (error) {
    if (error.status === 429) return { error: RATE_LIMITED, values };
    switch (error.code) {
      case "user_already_exists":
      case "email_exists":
        return {
          fieldErrors: {
            email:
              "An account with this email already exists. Sign in instead.",
          },
          values,
        };
      case "weak_password":
        return {
          fieldErrors: {
            password:
              "That password is too weak. Use upper and lower case letters, a number and a special character.",
          },
          values,
        };
      case "email_address_invalid":
        return {
          fieldErrors: { email: "Enter a valid email address" },
          values,
        };
      case "signup_disabled":
        return {
          error: "New sign-ups are currently closed. Please contact the firm.",
          values,
        };
      default:
        return {
          error: "We couldn't create your account. Please try again.",
          values,
        };
    }
  }

  if (data.user && data.user.identities?.length === 0)
    return {
      fieldErrors: {
        email: "An account with this email already exists. Sign in instead.",
      },
      values,
    };

  if (data.session) redirect("/portal");

  return {
    notice: `Almost done. We've sent a confirmation link to ${email}. Open it to activate your account.`,
    unconfirmedEmail: email,
  };
}

export async function resendConfirmation(
  _prev: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const email = normaliseEmail(field(formData, "email"));
  if (emailError(email)) return { error: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: await confirmRedirect() },
  });
  if (error) {
    if (error.status === 429)
      return { error: "Please wait a minute before asking for another link." };
    return { error: "We couldn't send the link. Please try again shortly." };
  }
  return { sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
