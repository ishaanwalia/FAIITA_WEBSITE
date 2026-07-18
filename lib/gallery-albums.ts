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
      { src: "/images/gallery/election-2025-lucknow-1.jpg", caption: "Delegates gather in Lucknow for the FAIITA Election 2025" },
      { src: "/images/gallery/election-2025-lucknow-2.jpg", caption: "State association leaders from across India at the election proceedings" },
      { src: "/images/gallery/election-2025-lucknow-3.jpg", caption: "Members of FAIITA's state associations during the 2025 election in Lucknow" },
      { src: "/images/gallery/election-2025-lucknow-4.jpg", caption: "Delegates in discussion during the FAIITA Election 2025" },
      { src: "/images/gallery/election-2025-lucknow-5.jpg", caption: "Leaders of the IT channel fraternity convene for the election" },
      { src: "/images/gallery/election-2025-lucknow-6.jpg", caption: "Proceedings of the FAIITA Election 2025 at Lucknow" },
      { src: "/images/gallery/election-2025-lucknow-7.jpg", caption: "Delegates participate in the election of FAIITA's President and team" },
      { src: "/images/gallery/election-2025-lucknow-8.jpg", caption: "State association representatives at the Lucknow election event" },
      { src: "/images/gallery/election-2025-lucknow-9.jpg", caption: "Members gathered during the FAIITA Election 2025 proceedings" },
      { src: "/images/gallery/election-2025-lucknow-10.jpg", caption: "The IT trade community from across India meets in Lucknow" },
      { src: "/images/gallery/election-2025-lucknow-11.jpg", caption: "Delegates during the election of the 2025–27 national team" },
      { src: "/images/gallery/election-2025-lucknow-12.jpg", caption: "Leaders felicitated at the FAIITA Election 2025 in Lucknow" },
      { src: "/images/gallery/election-2025-lucknow-13.jpg", caption: "Delegates of FAIITA's member associations at the 2025 election" },
      { src: "/images/gallery/election-2025-lucknow-14.jpg", caption: "State leaders come together for the FAIITA Election 2025" },
      { src: "/images/gallery/election-2025-lucknow-15.jpg", caption: "The election proceedings underway at Lucknow" },
      { src: "/images/gallery/election-2025-lucknow-16.jpg", caption: "Delegates at the FAIITA Election 2025, hosted in Lucknow" },
      { src: "/images/gallery/election-2025-lucknow-17.jpg", caption: "The newly elected FAIITA team for 2025–27, led by President Navin Gupta" },
      { src: "/images/gallery/election-2025-lucknow-18.jpg", caption: "Group photograph of delegates with the newly elected team for 2025–27" },
      { src: "/images/gallery/election-2025-lucknow-19.jpg", caption: "Members of the federation at the close of the FAIITA Election 2025" },
    ],
  },
  {
    slug: "pact-brands-meet-ludhiana",
    title: "PACT Meeting with Brands — Ludhiana",
    eyebrow: "Ludhiana, Punjab",
    description:
      "PACT (Punjab Association of Computer Traders) kicked off its meeting series with IT brands at Ludhiana, Punjab — bringing member dealers and brand representatives to one table to strengthen the state's IT channel ecosystem.",
    photos: [
      { src: "/images/gallery/pact-brands-meet-ludhiana-1.jpg", caption: "PACT's meeting with IT brands gets underway in Ludhiana, Punjab" },
      { src: "/images/gallery/pact-brands-meet-ludhiana-2.jpg", caption: "PACT members and brand representatives at the Ludhiana meet" },
    ],
  },
  {
    slug: "faiita-computex-taipei-2023",
    title: "FAIITA Delegation at COMPUTEX Taipei 2023",
    eyebrow: "2023 · Taipei",
    description:
      "A FAIITA delegation travelled to COMPUTEX Taipei — one of the world's largest ICT trade shows — from May 30 to June 2, 2023, connecting India's IT channel community with global technology manufacturers and partners.",
    photos: [
      { src: "/images/gallery/2023.jpg", caption: "FAIITA delegation members at COMPUTEX Taipei 2023" },
      { src: "/images/gallery/2023-1.jpg", caption: "The delegation explores the exhibits at COMPUTEX Taipei" },
      { src: "/images/gallery/2023-2.jpg", caption: "FAIITA delegates connect with global technology partners in Taipei" },
      { src: "/images/gallery/2023-3.jpg", caption: "Delegation members during the COMPUTEX Taipei 2023 visit" },
      { src: "/images/gallery/2023-4.jpg", caption: "FAIITA representatives at the world's leading ICT trade show" },
      { src: "/images/gallery/2023-5.jpg", caption: "Together we create — the FAIITA delegation at COMPUTEX Taipei, May 30 – June 2, 2023" },
      { src: "/images/gallery/2023-6.jpg", caption: "The delegation at dinner following the COMPUTEX Taipei visit" },
    ],
  },
  {
    slug: "faiita-election-2022-chandigarh",
    title: "FAIITA Election 2022 — Chandigarh",
    eyebrow: "2022 · Chandigarh",
    description:
      "In 2022, PACT (Punjab Association of Computer Traders) hosted the FAIITA election in Chandigarh, marking the occasion with a grand event featuring an exhibition and a gala dinner. Sanjeev Walia served as the Election Observer. Devesh Rastogi was elected President of FAIITA for the 2022–24 tenure.",
    photos: [
      { src: "/images/gallery/2022.jpeg", caption: "Delegates in discussion during the FAIITA Election 2022 proceedings in Chandigarh" },
      { src: "/images/gallery/2022-1.jpeg", caption: "State association leaders from across India convene for the election, hosted by PACT" },
      { src: "/images/gallery/2022-2.jpeg", caption: "Leaders felicitated at the Chandigarh event, held with an exhibition and gala dinner" },
      { src: "/images/gallery/2022-3.jpeg", caption: "Delegates of FAIITA's member associations gathered for the 2022 election" },
      { src: "/images/gallery/devesh-r-president.jpeg", caption: "Devesh Rastogi — elected President of FAIITA for the 2022–24 tenure — with fellow leaders" },
    ],
  },
];
