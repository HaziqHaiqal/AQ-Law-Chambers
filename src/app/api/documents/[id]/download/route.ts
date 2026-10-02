import { NextResponse, type NextRequest } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { redirectToSignedFile } from "@/lib/downloads";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/documents/[id]/download">,
) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.redirect(new URL("/login", request.url));

  const documentId = Number((await params).id);
  if (!Number.isInteger(documentId))
    return new NextResponse("Not found", { status: 404 });

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("id, case_id, storage_path, file_name")
    .eq("id", documentId)
    .maybeSingle();
  if (!doc) return new NextResponse("Not found", { status: 404 });

  if (profile.role === "client") {
    const { error } = await supabase.from("audit_events").insert({
      action: "document_downloaded",
      actor_id: profile.id,
      case_id: doc.case_id,
      document_id: doc.id,
    });
    if (error)
      return new NextResponse(
        "Could not record the download. Please try again.",
        { status: 500 },
      );
  }

  return redirectToSignedFile(supabase, doc.storage_path, doc.file_name);
}
