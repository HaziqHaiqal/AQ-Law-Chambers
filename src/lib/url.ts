import { headers } from "next/headers";

/** The address the current request came in on, e.g. https://aq-law-chambers.vercel.app */
export async function siteOrigin() {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${requestHeaders.get("host")}`;
}

export function signUpLink(origin: string, email: string, name: string) {
  return `${origin}/signup?${new URLSearchParams({ email, name })}`;
}
