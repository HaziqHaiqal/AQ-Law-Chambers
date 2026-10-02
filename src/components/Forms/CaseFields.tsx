import { FieldLabel } from "@/components/Forms/FieldLabel";
import { SelectField } from "@/components/Forms/SelectField";
import { TextAreaField } from "@/components/Forms/TextAreaField";
import { TextField } from "@/components/Forms/TextField";
import { reliefTypeLabels } from "@/lib/format";
import { Constants, type Tables } from "@/lib/supabase/database.types";

export type CaseFieldValues = Pick<
  Tables<"cases">,
  | "title"
  | "court_reference"
  | "court"
  | "summary"
  | "status"
  | "lead_partner_id"
  | "relief_types"
>;

export function CaseFields({
  values,
  partners,
  errors,
  allowClosed,
}: {
  values: CaseFieldValues;
  partners: { id: string; full_name: string }[];
  errors?: Partial<Record<string, string>>;
  allowClosed: boolean;
}) {
  return (
    <div className="grid gap-5">
      <TextField
        label="Case title"
        name="title"
        maxLength={200}
        defaultValue={values.title ?? ""}
        placeholder="e.g. Wilden v Person Unknown"
        hint="Leave blank during intake. It shows as “To be assigned”."
        error={errors?.title}
      />
      <fieldset className="grid gap-2">
        <legend className="mb-2">
          <FieldLabel>Relief sought</FieldLabel>
        </legend>
        <div className="flex flex-wrap gap-2">
          {Constants.public.Enums.relief_type.map((relief) => (
            <label key={relief} className="cursor-pointer">
              <input
                type="checkbox"
                name="relief_types"
                value={relief}
                defaultChecked={values.relief_types.includes(relief)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3.5 text-[13px] text-slate transition-colors peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-navy/15 hover:border-navy/30">
                {reliefTypeLabels[relief]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Status"
          name="status"
          defaultValue={values.status}
          error={errors?.status}
          options={[
            { value: "intake", label: "Pending Intake" },
            { value: "active", label: "Active" },
            ...(allowClosed ? [{ value: "closed", label: "Closed" }] : []),
          ]}
        />
        <SelectField
          label="Assigned lawyer"
          name="lead_partner_id"
          defaultValue={values.lead_partner_id ?? ""}
          options={[
            { value: "", label: "Not assigned" },
            ...partners.map((partner) => ({
              value: partner.id,
              label: partner.full_name,
            })),
          ]}
        />
        <TextField
          label="Suit number"
          name="court_reference"
          optional
          maxLength={100}
          defaultValue={values.court_reference ?? ""}
          placeholder="e.g. WA-24NCC-123-09/2026"
          error={errors?.court_reference}
        />
        <TextField
          label="Court"
          name="court"
          optional
          maxLength={150}
          defaultValue={values.court ?? ""}
          placeholder="e.g. High Court of Malaya at Kuala Lumpur"
          error={errors?.court}
        />
      </div>
      <TextAreaField
        label="Case summary (shown to the client)"
        name="summary"
        optional
        maxLength={2000}
        defaultValue={values.summary ?? ""}
        error={errors?.summary}
      />
    </div>
  );
}
