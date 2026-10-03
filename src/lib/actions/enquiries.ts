"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  emailError,
  field,
  normaliseEmail,
  phoneError,
} from "@/lib/validation/forms";

export type EnquiryFormState = {
  error?: string;
  sent?: boolean;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

const SEND_FAILED =
  "Your enquiry couldn't be sent. Please try again or call us.";

function messageError(message: string) {
  if (!message) return "Tell us briefly about your matter";
  if (message.length > 1500) return "Keep your message under 1,500 characters";
}

export async function submitEnquiry(
  _prev: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  if (field(formData, "company_website")) return { sent: true };

  const fullName = field(formData, "name");
  const email = normaliseEmail(field(formData, "email"));
  const phone = field(formData, "phone");
  const topic = field(formData, "area") || "General enquiry";
  const message = field(formData, "message");
  const isUrgent = formData.get("urgent") === "on";
  const values = {
    name: fullName,
    email,
    phone,
    area: topic,
    message,
    urgent: isUrgent ? "on" : "",
  };

  const fieldErrors: EnquiryFormState["fieldErrors"] = {};
  if (!fullName) fieldErrors.name = "Enter your full name";
  else if (fullName.length > 100)
    fieldErrors.name = "Keep your name under 100 characters";
  const emailProblem = emailError(email);
  if (emailProblem) fieldErrors.email = emailProblem;
  const phoneProblem = phoneError(phone);
  if (phoneProblem) fieldErrors.phone = phoneProblem;
  const messageProblem = messageError(message);
  if (messageProblem) fieldErrors.message = messageProblem;
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    full_name: fullName,
    email,
    phone: phone || null,
    topic: topic.slice(0, 200),
    message,
    is_urgent: isUrgent,
  });
  if (error) return { error: SEND_FAILED, values };

  return { sent: true };
}

export async function submitPortalEnquiry(
  _prev: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const profile = await requireRole("client");
  const topic = field(formData, "area") || "General enquiry";
  const message = field(formData, "message");
  const isUrgent = formData.get("urgent") === "on";
  const values = { area: topic, message, urgent: isUrgent ? "on" : "" };

  const messageProblem = messageError(message);
  if (messageProblem)
    return { fieldErrors: { message: messageProblem }, values };

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    topic: topic.slice(0, 200),
    message,
    is_urgent: isUrgent,
    source: "portal",
  });
  if (error) return { error: SEND_FAILED, values };

  revalidatePath("/portal/enquiries");
  revalidatePath("/admin", "layout");
  return { sent: true };
}
