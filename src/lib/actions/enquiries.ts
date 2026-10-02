"use server";

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
  if (!message) fieldErrors.message = "Tell us briefly about your matter";
  else if (message.length > 1500)
    fieldErrors.message = "Keep your message under 1,500 characters";
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
  if (error)
    return {
      error: "Your enquiry couldn't be sent. Please try again or call us.",
      values,
    };

  return { sent: true };
}
