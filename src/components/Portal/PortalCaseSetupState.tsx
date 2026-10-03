import Link from "next/link";
import { EmptyState } from "@/components/Status/EmptyState";

export function PortalCaseSetupState({ records }: { records: string }) {
  return (
    <EmptyState title="Your case workspace will appear here">
      Your {records} will be available when the firm opens a case for you. Need
      help with a new matter?{" "}
      <Link
        href="/portal/enquiries"
        className="font-medium text-gold-ink hover:text-navy"
      >
        Contact the firm
      </Link>
      .
    </EmptyState>
  );
}
