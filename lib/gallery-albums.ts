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
