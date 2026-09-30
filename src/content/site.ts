// Public-site copy. Firm details come from the A&Q Law Chambers requirements brief.
// Items marked "[to confirm]" are placeholders the firm must supply before launch.

export const firm = {
  name: "A&Q Law Chambers",
  legalName: "A&Q LAW CHAMBERS",
  tagline: "Advocates & Solicitors",
  address: ["AL530 Kompleks Al-Farabi", "Jalan Ilmu 1", "40450 Shah Alam, Selangor"],
  phone: "03-5033330",
  // The brief gives one number; it doubles as the 24/7 hotline until a dedicated line is supplied.
  hotline: "03-5033330",
  hotlineTel: "+6035033330",
  email: "aqlawchambers@gmail.com",
  hours: "Office: Mon – Fri, 9:00am – 6:00pm",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Kompleks+Al-Farabi+Jalan+Ilmu+1+40450+Shah+Alam+Selangor",
};

export const nav = {
  practice: {
    label: "Practice Areas",
    href: "#practice",
  },
  sectors: {
    label: "Sectors",
    href: "#sectors",
  },
  links: [
    { label: "The Firm", href: "#firm" },
    { label: "Partners", href: "#partners" },
    { label: "Emergency Protocol", href: "#emergency" },
    { label: "Contact", href: "#contact" },
  ],
};

export const practiceAreas = [
  {
    id: "injunctions",
    short: "Injunctions & freezing orders",
    title: "Ex Parte Injunctions & Freezing Orders",
    subtitle: "Mareva & Anton Piller",
    body: "Urgent without-notice applications to stop assets being dissipated and evidence being destroyed — domestic and worldwide freezing orders, search orders and preservation relief.",
  },
  {
    id: "disclosure",
    short: "Bank & exchange disclosure",
    title: "Third-Party & Exchange Disclosure",
    subtitle: "Bankers Trust Orders / Norwich Pharmacal",
    body: "Compelling banks, cryptocurrency exchanges and intermediaries to disclose KYC and account information needed to trace funds and identify wrongdoers.",
  },
  {
    id: "evidence",
    short: "Digital evidence",
    title: "Secondary Digital Evidence & Discovery",
    subtitle: "Sections 65 & 66 Evidence Act 1950",
    body: "Securing and proving digital evidence — secondary evidence, notices to produce, and forensic preservation of devices, wallets and cloud accounts.",
  },
] as const;

export const sectors = [
  {
    id: "crypto",
    short: "Crypto & Web3 recovery",
    title: "Cryptocurrency Exchanges & Web3 Asset Recovery",
    body: "Tracing and recovering misappropriated digital assets, from on-chain forensics to freezing exchange accounts and serving offshore platforms.",
  },
  {
    id: "esg",
    short: "ESG & financial fraud",
    title: "ESG Fraud, Carbon Offset & Financial Misrepresentation",
    body: "Litigation over greenwashing, carbon credit fraud and misleading financial statements, for investors, counterparties and corporates.",
  },
  {
    id: "cloud",
    short: "Cloud & technology disputes",
    title: "Cloud Infrastructure & Technology Supply Chain Disputes",
    body: "Disputes over hosting, data-centre and SaaS contracts, service failures and technology supply chains — including urgent access and data-preservation relief.",
  },
] as const;

export const overview = {
  heading: "A focused disputes practice for urgent, high-value matters.",
  paragraphs: [
    "A&Q Law Chambers is a partner-led firm of Advocates & Solicitors based in Shah Alam, Selangor. We act for individuals, companies and investors who need to move quickly — when funds have been misappropriated, assets are at risk of dissipation, or critical evidence may be lost.",
    "Our practice combines High Court emergency relief with the technical capability to trace digital assets across blockchains and borders, so that clients are advised on both the law and the evidence from the first call.",
  ],
  facts: [
    { label: "Registered name", value: "A&Q Law Chambers (Advocates & Solicitors)" },
    { label: "Office", value: "Shah Alam, Selangor, Malaysia" },
    { label: "Core focus", value: "Emergency High Court relief & digital asset recovery" },
    { label: "Availability", value: "24/7 Ex Parte Injunction Hotline" },
  ],
};

export const capabilities = [
  { label: "Mareva & Anton Piller orders", href: "#injunctions" },
  { label: "Bankers Trust & Norwich Pharmacal", href: "#disclosure" },
  { label: "Digital evidence & discovery", href: "#evidence" },
  { label: "Crypto & Web3 asset recovery", href: "#crypto" },
];

