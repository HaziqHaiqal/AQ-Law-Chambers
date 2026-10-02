import { revalidatePath } from "next/cache";
import { Constants, type Enums } from "@/lib/supabase/database.types";

export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<string, string>>;
  savedAt?: number;
};

type EnumName = keyof typeof Constants.public.Enums;

export function asEnum<T extends EnumName>(
  name: T,
  value: string,
): Enums<T> | null {
  return (Constants.public.Enums[name] as readonly string[]).includes(value)
    ? (value as Enums<T>)
    : null;
}

export function revalidateCase(caseId: number) {
  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath(`/portal/cases/${caseId}`);
  revalidatePath("/admin");
}

export const MAX_FILE_BYTES = 50 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];
