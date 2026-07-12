/**
 * FAIITA — Database seed script
 * -------------------------------------------------------------
 * This populates realistic PLACEHOLDER content so every page renders
 * correctly out of the box. Replace names, figures and copy with
 * FAIITA's verified data before going live — search "REPLACE ME"
 * style values (president names, phone numbers) before launch.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Returns the public path if the file exists under /public, else null — lets
 *  cover images go live simply by dropping the file in and reseeding. */
function publicImage(path: string): string | null {
  return existsSync(join(__dirname, "..", "public", path)) ? `/${path.replace(/\\/g, "/")}` : null;
}

type StateSeed = {
  /** URL slug — defaults to slugified stateName; must be set explicitly for states with more than one association. */
  slug?: string;
  stateName: string;
  stateCode: string;
  region: string;
  associationName: string;
  foundedYear?: number;
  memberCount: number;
  city: string;
  mapX: number;
  mapY: number;
  presidentName?: string;
  contactEmail?: string;
  secretaryEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  /** Filename (no extension) expected at /public/logos/state/<logoSlug>.png */
  logoSlug?: string;
  description?: string;
  /** Defaults to "<city>, <stateName>" — override when stateName isn't a literal state. */
  address?: string;
};

// Authoritative list of FAIITA state associations — Faiita_President_XL_2025 27.xlsx
// (34 associations; states like Maharashtra, Delhi, MP and Rajasthan have several).
// Some states have no dedicated state association, so a member association is
// recognised as the state association — hence multiple entries share a state.
// x/y are relative (0-100) positions on the illustrated India map viewBox.
const states: StateSeed[] = [
  // — North —
  { stateName: "Jammu & Kashmir", stateCode: "JK", region: "North", associationName: "Jammu Computer Dealers Association (JCDA)", foundedYear: 2015, memberCount: 220, city: "Jammu", mapX: 36, mapY: 8, presidentName: "Sandeep Malhotra", contactPhone: "+91 94191 93784", contactEmail: "lstechnologiesjmu@gmail.com", logoSlug: "jammu-kashmir" },
  { stateName: "Himachal Pradesh", stateCode: "HP", region: "North", associationName: "Shimla I T Dealer Association (SITDA)", foundedYear: 2016, memberCount: 180, city: "Shimla", mapX: 39, mapY: 17, presidentName: "Rupin Rekhi", contactPhone: "+91 98160 77729", contactEmail: "info@sitda.in", logoSlug: "himachal-pradesh" },
  { stateName: "Punjab", stateCode: "PB", region: "North", associationName: "Punjab Association of Computer Traders (PACT)", foundedYear: 2014, memberCount: 1450, city: "Ludhiana", mapX: 32, mapY: 19, presidentName: "Vikas Narang", contactPhone: "+91 98141 03518", contactEmail: "president@pactpunjab.com", logoSlug: "punjab" },
  { stateName: "Chandigarh", stateCode: "CH", region: "North", associationName: "TECSPA Chandigarh", memberCount: 0, city: "Chandigarh", mapX: 34, mapY: 21, presidentName: "Satpal Singh", contactPhone: "+91 94172 18200", contactEmail: "president@tecspa.in", logoSlug: "chandigarh" },
  { stateName: "Uttarakhand", stateCode: "UT", region: "North", associationName: "Uttaranchal IT Traders Association (UITTA)", foundedYear: 2017, memberCount: 340, city: "Dehradun", mapX: 43, mapY: 20, presidentName: "Rajesh Tomar", contactPhone: "+91 94120 58404", contactEmail: "president@uitta.org", logoSlug: "uttarakhand" },
  { stateName: "Delhi", stateCode: "DL", region: "North", associationName: "All Delhi Computers Traders Association (ADCTA)", foundedYear: 2014, memberCount: 5200, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Mahinder Agrawal", contactPhone: "+91 92121 27937", contactEmail: "adcta.nehruplace@gmail.com", logoSlug: "delhi" },
  { slug: "delhi-cmda", stateName: "Delhi", stateCode: "DL", region: "North", associationName: "Computer Media Dealers Association, Delhi (CMDA)", memberCount: 0, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Puneet Singhal", contactPhone: "+91 98100 48176", contactEmail: "infocmda@gmail.com", logoSlug: "cmda-delhi" },
  { slug: "delhi-pcait", stateName: "Delhi", stateCode: "DL", region: "North", associationName: "Progressive Channels Association Of Information Technology (PCAIT)", memberCount: 0, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Alok Gupta", contactPhone: "+91 98101 98881", contactEmail: "alokgupta@unistal.com", logoSlug: "pcait" },
  { slug: "delhi-cimeit", stateName: "Delhi", stateCode: "DL", region: "North", associationName: "Confederation of Indian MSME in ESDM & IT (CIMEIT)", memberCount: 0, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Milan Agrawal", contactPhone: "+91 98102 39199", contactEmail: "dg@ciemei.in", logoSlug: "cimeit" },
  { stateName: "Rajasthan", stateCode: "RJ", region: "North", associationName: "Rajasthan Computer Traders Association (RCTA)", foundedYear: 2014, memberCount: 2100, city: "Jaipur", mapX: 26, mapY: 31, presidentName: "Sugriv Singh", contactPhone: "+91 94140 72413", contactEmail: "rajshreesystems.udaipur@gmail.com", logoSlug: "rajasthan" },
  { slug: "rajasthan-ucta", stateName: "Rajasthan", stateCode: "RJ", region: "North", associationName: "Udaipur Computer Traders Association (UCTA)", memberCount: 0, city: "Udaipur", mapX: 26, mapY: 31, presidentName: "Ajay Srivastava", contactPhone: "+91 98290 42643", contactEmail: "info@ucta.org.in", logoSlug: "ucta" },
  { stateName: "Uttar Pradesh", stateCode: "UP", region: "North", associationName: "Uttar Pradesh Computer Dealers Welfare Association (UPCDWA)", foundedYear: 2014, memberCount: 4300, city: "Lucknow", mapX: 46, mapY: 30, presidentName: "Pankaj Agrawal", contactPhone: "+91 95595 51110", contactEmail: "pankaj@docketcare.com", logoSlug: "uttar-pradesh" },

  // — East —
  { stateName: "Bihar", stateCode: "BR", region: "East", associationName: "Bihar IT Association (BITA)", foundedYear: 2015, memberCount: 1600, city: "Patna", mapX: 55, mapY: 33, presidentName: "Rajiv Agrawal", contactPhone: "+91 94310 18295", contactEmail: "rajivagrawal1989@gmail.com", logoSlug: "bihar" },
  { stateName: "West Bengal", stateCode: "WB", region: "East", associationName: "COMPASS Kolkata", foundedYear: 2014, memberCount: 3100, city: "Kolkata", mapX: 62, mapY: 38, presidentName: "Manish Lunia", contactPhone: "+91 98311 55806", contactEmail: "manish@shreesales.co.in", logoSlug: "west-bengal" },
  { stateName: "Jharkhand", stateCode: "JH", region: "East", associationName: "Jharkhand Computer Traders Association (JCTA)", foundedYear: 2016, memberCount: 780, city: "Ranchi", mapX: 54, mapY: 38, presidentName: "Mukesh Jha", contactPhone: "+91 93343 90891", contactEmail: "jctajharkhand@yahoo.com", logoSlug: "jharkhand" },
  { stateName: "Odisha", stateCode: "OR", region: "East", associationName: "Information Technology Association Of Orissa (ITAO)", foundedYear: 2016, memberCount: 890, city: "Bhubaneswar", mapX: 55, mapY: 47, presidentName: "Abhinash Patnayak", contactPhone: "+91 98610 63215", contactEmail: "president@itaoodisha.org", logoSlug: "odisha" },
  // NECTA covers the whole North-East (Sikkim + the seven sister states) as
  // one unit, headquartered in Guwahati, Assam. There is no separate
  // North-East zone — NECTA is grouped under the East zone.
  { stateName: "North East", stateCode: "AS", region: "East", associationName: "North East Computer Traders Association (NECTA)", foundedYear: 2016, memberCount: 410, city: "Guwahati", mapX: 70, mapY: 29, presidentName: "Ranjan Kumar Das", contactPhone: "+91 94351 18986", contactEmail: "president@necta.co.in", logoSlug: "assam", address: "Guwahati, Assam", description: "North East Computer Traders Association (NECTA) represents IT channel partners, retailers and distributors across the entire North-East — Sikkim, Assam, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura and Meghalaya — headquartered in Guwahati and working under the FAIITA umbrella since 2016." },

  // — Central —
  { stateName: "Chhattisgarh", stateCode: "CT", region: "Central", associationName: "Chhattisgarh Computer & Media Dealer Association (CCMDA)", foundedYear: 2017, memberCount: 520, city: "Raipur", mapX: 46, mapY: 44, presidentName: "Avinash Makhija", contactPhone: "+91 98261 62122", contactEmail: "avinash.compu@gmail.com", logoSlug: "chhattisgarh" },
  { stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "Bhoj Information Technology & Office Automation Dealers Association (BITOAA)", foundedYear: 2015, memberCount: 1980, city: "Bhopal", mapX: 38, mapY: 41, presidentName: "Manish Gupta", contactPhone: "+91 98260 99941", contactEmail: "president.bitoaa@gmail.com", logoSlug: "madhya-pradesh" },
  { slug: "madhya-pradesh-mpctas", stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "M.P. Computer Telecom Association Samiti (MPCTAS)", memberCount: 0, city: "Indore", mapX: 38, mapY: 41, presidentName: "Rakesh Daga", contactPhone: "+91 93032 88083", contactEmail: "indoredb@gmail.com", logoSlug: "mpctas" },
  { slug: "madhya-pradesh-mcda", stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "Mahakaushal Computer Dealer's Association (MCDA)", memberCount: 0, city: "Jabalpur", mapX: 38, mapY: 41, presidentName: "B.L. Patel", contactPhone: "+91 93007 64155", contactEmail: "mcdajbp2003@gmail.com", logoSlug: "mcda-jabalpur" },

  // — West —
  {
    stateName: "Gujarat", stateCode: "GJ", region: "West",
    associationName: "Federation Of Information Technology Association Gujarat (FITAG)",
    foundedYear: 2008, memberCount: 10000, city: "Ahmedabad", mapX: 20, mapY: 43,
    presidentName: "Alok Ghelani", contactPhone: "+91 98986 22606",
    contactEmail: "president@fitag.in", secretaryEmail: "secretary@fitag.in",
    websiteUrl: "https://www.fitag.in", logoSlug: "gujarat",
    description: [
      "FITAG has been an old idea, which has now flourished through the interest and initiative of many leaders of the IT fraternity in Gujarat. In fact, there is no such umbrella body at the regional level anywhere across India. Cities across Gujarat, as well as India, have their own associations and most of their problems are common — FITAG is the first body of its kind in India to address those common issues.",
      "Founded in 2008, FITAG today unites 44 IT associations under a single umbrella, representing 10,000+ IT partners across Gujarat.",
      "FITAG's objectives, in a nutshell, rest on a five-point agenda — Flourish, Knowledge, Networking, Strength and Protection — the foundation on which FITAG is laid:",
      "• Flourish — to flourish and co-exist by being united and supportive of each other.\n• Knowledge — to share the knowledge available by all means.\n• Networking — to increase awareness through extensive networking with each other.\n• Strength — to stay united and utilise the collective strength.\n• Protection — to protect the common interest.",
    ].join("\n\n"),
  },
  { stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Computer Media Dealers Association, Mumbai (CMDA)", foundedYear: 2014, memberCount: 6100, city: "Mumbai", mapX: 30, mapY: 54, presidentName: "Mihir Shah", contactPhone: "+91 98200 67580", contactEmail: "mihir@datatradeindia.com", logoSlug: "maharashtra" },
  { slug: "maharashtra-asirt", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Association Of System Integrators & Retailers Technology (ASIRT)", memberCount: 0, city: "Mumbai", mapX: 30, mapY: 54, presidentName: "Bharat Chheda", contactPhone: "+91 98212 46565", contactEmail: "president@asirt.in", logoSlug: "asirt" },
  { slug: "maharashtra-tait", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Trade Association Of Information Technology (TAIT)", memberCount: 0, city: "Mumbai", mapX: 30, mapY: 54, presidentName: "Rushabh Shah", contactPhone: "+91 93222 13274", contactEmail: "taitoffice@tait.in", logoSlug: "tait" },
  { slug: "maharashtra-nmit", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Navi Mumbai IT Association (NMIT)", memberCount: 0, city: "Navi Mumbai", mapX: 30, mapY: 54, presidentName: "Hemant Gupta", contactPhone: "+91 98198 10100", contactEmail: "twinklesystems@gmail.com", logoSlug: "nmit" },
  { slug: "maharashtra-cmda-pune", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "CMDA Pune", memberCount: 0, city: "Pune", mapX: 30, mapY: 54, presidentName: "Mahesh More", contactPhone: "+91 98220 44158", contactEmail: "president@cmdapune.org", logoSlug: "cmda-pune" },
  { slug: "maharashtra-can", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Computer Association of Nasik (CAN)", memberCount: 0, city: "Nashik", mapX: 30, mapY: 54, presidentName: "Sharad Mishra", contactPhone: "+91 98230 55584", contactEmail: "info@canit.co.in", logoSlug: "can-nasik" },
  { slug: "maharashtra-vcmdwa", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Vidarbha Computer & Media Dealer's Welfare Association (VCMDWA)", memberCount: 0, city: "Nagpur", mapX: 30, mapY: 54, presidentName: "Dinesh Naidu", contactPhone: "+91 98230 16763", contactEmail: "admin@vcmdwa.org", logoSlug: "vcmdwa" },
  { stateName: "Goa", stateCode: "GA", region: "West", associationName: "Goa IT Business Association (GIBA)", foundedYear: 2018, memberCount: 110, city: "Panaji", mapX: 26, mapY: 62, presidentName: "Ishwar Naik", contactPhone: "+91 98230 38013", contactEmail: "ishwar@siliconcomp.com", logoSlug: "goa" },

  // — South —
  { stateName: "Andhra Pradesh", stateCode: "AP", region: "South", associationName: "Computer Dealers Association Of Nellore Distt (CDAN)", foundedYear: 2015, memberCount: 1620, city: "Nellore", mapX: 46, mapY: 64, presidentName: "B.V. Deepak", contactPhone: "+91 98481 75765", contactEmail: "deepak@sv-technologies.net", logoSlug: "andhra-pradesh" },
  { stateName: "Karnataka", stateCode: "KA", region: "South", associationName: "Federation Of IT Dealer's Association Of Karnataka (FITDAK)", foundedYear: 2014, memberCount: 4200, city: "Bengaluru", mapX: 33, mapY: 68, presidentName: "G. N. Mahesha", contactPhone: "+91 99866 32220", contactEmail: "gnmahesh9@gmail.com", logoSlug: "karnataka" },
  { stateName: "Kerala", stateCode: "KL", region: "South", associationName: "All Kerala IT Dealers Association (AKITDA)", foundedYear: 2014, memberCount: 2600, city: "Kochi", mapX: 31, mapY: 84, presidentName: "Hareesh Kollam", contactPhone: "+91 94470 75216", contactEmail: "statepresident@akitda.co.in", logoSlug: "kerala" },
  { stateName: "Tamil Nadu", stateCode: "TN", region: "South", associationName: "Confederation Of IT Associations (CONFED ITA)", foundedYear: 2014, memberCount: 3800, city: "Chennai", mapX: 39, mapY: 84, presidentName: "Vasudevan", contactPhone: "+91 99444 40980", contactEmail: "president@confedita.com", logoSlug: "tamil-nadu", description: "Confederation Of IT Associations (CONFED ITA) represents IT channel partners, retailers and distributors across Tamil Nadu and Puducherry, working under the FAIITA umbrella since 2014." },
];

// Member associations are intentionally reduced to a single demo/placeholder
// card until FAIITA supplies the verified member-association list.
const demoMemberAssociation = {
  slug: "demo-member-association",
  name: "Your Association Name (Demo)",
  city: "Your City",
  type: "Demo",
  memberCount: 0,
  description:
    "This is a sample card. City and district associations affiliated to FAIITA will be listed here with their logo, leadership and contact details.",
};

const testimonials = [
  { name: "Navin Gupta", role: "President, FAIITA", association: "Bihar IT Association", quote: "FAIITA has been instrumental in uniting IT dealers across India. Through sustained advocacy, our members have seen real policy change.", order: 1 },
  { name: "Liju P. Raju", role: "Sr. Vice President, FAIITA", association: "All Kerala IT Dealers Association (AKITDA)", quote: "Being part of FAIITA gives our state association a voice at the national level. The networking opportunities are invaluable.", order: 2 },
  { name: "Rajeev Chitkara", role: "Vice President, FAIITA", association: "Punjab Computer Dealers Association", quote: "FAIITA's training programs and industry insights help our members stay competitive in a fast-changing market.", order: 3 },
  { name: "Amit Kumar", role: "Secretary, FAIITA", association: "Delhi IT Traders Association", quote: "The federation's work on GST simplification and digital-transformation advocacy has directly benefited our 5,000+ members.", order: 4 },
];

// Current Governing Body — FAIITA TEAM 25-27 (DAIRY 25 27.pptx).
// imageUrl points to /public/leadership/<slug>.jpg — see public/leadership/README.md.
const leaders = [
  { name: "Navin Gupta", role: "President", order: 1, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/navin-gupta.jpg" },
  { name: "Liju P Raju", role: "Senior Vice President", order: 2, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/liju-p-raju.jpg" },
  { name: "Praful Desai", role: "Vice President", order: 3, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/praful-desai.jpeg" },
  { name: "Sanjeev Walia", role: "Secretary", order: 4, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sanjeev-walia.jpeg" },
  { name: "Deepak Bommisetty", role: "Joint Secretary", order: 5, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/deepak-bommisetty.jpg" },
  { name: "Naveen Gupta", role: "Treasurer", order: 6, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/naveen-gupta.jpg" },
  // Joint Treasurer sits between Treasurer and Advisor in the GB order.
  { name: "Dharmesh Negandhi", role: "Joint Treasurer", order: 7, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/dharmesh-negandhi.jpg" },
  // "PP" (Past President), not "IPP" — the Immediate Past President for this
  // term is Devesh Rastogi (2022–24), listed below as a GB Member.
  { name: "Koushik Pandya", role: "Advisor, PP", order: 8, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/koushik-pandya.jpg" },
  { name: "Arun Dey", role: "GB Member", order: 9, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/arun-dey.jpg" },
  { name: "Pawan Agarwal", role: "GB Member", order: 10, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/pawan-agarwal.jpg" },
  { name: "Sulalith Gupta", role: "GB Member", order: 11, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sulalith-gupta.jpg" },
  { name: "Neeraj Agarwal", role: "GB Member", order: 12, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/neeraj-agarwal.jpg" },
  { name: "Kuldeep S Verma", role: "GB Member", order: 13, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/kuldeep-s-verma.jpg" },
  { name: "Devesh Rastogi", role: "GB Member", order: 14, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/devesh-rastogi.jpg" },
  { name: "S. Karthikeyan", role: "GB Member", order: 15, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/s-karthikeyan.jpg" },
  { name: "Susheel Kumar", role: "GB Member", order: 16, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sushil-kumar.jpg" },
  { name: "Paresh Salgaonkar", role: "GB Member", order: 17, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/paresh-salgaonkar.jpg" },
  { name: "Sugreev Singh Ranawat", role: "GB Member", order: 18, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sugreev-singh-ranawat.jpg" },
];

// Previous Governing Body — FAIITA TEAM 22-24 (DAIRY 23 WITH LOGO.pdf).
const pastLeaders = [
  { name: "Devesh Rastogi", role: "President", order: 1, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/devesh-rastogi.jpg" },
  { name: "S. Karthikeyan", role: "Senior Vice President", order: 2, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/s-karthikeyan.jpg" },
  { name: "Arun Dey", role: "Vice President", order: 3, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/arun-dey.jpg" },
  { name: "Navin Gupta", role: "Secretary", order: 4, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/navin-gupta.jpg" },
  { name: "Deepak Bommisetty", role: "Joint Secretary", order: 5, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/deepak-bommisetty.jpg" },
  { name: "Naveen Gupta", role: "Treasurer", order: 6, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/naveen-gupta.jpg" },
  { name: "Susheel Kumar", role: "Joint Treasurer", order: 7, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/sushil-kumar.jpg" },
  { name: "Koushik Pandya", role: "Advisor, IPP", order: 8, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/koushik-pandya.jpg" },
  { name: "Sanjeev Walia", role: "GB Member", order: 9, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/sanjeev-walia.jpeg" },
  { name: "Liju R", role: "GB Member / Zonal Chairman (South)", order: 10, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/liju-p-raju.jpg" },
  { name: "Naresh Batra", role: "GB Member", order: 11, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/naresh-batra.jpg" },
  { name: "Puneet Singhaal", role: "GB Member", order: 12, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/puneet-singhaal.jpg" },
  { name: "Deepak Vidhani", role: "GB Member", order: 13, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/deepak-vidhani.jpg" },
  { name: "B L Navlakha", role: "GB Member / Zonal Chairman (East)", order: 14, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/b-l-navlakha.jpg" },
  { name: "Praful Desai", role: "GB Member / Zonal Chairman (West)", order: 15, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/praful-desai.jpeg" },
  { name: "Mahesha G N", role: "GB Member", order: 16, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/mahesha-g-n.jpg" },
  { name: "Sulalith Gupta", role: "GB Member / Zonal Chairman (North)", order: 17, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/sulalith-gupta.jpg" },
  { name: "Sudhir Goyal", role: "GB Member / Zonal Chairman (Central)", order: 18, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/sudhir-goyal.jpg" },
  { name: "Neeraj Agarwal", role: "GB Member / Zonal Chairman (East)", order: 19, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/neeraj-agarwal.jpg" },
  { name: "Kuldeep S Verma", role: "GB Member", order: 20, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/kuldeep-s-verma.jpg" },
  { name: "Ashish Jain", role: "GB Member / Zonal Chairman (Central)", order: 21, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/ashish-jain.jpg" },
  { name: "Kauser Dabhiya", role: "VP - Activity", order: 22, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/kauser-dabhiya.jpg" },
  { name: "Gurpreet Singh", role: "VP - Brand Coordinator", order: 23, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/gurpreet-singh.jpg" },
  { name: "Sanjeev Jalan", role: "GB Member", order: 24, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/sanjeev-jalan.jpg" },
  { name: "Mitesh Dave", role: "VP - Admin", order: 25, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/mitesh-dave.jpg" },
  { name: "Samir Parekh", role: "VP - New Opportunity", order: 26, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/samir-parekh.jpg" },
];

const stats = [
  // 34 affiliated associations operate across 28 covered states — the stat
  // shows the states figure per FAIITA's preference.
  { label: "States Covered", value: "28", suffix: "", icon: "MapPinned", order: 1 },
  { label: "Member Associations", value: "100", suffix: "+", icon: "Building2", order: 2 },
  { label: "Channel Partners", value: "50", suffix: "K+", icon: "Users", order: 3 },
  { label: "Employment Generated", value: "5", suffix: "L+", icon: "Briefcase", order: 4 },
  { label: "Years Since 2014", suffix: "+", value: "12", icon: "CalendarClock", order: 5 },
  { label: "Policy Advocacy Wins", value: "300", suffix: "+", icon: "ShieldCheck", order: 6 },
];

// Real news posts. publishedAt is fixed (not relative) so reseeding never
// reorders them. coverImage goes live automatically once the file exists
// under /public — see publicImage().
const realNews = [
  {
    slug: "faiita-upcdwa-strategic-brand-discussions-lucknow-june-2026",
    title: "FAIITA & UPCDWA Hold Strategic Brand Discussions in Lucknow; Seek Stronger Support for Offline IT Channel Ecosystem",
    excerpt:
      "FAIITA, in association with UPCDWA, held two days of strategic discussions with HP, Lenovo, Dell, Acer and ASUS at Lucknow on 8–9 June 2026, seeking stronger brand support for the offline IT hardware channel.",
    category: "Press Release",
    featured: true,
    publishedAt: new Date("2026-06-18T09:00:00+05:30"),
    coverImage: publicImage("images/news/faiita-upcdwa-lucknow-june-2026.webp"),
    heroImage: publicImage("images/news/faiita-upcdwa-lucknow-june-2026-2.webp"),
    sourceUrl: "https://www.dqchannels.com/news/faiita-and-upcdwa-strategic-brand-discussions-in-lucknow-targets-key-challenges-12051477",
    content: [
      "The Federation of All India Information Technology Associations (FAIITA), in association with the Uttar Pradesh Computer Dealers Welfare Association (UPCDWA), successfully conducted a series of strategic discussions with leading IT brands — HP, Lenovo, Dell, Acer and ASUS — on 08–09 June 2026 at The Regnant, Nirala Nagar, Lucknow.",
      "The discussions were attended by FAIITA leadership comprising Mr. Devesh Rastogi (Chairman, FAIITA), Mr. Navin Gupta (President, FAIITA) and Mr. Deepak Bommisetty (Chairman, FAIITA Brand Coordination Committee), along with the UPCDWA leadership team and senior representatives from the participating brands.",
      "The primary objective of the meetings was to address the severe challenges currently impacting the offline IT hardware channel ecosystem — price disparity, declining profitability, inventory pressures, market instability, working-capital concerns and the growing impact of aggressive online pricing practices. FAIITA and UPCDWA highlighted that the offline channel continues to face unprecedented pressure from MOP violations, online price disruptions, uneven market practices, inventory risks and shrinking dealer margins, and emphasised that a healthy, profitable offline ecosystem remains critical for long-term customer support, brand visibility, service delivery and sustainable market growth.",
      "The participating brands acknowledged several of these concerns and offered key assurances covering price parity, dealer-protection mechanisms, inventory support, EMI and affordability programs, channel profitability initiatives, activation support, exclusive channel SKUs, service integration and the evaluation of O2O/OMO business models.",
      "Following the discussions, detailed Minutes of Meeting were formally shared with all participating brands, and FAIITA and UPCDWA requested official point-wise responses on the discussed assurances and action points by 25 June 2026.",
      "FAIITA leaders expressed optimism that the industry is entering a critical phase in which stronger collaboration between brands and channel partners can create a more balanced and sustainable business environment. As the industry moves into FY 2026–27, FAIITA remains hopeful that this year will mark a significant turnaround for the channel community — one of the most successful and profitable years in the history of the Indian IT channel industry.",
    ].join("\n\n"),
  },
];

// Placeholder items kept only so the section doesn't look empty — all flagged
// isDemo and dated well before any real post. Delete as real news lands.
const newsItems = [
  { slug: "faiita-hosts-national-it-summit-2025", title: "FAIITA Hosts National IT Summit 2025 in New Delhi", excerpt: "Leaders from state associations across all 28 states convened to chart the federation's advocacy roadmap for the year ahead.", category: "Events", featured: false, daysAgo: 160 },
  { slug: "new-gst-guidelines-for-it-products", title: "New GST Guidelines for IT Products Announced", excerpt: "FAIITA's sustained advocacy leads to simplified GST compliance for IT dealers and distributors nationwide.", category: "Policy", featured: false, daysAgo: 175 },
  { slug: "digital-india-skill-development", title: "Digital India Initiative: FAIITA's Role in Skill Development", excerpt: "Partnership with government agencies to train 10,000+ IT professionals in emerging technologies.", category: "Initiative", featured: false, daysAgo: 190 },
  { slug: "faiita-emerging-tech-roundtable", title: "FAIITA Convenes Roundtable on Emerging Technology Retail", excerpt: "State association leaders discussed the shift toward AI-enabled devices and its impact on channel partners.", category: "Press Release", featured: false, daysAgo: 205 },
];

const events = [
  { slug: "faiita-agm-2026", title: "FAIITA Annual General Meeting 2026", category: "AGM", description: "The federation's flagship annual gathering of all member associations to review the year and set priorities.", city: "Hyderabad", state: "Telangana", daysFromNow: 30 },
  { slug: "national-it-channel-partners-summit", title: "National IT Channel Partners Summit", category: "Summit", description: "A national platform connecting channel partners, distributors and OEMs across India's IT retail ecosystem.", city: "Mumbai", state: "Maharashtra", daysFromNow: 55 },
  { slug: "digital-transformation-workshop", title: "Digital Transformation Workshop", category: "Workshop", description: "A hands-on workshop helping member associations digitize billing, inventory and compliance workflows.", city: "Bengaluru", state: "Karnataka", daysFromNow: 12 },
  { slug: "regional-meet-east-zone", title: "Regional Meet — East Zone", category: "Conference", description: "State associations from West Bengal, Odisha, Bihar and Jharkhand meet to align on regional trade concerns.", city: "Kolkata", state: "West Bengal", daysFromNow: 75 },
];

const blogs = [
  { slug: "future-of-it-retail-in-india", title: "The Future of IT Retail in India's Tier-2 Cities", excerpt: "How channel partners outside metro India are becoming the next growth frontier for the IT trade.", author: "FAIITA Editorial Desk", tags: "Retail,Growth,Tier-2" },
  { slug: "navigating-gst-compliance-2026", title: "Navigating GST Compliance in 2026: A Dealer's Guide", excerpt: "A practical walkthrough of the latest GST changes affecting IT hardware and software resellers.", author: "FAIITA Policy Cell", tags: "GST,Compliance,Policy" },
  { slug: "building-a-state-association", title: "Building a State IT Association From the Ground Up", excerpt: "Lessons from associations that grew from a handful of founding members to thousands strong.", author: "FAIITA Editorial Desk", tags: "Associations,Leadership" },
];

const galleryItems = [
  { title: "National IT Summit — Plenary Session", category: "Summits", order: 1, imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" },
  { title: "State Presidents' Roundtable", category: "Leadership", order: 2, imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80" },
  { title: "Regional Meet, East Zone", category: "Regional Meets", order: 3, imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" },
  { title: "AGM 2025 — Delegate Address", category: "Events", order: 4, imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80" },
  { title: "Channel Partners Summit Networking", category: "Summits", order: 5, imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80" },
  { title: "Digital Transformation Workshop", category: "Events", order: 6, imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&q=80" },
];

// FAIITA Patrika — the federation's real e-bulletin. Vol 2 & 3 are hosted
// Heyzine flip-books; Vol 1 is a PDF served from /public/newsletters.
const newsletters = [
  {
    slug: "faiita-patrika-vol-3-april-2026",
    title: "FAIITA Patrika Vol 3",
    description: "April 2026 edition — cyber-threat predictions for 2026, CMDA IT Expo, association meets across India, and FAIITA's call for a level playing field.",
    issueNumber: 3,
    issueDate: new Date("2026-04-01"),
    fileUrl: "https://heyzine.com/flip-book/dbc48dc82a.html",
  },
  {
    slug: "faiita-patrika-vol-2-october-2025",
    title: "FAIITA Patrika Vol 2",
    description: "October 2025 edition — Punjab AGM & IT Expo highlights, FAIITA AGM, and messages from the federation's leadership.",
    issueNumber: 2,
    issueDate: new Date("2025-10-01"),
    fileUrl: "https://heyzine.com/flip-book/36696db51a.html",
  },
  {
    slug: "faiita-patrika-vol-1-april-2025",
    title: "FAIITA Patrika Vol 1",
    description: "Inaugural April 2025 edition of FAIITA Patrika, the federation's e-bulletin for the IT channel community.",
    issueNumber: 1,
    issueDate: new Date("2025-04-01"),
    fileUrl: "/newsletters/faiita-patrika-vol-1-april-2025.pdf",
  },
];

const policies = [
  { title: "FAIITA Annual Report 2025", category: "Annual", fileSize: "4.2 MB", description: "Comprehensive overview of the federation's work and impact in FY24–25." },
  { title: "IT Channel Partners Market Study 2026", category: "Research", fileSize: "2.8 MB", description: "Analysis of the IT channel partner ecosystem in Tier 1, 2, and 3 cities." },
  { title: "GST Impact Report on IT Trade", category: "Policy", fileSize: "1.6 MB", description: "Data-driven look at GST's effect on IT retailers and distributors nationwide." },
  { title: "Skill Development White Paper", category: "White Paper", fileSize: "2.1 MB", description: "Recommendations for upskilling India's IT channel workforce." },
];

async function main() {
  console.log("Seeding FAIITA database…");

  // Note: contactSubmission and newsletterSubscriber are NOT cleared —
  // they hold real visitor data that must survive reseeding.
  await prisma.memberAssociation.deleteMany();
  await prisma.stateAssociation.deleteMany();
  await prisma.leader.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.news.deleteMany();
  await prisma.event.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.policy.deleteMany();

  let firstStateId: string | null = null;

  for (const s of states) {
    const slug = s.slug ?? s.stateName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const state = await prisma.stateAssociation.create({
      data: {
        slug,
        stateName: s.stateName,
        stateCode: s.stateCode,
        region: s.region,
        associationName: s.associationName,
        foundedYear: s.foundedYear,
        memberCount: s.memberCount,
        presidentName: s.presidentName,
        contactEmail: s.contactEmail,
        secretaryEmail: s.secretaryEmail,
        contactPhone: s.contactPhone,
        websiteUrl: s.websiteUrl,
        address: s.address ?? `${s.city}, ${s.stateName}`,
        description:
          s.description ??
          `${s.associationName} represents IT channel partners, retailers and distributors across ${s.stateName}, working under the FAIITA umbrella${s.foundedYear ? ` since ${s.foundedYear}` : ""}.`,
        logoUrl: s.logoSlug ? `/logos/state/${s.logoSlug}.png` : null,
        mapX: s.mapX,
        mapY: s.mapY,
      },
    });
    firstStateId ??= state.id;
  }

  if (firstStateId) {
    await prisma.memberAssociation.create({
      data: { ...demoMemberAssociation, stateId: firstStateId },
    });
  }

  await prisma.testimonial.createMany({ data: testimonials });
  await prisma.leader.createMany({ data: [...leaders, ...pastLeaders] });
  await prisma.stat.createMany({ data: stats });

  const now = Date.now();
  await prisma.news.createMany({ data: realNews });
  await prisma.news.createMany({
    data: newsItems.map((n) => ({
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      content: n.excerpt,
      category: n.category,
      featured: n.featured,
      isDemo: true,
      publishedAt: new Date(now - n.daysAgo * 86400000),
    })),
  });

  await prisma.event.createMany({
    data: events.map((e) => ({
      slug: e.slug,
      title: e.title,
      description: e.description,
      category: e.category,
      city: e.city,
      state: e.state,
      startDate: new Date(now + e.daysFromNow * 86400000),
      isUpcoming: true,
      isDemo: true,
    })),
  });

  await prisma.blog.createMany({
    data: blogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.excerpt,
      author: b.author,
      authorRole: "FAIITA",
      tags: b.tags,
      isDemo: true,
    })),
  });

  await prisma.galleryItem.createMany({ data: galleryItems.map((g) => ({ ...g, isDemo: true })) });

  await prisma.newsletter.createMany({ data: newsletters });

  await prisma.policy.createMany({
    data: policies.map((p) => ({
      title: p.title,
      category: p.category,
      description: p.description,
      fileSize: p.fileSize,
      isDemo: true,
    })),
  });

  console.log(`Seeded ${states.length} state associations, ${testimonials.length} testimonials, ${newsItems.length} news items, ${events.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
