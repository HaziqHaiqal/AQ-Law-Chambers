import { firm } from "@/data/site";

export const PRIVACY_NOTICE_VERSION = "2026-10";

export const privacyNotice = {
  updated: "2 October 2026",
  sections: [
    {
      heading: "Who we are",
      body: [
        `${firm.legalName} (${firm.tagline}) of ${firm.address.join(", ")} is the data user responsible for the personal data described in this notice.`,
      ],
    },
    {
      heading: "What we collect",
      body: [
        "Your name, email address and telephone number when you create an account or send us an enquiry.",
        "Case documents, messages and updates exchanged through your account, and a record of when you sign in and download documents.",
      ],
    },
    {
      heading: "Why we use it",
      body: [
        "To act on your case, communicate with you, keep proof that court papers were delivered to you, issue invoices, and meet our professional and legal obligations.",
      ],
    },
    {
      heading: "Who sees it",
      body: [
        "Only the partners and staff of the firm working on your case. We disclose personal data to courts, counsel, experts or regulators only where your case or the law requires it.",
      ],
    },
    {
      heading: "How we protect it",
      body: [
        "Account data is stored with access controls so that each client can see only their own case. Passwords are stored as one-way hashes and are never visible to the firm.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You may ask to access or correct your personal data, or withdraw your consent, by writing to ${firm.email}. Withdrawing consent may mean we can no longer provide online access to your case.`,
      ],
    },
  ],
};
