import { NextResponse, type NextRequest } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { redirectToSignedFile } from "@/lib/downloads";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/invoices/[id]/download">,
) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.redirect(new URL("/login", request.url));

  const invoiceId = Number((await params).id);
  if (!Number.isInteger(invoiceId))
    return new NextResponse("Not found", { status: 404 });

  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("invoice_number, file_path")
    .eq("id", invoiceId)
    .maybeSingle();
  if (!invoice?.file_path)
    return new NextResponse("Not found", { status: 404 });

  return redirectToSignedFile(
    supabase,
    invoice.file_path,
    `${invoice.invoice_number}.pdf`,
  );
}