export const advantage = {
  local: {
    label: "Local strength",
    title: "High Court emergency relief",
    body: "Deep familiarity with urgent applications before the Malaysian High Court under Order 29 ROC, alongside the equivalent jurisdiction in England & Wales (SCA 1981 s 37).",
    points: ["Certificate of Urgency filings", "Urgent ex parte hearings", "Inter partes return-date strategy"],
  },
  global: {
    label: "Cross-border reach",
    title: "Offshore crypto asset recovery",
    body: "Tracing assets across chains and jurisdictions, and serving orders on overseas exchanges through extra-territorial service-out gateways.",
    points: ["Blockchain forensic tracing", "Alternative service on offshore exchanges", "Multi-jurisdictional enforcement"],
  },
};

export const partners = [
  {
    name: "Nur Afiqah binti Saidin",
    initials: "NA",
    portrait: "/partners/afiqah-saidin.jpg",
    portraitPosition: "50% 100%",
    portraitScale: 1,
    portraitOrigin: "50% 50%",
    contactName: "Nur Afiqah",
    focus: "Emergency High Court litigation",
    summary: "Clear strategy and decisive representation when urgent court protection matters most.",
    role: "Partner · Advocate & Solicitor",
    bio: "Nur Afiqah leads the firm's emergency High Court practice. She advises clients from the first hours of a fraud — building the evidential record, settling the Certificate of Urgency and presenting ex parte applications for freezing, search and disclosure relief.",
    expertise: [
      "Emergency High Court litigation",
      "Ex parte application strategy",
      "Extra-territorial service-out gateways (CPR PD 6B / ROC)",
    ],
    qualifications: ["Advocate & Solicitor, High Court of Malaya", "LL.B. (Hons) — [to confirm]", "Certificate / Bar admission year — [to confirm]"],
  },
  {
    name: "Nur Qisdina Batrisyia binti Arzmisam",
    initials: "NQ",
    portrait: "/partners/qisdina-arzmisam.jpg",
    portraitPosition: "50% 100%",
    portraitScale: 1,
    portraitOrigin: "50% 50%",
    contactName: "Nur Qisdina",
    focus: "Digital assets & forensic evidence",
    summary: "Connecting technical evidence with legal strategy to pursue assets across borders.",
    role: "Partner · Advocate & Solicitor",
    bio: "Nur Qisdina leads the firm's digital asset and evidence work. She coordinates with forensic experts to trace misappropriated funds across wallets and exchanges, and ensures digital evidence is extracted, preserved and presented so it stands up in court.",
    expertise: [
      "Blockchain forensic integration (LIFO tracing)",
      "Digital evidence extraction protocols",
      "Exchange & third-party disclosure",
    ],
    qualifications: ["Advocate & Solicitor, High Court of Malaya", "LL.B. (Hons) — [to confirm]", "Certificate / Bar admission year — [to confirm]"],
  },
];

export const teamMembers = [
  {
    name: "Mike Kelvin Frederick",
    contactName: "Mike Kelvin",
    initials: "MK",
    role: "Senior Partner",
  },
  {
    name: "Sheikh Shabil bin Shahrin",
    contactName: "Sheikh Shabil",
    initials: "SS",
    role: "Junior Partner",
  },
  {
    name: "Siti Batrisyia binti Ridzuan",
    contactName: "Siti Batrisyia",
    initials: "SB",
    role: "Junior Partner",
  },
  {
    name: "Edwan Syakir bin Ahamad Amran",
    contactName: "Edwan Syakir",
    initials: "ES",
    role: "Legal Associate",
  },
  {
    name: "Ilmi Hazeem bin Tajudin",
    contactName: "Ilmi Hazeem",
    initials: "IH",
    role: "Legal Associate",
  },
  {
    name: "Ayu Afeera binti Aminuddin",
    contactName: "Ayu Afeera",
    initials: "AA",
    role: "Legal Associate",
  },
] as const;

export const emergencySteps = [
  {
    title: "Call the hotline immediately",
    body: "Every hour counts when assets can be moved. Call us at any time, day or night, and tell us what is at risk.",
  },
  {
    title: "Do not alert the other side",
    body: "Ex parte relief depends on surprise. Avoid confronting the wrongdoer or posting about the matter publicly.",
  },
  {
    title: "Preserve what you have",
    body: "Keep transaction hashes, wallet addresses, bank statements, screenshots and messages. Do not delete or alter devices.",
  },
  {
    title: "We prepare the urgent application",
    body: "We settle the Certificate of Urgency, affidavit and draft order, and seek an urgent hearing before the High Court.",
  },
];

export const proceedings = [
  { step: "01", title: "Ex Parte Filing", body: "Certificate of Urgency, notice of application, supporting affidavit and draft order are filed at the registry." },
  { step: "02", title: "Ex Parte Hearing", body: "The application is heard without notice to the respondents, and freezing or disclosure orders are sought." },
  { step: "03", title: "Execution / Service", body: "The sealed order is served on the respondents, banks and exchanges, and compliance is supervised." },
  { step: "04", title: "Inter Partes Return Date", body: "All parties return to court, where the order is continued, varied or discharged." },
];
