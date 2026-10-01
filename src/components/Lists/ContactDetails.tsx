import { firm } from "@/data/site";
import { Clock, Mail, Phone, Printer } from "@/components/Icons";

const details = [
  {
    icon: Mail,
    label: "Email",
    value: firm.email,
    href: `mailto:${firm.email}`,
  },
  {
    icon: Phone,
    label: "Telephone",
    value: firm.phone,
    href: `tel:${firm.phoneTel}`,
  },
  { icon: Printer, label: "Fax", value: firm.fax },
  {
    icon: Clock,
    label: "Office hours",
    value: "Monday – Friday, 9:00am – 6:00pm",
  },
];

export function ContactDetails() {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {details.map(({ icon: Icon, label, value, href }) => (
        <div
          key={label}
          className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 py-5"
        >
          <dt className="contents">
            <Icon className="row-span-2 mt-0.5 size-[18px] text-gold-ink" />
            <span className="text-xs font-medium tracking-[0.14em] text-slate uppercase">
              {label}
            </span>
          </dt>
          <dd className="col-start-2 mt-1 text-[15px] break-words">
            {href ? (
              <a href={href} className="transition-colors hover:text-gold-ink">
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
