import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "case-files";

export async function redirectToSignedFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string,
  fileName: string,
) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60, { download: fileName });
  if (error || !data)
    return new NextResponse("File not available", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
