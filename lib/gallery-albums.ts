/**
 * Real gallery albums — rendered directly from code on the gallery page
 * (no DB round-trip), one scrollable card per album/event.
 */
export type GalleryAlbum = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  photos: { src: string; caption: string }[];
};

export const galleryAlbums: GalleryAlbum[] = [
  {
    slug: "faiita-election-2025-lucknow",
    title: "FAIITA Election 2025 — Lucknow",
    eyebrow: "2025 · Lucknow",
    description:
      "In 2025, FAIITA's election for President and the national team was held at Lucknow, with delegates of member state associations from across India in attendance. Navin Gupta was elected President of FAIITA for the 2025–27 tenure, with Devesh Rastogi taking on the role of Chairman.",
    photos: [
      { src: "/images/gallery/faiita-election-2025-lucknow-01.jpg", caption: "Delegates gather in Lucknow for the FAIITA Election 2025" },
      { src: "/images/gallery/faiita-election-2025-lucknow-10.jpg", caption: "State association leaders from across India at the election proceedings" },
      { src: "/images/gallery/faiita-election-2025-lucknow-11.jpg", caption: "Members of FAIITA's state associations during the 2025 election in Lucknow" },
      { src: "/images/gallery/faiita-election-2025-lucknow-12.jpg", caption: "Delegates in discussion during the FAIITA Election 2025" },
      { src: "/images/gallery/faiita-election-2025-lucknow-13.jpg", caption: "Leaders of the IT channel fraternity convene for the election" },
      { src: "/images/gallery/faiita-election-2025-lucknow-14.jpg", caption: "Proceedings of the FAIITA Election 2025 at Lucknow" },
      { src: "/images/gallery/faiita-election-2025-lucknow-15.jpg", caption: "Delegates participate in the election of FAIITA's President and team" },
      { src: "/images/gallery/faiita-election-2025-lucknow-16.jpg", caption: "State association representatives at the Lucknow election event" },
      { src: "/images/gallery/faiita-election-2025-lucknow-17.jpg", caption: "Members gathered during the FAIITA Election 2025 proceedings" },
      { src: "/images/gallery/faiita-election-2025-lucknow-18.jpg", caption: "The IT trade community from across India meets in Lucknow" },
      { src: "/images/gallery/faiita-election-2025-lucknow-19.jpg", caption: "Delegates during the election of the 2025–27 national team" },
      { src: "/images/gallery/faiita-election-2025-lucknow-02.jpg", caption: "Leaders felicitated at the FAIITA Election 2025 in Lucknow" },
      { src: "/images/gallery/faiita-election-2025-lucknow-03.jpg", caption: "Delegates of FAIITA's member associations at the 2025 election" },
      { src: "/images/gallery/faiita-election-2025-lucknow-04.jpg", caption: "State leaders come together for the FAIITA Election 2025" },
      { src: "/images/gallery/faiita-election-2025-lucknow-05.jpg", caption: "The election proceedings underway at Lucknow" },
      { src: "/images/gallery/faiita-election-2025-lucknow-06.jpg", caption: "Delegates at the FAIITA Election 2025, hosted in Lucknow" },
      { src: "/images/gallery/faiita-election-2025-lucknow-07.jpg", caption: "The newly elected FAIITA team for 2025–27, led by President Navin Gupta" },
      { src: "/images/gallery/faiita-election-2025-lucknow-08.jpg", caption: "Group photograph of delegates with the newly elected team for 2025–27" },
      { src: "/images/gallery/faiita-election-2025-lucknow-09.jpg", caption: "Members of the federation at the close of the FAIITA Election 2025" },
    ],
  },
  {
    slug: "faiita-patrika-launch-2025-26",
    title: "FAIITA Patrika 2025–26 — Launch",
    eyebrow: "2025–26",
    description:
      "FAIITA Patrika 2025–26, published by the Federation of All India IT Associations, was released covering IT association activities across India — documenting key activities, leadership messages, and industry trends shaping India's IT channel ecosystem.",
    photos: [
      { src: "/images/gallery/faiita-patrika-launch-2025-26-01.jpg", caption: "FAIITA leadership at the launch of FAIITA Patrika 2025–26" },
    ],
  },
  {
    slug: "it-india-expo-2025-ludhiana",
    title: "IT India Expo 2025 — Ludhiana",
    eyebrow: "August 2025 · Ludhiana",
    description:
      "The IT India Expo 2025 was held in Ludhiana from 22–24 August at Hotel Regenta Classik, jointly hosted by the Association of Computer Entrepreneurs (ACE) Ludhiana with PACT and FAIITA, and inaugurated by Punjab Finance Minister S. Harpal Singh Cheema.",
    photos: [
      { src: "/images/gallery/it-india-expo-2025-ludhiana-02.jpg", caption: "Punjab Finance Minister S. Harpal Singh Cheema inaugurates the IT India Expo 2025 with FAIITA and PACT leadership" },
      { src: "/images/gallery/it-india-expo-2025-ludhiana-03.jpg", caption: "Dignitaries at the lamp-lighting ceremony marking the start of the IT India Expo 2025 in Ludhiana" },
      { src: "/images/gallery/it-india-expo-2025-ludhiana-01.jpg", caption: "Coverage of the IT India Expo 2025 inauguration in Ludhiana" },
    ],
  },
  {
    slug: "pact-brands-meet-ludhiana",
    title: "PACT Meeting with Brands — Ludhiana",
    eyebrow: "Ludhiana, Punjab",
    description:
      "PACT (Punjab Association of Computer Traders) kicked off its meeting series with IT brands at Ludhiana, Punjab — bringing member dealers and brand representatives to one table to strengthen the state's IT channel ecosystem.",
    photos: [
      { src: "/images/gallery/pact-brands-meet-ludhiana-01.jpg", caption: "PACT's meeting with IT brands gets underway in Ludhiana, Punjab" },
      { src: "/images/gallery/pact-brands-meet-ludhiana-02.jpg", caption: "PACT members and brand representatives at the Ludhiana meet" },
    ],
  },
  {
    slug: "ncn-meet-new-delhi-2024",
    title: "NCN Meet — New Delhi",
    eyebrow: "2024 · New Delhi",
    description:
      "FAIITA leadership met with the National Computer News (NCN) team in New Delhi in 2024, strengthening ties between the federation and one of the IT trade's leading media platforms.",
    photos: [
      { src: "/images/gallery/ncn-meet-new-delhi-2024-01.jpg", caption: "FAIITA leadership with the National Computer News (NCN) team in New Delhi" },
      { src: "/images/gallery/ncn-meet-new-delhi-2024-02.jpg", caption: "FAIITA representatives during the NCN meet in New Delhi, 2024" },
      { src: "/images/gallery/ncn-meet-new-delhi-2024-03.jpg", caption: "Delegates in discussion at the NCN meet in New Delhi" },
      { src: "/images/gallery/ncn-meet-new-delhi-2024-04.jpg", caption: "FAIITA and NCN representatives together in New Delhi, 2024" },
      { src: "/images/gallery/ncn-meet-new-delhi-2024-05.jpg", caption: "Members gathered for the NCN meet in New Delhi" },
      { src: "/images/gallery/ncn-meet-new-delhi-2024-06.jpg", caption: "Group photograph from the NCN meet in New Delhi, 2024" },
    ],
  },
  {
    slug: "faiita-computex-taipei-2023",
    title: "FAIITA Delegation at COMPUTEX Taipei 2023",
    eyebrow: "2023 · Taipei",
    description:
      "A FAIITA delegation travelled to COMPUTEX Taipei — one of the world's largest ICT trade shows — from May 30 to June 2, 2023, connecting India's IT channel community with global technology manufacturers and partners.",
    photos: [
      { src: "/images/gallery/faiita-computex-taipei-2023-01.jpg", caption: "FAIITA delegation members at COMPUTEX Taipei 2023" },
      { src: "/images/gallery/faiita-computex-taipei-2023-02.jpg", caption: "The delegation explores the exhibits at COMPUTEX Taipei" },
      { src: "/images/gallery/faiita-computex-taipei-2023-03.jpg", caption: "FAIITA delegates connect with global technology partners in Taipei" },
      { src: "/images/gallery/faiita-computex-taipei-2023-04.jpg", caption: "Delegation members during the COMPUTEX Taipei 2023 visit" },
      { src: "/images/gallery/faiita-computex-taipei-2023-05.jpg", caption: "FAIITA representatives at the world's leading ICT trade show" },
      { src: "/images/gallery/faiita-computex-taipei-2023-06.jpg", caption: "Together we create — the FAIITA delegation at COMPUTEX Taipei, May 30 – June 2, 2023" },
      { src: "/images/gallery/faiita-computex-taipei-2023-07.jpg", caption: "The delegation at dinner following the COMPUTEX Taipei visit" },
    ],
  },
  {
    slug: "faiita-election-2022-chandigarh",
    title: "FAIITA Election 2022 — Chandigarh",
    eyebrow: "2022 · Chandigarh",
    description:
      "In 2022, PACT (Punjab Association of Computer Traders) hosted the FAIITA election in Chandigarh, marking the occasion with a grand event featuring an exhibition and a gala dinner. Sanjeev Walia served as the Election Observer. Devesh Rastogi was elected President of FAIITA for the 2022–24 tenure.",
    photos: [
      { src: "/images/gallery/faiita-election-2022-chandigarh-01.jpeg", caption: "Delegates in discussion during the FAIITA Election 2022 proceedings in Chandigarh" },
      { src: "/images/gallery/faiita-election-2022-chandigarh-02.jpeg", caption: "State association leaders from across India convene for the election, hosted by PACT" },
      { src: "/images/gallery/faiita-election-2022-chandigarh-03.jpeg", caption: "Leaders felicitated at the Chandigarh event, held with an exhibition and gala dinner" },
      { src: "/images/gallery/faiita-election-2022-chandigarh-04.jpeg", caption: "Delegates of FAIITA's member associations gathered for the 2022 election" },
      { src: "/images/gallery/faiita-election-2022-chandigarh-05.jpeg", caption: "Devesh Rastogi — elected President of FAIITA for the 2022–24 tenure — with fellow leaders" },
    ],
  },
];
