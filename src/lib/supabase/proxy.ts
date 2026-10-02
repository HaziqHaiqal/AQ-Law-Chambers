import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [
  "/portal",
  "/admin",
  "/account",
  "/api/documents",
  "/api/invoices",
];
const AUTH_PAGES = ["/login", "/signup"];

function matches(path: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Stops a CDN caching a response that carries someone's session.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname, search } = request.nextUrl;

  let destination: URL | null = null;
  if (!signedIn && matches(pathname, PROTECTED)) {
    destination = new URL("/login", request.url);
    destination.searchParams.set("next", `${pathname}${search}`);
  } else if (signedIn && matches(pathname, AUTH_PAGES)) {
    destination = new URL("/portal", request.url);
  }

  if (!destination) return supabaseResponse;

  const redirect = NextResponse.redirect(destination);
  supabaseResponse.cookies
    .getAll()
    .forEach((cookie) => redirect.cookies.set(cookie));
  supabaseResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "cache-control") redirect.headers.set(key, value);
  });
  return redirect;
}
