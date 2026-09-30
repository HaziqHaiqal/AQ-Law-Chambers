// Public-site copy. Firm details come from the A&Q Law Chambers requirements brief and the firm's
// content document (areas of expertise, team profiles, testimonies and contact numbers).

export const firm = {
  name: "A&Q Law Chambers",
  legalName: "A&Q LAW CHAMBERS",
  tagline: "Advocates & Solicitors",
  address: ["AL530 Kompleks Al-Farabi", "Jalan Ilmu 1", "40450 Shah Alam, Selangor"],
  phone: "03-7954 5405",
  phoneTel: "+60379545405",
  fax: "03-7954 0405",
  // The firm has one main line; it doubles as the 24/7 hotline until a dedicated number is supplied.
  hotline: "03-7954 5405",
  hotlineTel: "+60379545405",
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

export type PracticeArea = {
  id: string;
  short: string;
  title: string;
  subtitle?: string;
  body: string[];
  /** Optional list shown as tags beneath the description. */
  list?: { label: string; items: string[] };
};

export const practiceAreas: PracticeArea[] = [
  {
    id: "arbitration",
    short: "Mediation & arbitration",
    title: "Mediation & Arbitration",
    subtitle: "KLRCA · SIAC · ICC · ICC-CMI · UNCITRAL",
    body: [
      "Our Arbitration & Mediation Practice Group delivers innovative, custom-made solutions to serve each client’s specific needs. Our lawyers are responsive, effective and strategic.",
      "Our lawyers are members of the world’s major arbitral institutions and have experience arbitrating in proceedings held under the KLRCA, SIAC, ICC, ICC-CMI and UNCITRAL rules, cementing our solid reputation as a leading international arbitration practice.",
    ],
  },
  {
    id: "employment",
    short: "Employment",
    title: "Employment & Industrial Relations",
    body: [
      "Our Employment & Industrial Relations Practice Group continues to offer comprehensive representation and assistance to clients involved in various stages of employment-related dispute resolution.",
      "We have been engaged in cases that have contributed to the evolution and expansion of administrative law in this country. The practice continues to keep abreast of changes to the law to regularly advise clients on the nature and implications of key amendments.",
    ],
  },
  {
    id: "insurance",
    short: "Insurance",
    title: "Insurance",
    subtitle: "Insurance, reinsurance & takaful",
    body: [
      "Our dedicated insurance team is experienced in regulatory and compliance advisory and insurance disputes. We offer comprehensive and efficient services to industry participants, from regulatory and compliance frameworks to their implementation and enforcement, as well as the assessment of coverage and the handling of disputes.",
      "We handle both insurance and reinsurance law, and are familiar with conventional and takaful products.",
    ],
    list: {
      label: "Products we advise on include",
      items: [
        "Aviation insurance",
        "Bankers bond policies",
        "General liability",
        "Cyber liability",
        "Directors & officers liability",
        "Marine insurance",
        "Comprehensive crime",
        "Professional indemnity",
        "Professional malpractice",
      ],
    },
  },
  {
    id: "litigation",
    short: "Civil litigation",
    title: "Civil Litigation",
    body: [
      "Whatever the disagreement or dispute, we will seek to understand your unique position and the expectations that you may have. We will tailor our pre-court strategic analysis and litigation plan to suit your specific situation and to achieve the resolution and remedy that you desire.",
      "At A&Q Law Chambers, we take pride in our client care and will ensure that our clients are always informed and in control of their case.",
    ],
  },
  {
    id: "real-estate",
    short: "Real estate",
    title: "Real Estate",
    body: [
      "Our Real Estate Practice Group provides a full range of corporate real estate services. Leveraging their combined depth and breadth of experience, our lawyers in this practice have provided significant advice on many of the nation’s largest property transactions.",
      "We also advise on and assist clients with integral real estate matters, such as applications for the regulatory approvals required from the relevant Government and statutory bodies — including the Economic Planning Unit of the Prime Minister’s Department, Bank Negara Malaysia, State Authorities and the Estate Land Board.",
    ],
  },
];

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

// Partner roles and biographies are as supplied by the firm.
export const partners = [
  {
    name: "Nur Afiqah binti Saidin",
    title: "Managing Partner",
    initials: "NA",
    portrait: "/partners/afiqah.jpg",
    portraitPosition: "50% 100%",
    portraitScale: 1,
    portraitOrigin: "50% 50%",
    contactName: "Nur Afiqah",
    focus: "Employment, civil litigation & dispute resolution",
    summary: "Leads the firm with a strong commitment to delivering strategic, results-driven legal solutions.",
    bio: "Nur Afiqah, the managing partner of A&Q Law Chambers, leads the firm with a strong commitment to delivering strategic, results-driven legal solutions while overseeing its overall direction and operations. She completed her Pupillage at the renowned Haresh Mahadevan & Co, gaining substantial exposure to both contentious and non-contentious work prior to her admission to the Malaysian Bar. Her areas of practice include Employment & Industrial Relation, Civil litigation and Dispute Resolution.",
  },
  {
    name: "Nur Qisdina Batrisyia binti Arzmisam",
    title: "Senior Partner",
    initials: "NQ",
    portrait: "/partners/qisdina.jpg",
    portraitPosition: "50% 100%",
    portraitScale: 1,
    portraitOrigin: "50% 50%",
    contactName: "Nur Qisdina",
    focus: "Real estate & insurance",
    summary: "Advising on property transactions, financing arrangements and insurance-related disputes.",
    bio: "Nur Qisdina Batrisyia, a senior partner, focuses on real estate and insurance matters, advising clients on property transactions, financing arrangements, and insurance-related disputes with a practical and solutions-oriented approach. She completed her pupillage at Zaid Ibrahim & Co., where she gained valuable exposure to Civil litigation, conveyancing and insurance litigation before being admitted to the Malaysian Bar. Her practice is defined by meticulous attention to detail, strong commercial awareness, and a commitment to delivering clear, efficient, and results-oriented legal solutions.",
  },
];

export const teamMembers = [
  {
    name: "Mike Kelvin Frederick",
    contactName: "Mike Kelvin",
    initials: "MK",
    role: "Junior Partner",
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

export const testimonials = [
  {
    quote:
      "Saya amat berpuas hati dengan khidmat firma ini. Mereka bertindak pantas memfailkan Permohonan Injunksi Mareva untuk melindungi kepentingan saya.",
    lang: "ms",
    name: "Dato’ Fazz Fairiz",
    role: "Founder, Fazz’s Jewels",
  },
  {
    quote:
      "From the first consultation to the court’s decision, I could see the team’s strong commitment and professionalism. I would not hesitate to recommend this firm to others.",
    lang: "en",
    name: "Angelica Jonie",
    role: "Director, Angie’s Beauty",
  },
  {
    quote:
      "I am grateful to A&Q Law Chambers for their guidance and enlightenment on my employment contract. They not only understood the legal aspect but were also sensitive to the emotional challenges involved.",
    lang: "en",
    name: "Natalia Hudsin",
    role: "Head of Account Department, Lim and Lee Accounting Firm",
  },
];

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
