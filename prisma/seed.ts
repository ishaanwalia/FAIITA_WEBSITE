/**
 * FAIITA — Database seed script
 * -------------------------------------------------------------
 * This populates realistic PLACEHOLDER content so every page renders
 * correctly out of the box. Replace names, figures and copy with
 * FAIITA's verified data before going live — search "REPLACE ME"
 * style values (president names, phone numbers) before launch.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type StateSeed = {
  stateName: string;
  stateCode: string;
  region: string;
  associationName: string;
  foundedYear?: number;
  memberCount: number;
  city: string;
  mapX: number;
  mapY: number;
  /** Real data supplied by FAIITA (Faiita_President_XL_2025 27.xlsx) — when present, overrides the placeholder president/contact info. */
  presidentName?: string;
  contactEmail?: string;
  contactPhone?: string;
  /** Filename (no extension) expected at /public/logos/state/<logoSlug>.png */
  logoSlug?: string;
};

// x/y are relative (0-100) positions on the illustrated India map viewBox.
const states: StateSeed[] = [
  { stateName: "Jammu & Kashmir", stateCode: "JK", region: "North", associationName: "Jammu Computer Dealers Association (JCDA)", foundedYear: 2015, memberCount: 220, city: "Jammu", mapX: 36, mapY: 8, presidentName: "Sandeep Malhotra", contactPhone: "+91 94191 93784", contactEmail: "lstechnologiesjmu@gmail.com", logoSlug: "jammu-kashmir" },
  { stateName: "Himachal Pradesh", stateCode: "HP", region: "North", associationName: "Shimla I T Dealer Association (SITDA)", foundedYear: 2016, memberCount: 180, city: "Shimla", mapX: 39, mapY: 17, presidentName: "Rupin Rekhi", contactPhone: "+91 98160 77729", contactEmail: "info@sitda.in", logoSlug: "himachal-pradesh" },
  { stateName: "Punjab", stateCode: "PB", region: "North", associationName: "Punjab Association of Computer Traders (PACT)", foundedYear: 2014, memberCount: 1450, city: "Ludhiana", mapX: 32, mapY: 19, presidentName: "Vikas Narang", contactPhone: "+91 98141 03518", contactEmail: "president@pactpunjab.com", logoSlug: "punjab" },
  { stateName: "Chandigarh", stateCode: "CH", region: "North", associationName: "TECSPA Chandigarh", foundedYear: undefined, memberCount: 0, city: "Chandigarh", mapX: 34, mapY: 21, presidentName: "Satpal Singh", contactPhone: "+91 94172 18200", contactEmail: "president@tecspa.in", logoSlug: "chandigarh" },
  { stateName: "Uttarakhand", stateCode: "UT", region: "North", associationName: "Uttaranchal IT Traders Association (UITTA)", foundedYear: 2017, memberCount: 340, city: "Dehradun", mapX: 43, mapY: 20, presidentName: "Rajesh Tomar", contactPhone: "+91 94120 58404", contactEmail: "president@uitta.org", logoSlug: "uttarakhand" },
  { stateName: "Haryana", stateCode: "HR", region: "North", associationName: "Haryana IT Dealers Federation", foundedYear: 2015, memberCount: 980, city: "Gurugram", mapX: 35, mapY: 23 },
  { stateName: "Delhi", stateCode: "DL", region: "North", associationName: "All Delhi Computers Traders Association (ADCTA)", foundedYear: 2014, memberCount: 5200, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Mahinder Agrawal", contactPhone: "+91 92121 27937", contactEmail: "adcta.nehruplace@gmail.com", logoSlug: "delhi" },
  { stateName: "Rajasthan", stateCode: "RJ", region: "North", associationName: "Rajasthan Computer Traders Association (RCTA)", foundedYear: 2014, memberCount: 2100, city: "Jaipur", mapX: 26, mapY: 31, presidentName: "Sugriv Singh", contactPhone: "+91 94140 72413", contactEmail: "rajshreesystems.udaipur@gmail.com", logoSlug: "rajasthan" },
  { stateName: "Uttar Pradesh", stateCode: "UP", region: "North", associationName: "Uttar Pradesh Computer Dealers Welfare Association (UPCDWA)", foundedYear: 2014, memberCount: 4300, city: "Lucknow", mapX: 46, mapY: 30, presidentName: "Pankaj Agrawal", contactPhone: "+91 95595 52220", contactEmail: "pankaj@docketcare.com", logoSlug: "uttar-pradesh" },
  { stateName: "Bihar", stateCode: "BR", region: "East", associationName: "Bihar IT Association (BITA)", foundedYear: 2015, memberCount: 1600, city: "Patna", mapX: 55, mapY: 33, presidentName: "Rajiv Agrawal", contactPhone: "+91 94310 18295", contactEmail: "rajivagrawal1989@gmail.com", logoSlug: "bihar" },
  { stateName: "Sikkim", stateCode: "SK", region: "North-East", associationName: "Sikkim IT Dealers Forum", foundedYear: 2018, memberCount: 60, city: "Gangtok", mapX: 61, mapY: 27 },
  { stateName: "West Bengal", stateCode: "WB", region: "East", associationName: "COMPASS Kolkata", foundedYear: 2014, memberCount: 3100, city: "Kolkata", mapX: 62, mapY: 38, presidentName: "Manish Lunia", contactPhone: "+91 98311 55806", contactEmail: "manish@shreesales.co.in", logoSlug: "west-bengal" },
  { stateName: "Assam", stateCode: "AS", region: "North-East", associationName: "North East Computer Traders Association (NECTA)", foundedYear: 2016, memberCount: 410, city: "Guwahati", mapX: 70, mapY: 29, presidentName: "Ranjan Kumar Das", contactPhone: "+91 94351 18986", contactEmail: "president@necta.co.in", logoSlug: "assam" },
  { stateName: "Arunachal Pradesh", stateCode: "AR", region: "North-East", associationName: "Arunachal IT Traders Forum", foundedYear: 2019, memberCount: 45, city: "Itanagar", mapX: 76, mapY: 20 },
  { stateName: "Nagaland", stateCode: "NL", region: "North-East", associationName: "Nagaland IT Dealers Association", foundedYear: 2019, memberCount: 40, city: "Kohima", mapX: 79, mapY: 28 },
  { stateName: "Manipur", stateCode: "MN", region: "North-East", associationName: "Manipur IT Traders Association", foundedYear: 2019, memberCount: 38, city: "Imphal", mapX: 77, mapY: 32 },
  { stateName: "Mizoram", stateCode: "MZ", region: "North-East", associationName: "Mizoram IT Dealers Forum", foundedYear: 2020, memberCount: 30, city: "Aizawl", mapX: 74, mapY: 36 },
  { stateName: "Tripura", stateCode: "TR", region: "North-East", associationName: "Tripura IT Traders Association", foundedYear: 2019, memberCount: 42, city: "Agartala", mapX: 68, mapY: 35 },
  { stateName: "Meghalaya", stateCode: "ML", region: "North-East", associationName: "Meghalaya IT Dealers Forum", foundedYear: 2020, memberCount: 35, city: "Shillong", mapX: 71, mapY: 31 },
  { stateName: "Jharkhand", stateCode: "JH", region: "East", associationName: "Jharkhand Computer Traders Association (JCTA)", foundedYear: 2016, memberCount: 780, city: "Ranchi", mapX: 54, mapY: 38, presidentName: "Mukesh Jha", contactPhone: "+91 93343 90891", contactEmail: "jctajharkhand@yahoo.com", logoSlug: "jharkhand" },
  { stateName: "Odisha", stateCode: "OR", region: "East", associationName: "Information Technology Association Of Orissa (ITAO)", foundedYear: 2016, memberCount: 890, city: "Bhubaneswar", mapX: 55, mapY: 47, presidentName: "AbhiNash Patnayak", contactPhone: "+91 98610 63215", contactEmail: "president@itaoodisha.org", logoSlug: "odisha" },
  { stateName: "Chhattisgarh", stateCode: "CT", region: "Central", associationName: "Chhattisgarh Computer & Media Dealer Association (CCMDA)", foundedYear: 2017, memberCount: 520, city: "Raipur", mapX: 46, mapY: 44, presidentName: "Avinash Makhija", contactPhone: "+91 98261 62122", contactEmail: "avinash.compu@gmail.com", logoSlug: "chhattisgarh" },
  { stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "Bhoj Information Technology & Office Automation Dealers Association (BITOAA)", foundedYear: 2015, memberCount: 1980, city: "Bhopal", mapX: 38, mapY: 41, presidentName: "Manish Gupta", contactPhone: "+91 98260 99941", contactEmail: "president.bitoaa@gmail.com", logoSlug: "madhya-pradesh" },
  { stateName: "Gujarat", stateCode: "GJ", region: "West", associationName: "Federation Of Information Technology Association Gujarat (FITAG)", foundedYear: 2014, memberCount: 3400, city: "Ahmedabad", mapX: 20, mapY: 43, presidentName: "Alok Ghelani", contactPhone: "+91 98986 22606", contactEmail: "president@fitag.in", logoSlug: "gujarat" },
  { stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Computer Media Dealers Association, Mumbai (CMDA)", foundedYear: 2014, memberCount: 6100, city: "Mumbai", mapX: 30, mapY: 54, presidentName: "Mihir Shah", contactPhone: "+91 98200 67580", contactEmail: "mihir@datatradeindia.com", logoSlug: "maharashtra" },
  { stateName: "Telangana", stateCode: "TG", region: "South", associationName: "Telangana IT Traders Association", foundedYear: 2015, memberCount: 1750, city: "Hyderabad", mapX: 43, mapY: 58 },
  { stateName: "Andhra Pradesh", stateCode: "AP", region: "South", associationName: "Computer Dealers Association Of Nellore Distt (CDAN)", foundedYear: 2015, memberCount: 1620, city: "Nellore", mapX: 46, mapY: 64, presidentName: "B.V. Deepak", contactPhone: "+91 98481 75765", contactEmail: "deepak@sv-technologies.net", logoSlug: "andhra-pradesh" },
  { stateName: "Karnataka", stateCode: "KA", region: "South", associationName: "Federation Of IT Dealer's Association Of Karnataka (FITDAK)", foundedYear: 2014, memberCount: 4200, city: "Bengaluru", mapX: 33, mapY: 68, presidentName: "G. N. Mahesha", contactPhone: "+91 99866 32220", contactEmail: "gnmahesh9@gmail.com", logoSlug: "karnataka" },
  { stateName: "Goa", stateCode: "GA", region: "West", associationName: "Goa IT Business Association (GIBA)", foundedYear: 2018, memberCount: 110, city: "Panaji", mapX: 26, mapY: 62, presidentName: "Ishwar Naik", contactPhone: "+91 98230 38013", contactEmail: "ishwar@siliconcomp.com", logoSlug: "goa" },
  { stateName: "Kerala", stateCode: "KL", region: "South", associationName: "All Kerala IT Dealers Association (AKITDA)", foundedYear: 2014, memberCount: 2600, city: "Kochi", mapX: 31, mapY: 84, presidentName: "Hareesh Kollam", contactPhone: "+91 94470 75216", contactEmail: "statepresident@akitda.co.in", logoSlug: "kerala" },
  { stateName: "Tamil Nadu", stateCode: "TN", region: "South", associationName: "Confederation Of IT Associations (CONFED ITA)", foundedYear: 2014, memberCount: 3800, city: "Chennai", mapX: 39, mapY: 84, presidentName: "Vasudevan", contactPhone: "+91 99444 40980", contactEmail: "president@confedita.com", logoSlug: "tamil-nadu" },
];

// Additional real member associations under states that have more than one
// FAIITA-affiliated body (Faiita_President_XL_2025 27.xlsx). Attached to the
// state via `stateSlug`, which must match the slug generated from `states` above.
type MemberSeed = {
  stateSlug: string;
  name: string;
  city: string;
  presidentName: string;
  contactPhone: string;
  contactEmail: string;
  logoSlug: string; // filename (no extension) expected at /public/logos/member/<logoSlug>.png
};

const realMemberAssociations: MemberSeed[] = [
  { stateSlug: "madhya-pradesh", name: "M.P. Computer Telecom Association Samiti (MPCTAS)", city: "Indore", presidentName: "Rakesh Daga", contactPhone: "+91 93032 88083", contactEmail: "indoredb@gmail.com", logoSlug: "mpctas" },
  { stateSlug: "madhya-pradesh", name: "Mahakaushal Computer Dealer's Association (MCDA)", city: "Jabalpur", presidentName: "B.L. Patel", contactPhone: "+91 93007 64155", contactEmail: "mcdajbp2003@gmail.com", logoSlug: "mcda-jabalpur" },
  { stateSlug: "maharashtra", name: "The Chandrapur District Computer Dealers Association (TCDCDA)", city: "Chandrapur", presidentName: "Pankaj Zode", contactPhone: "+91 95956 55505", contactEmail: "cdcda.cha@gmail.com", logoSlug: "tcdcda" },
  { stateSlug: "maharashtra", name: "Association Of System Integrators & Retailers Technology (ASIRT)", city: "Mumbai", presidentName: "Bharat Chheda", contactPhone: "+91 98212 46565", contactEmail: "president@asirt.in", logoSlug: "asirt" },
  { stateSlug: "maharashtra", name: "Trade Association Of Information Technology (TAIT)", city: "Mumbai", presidentName: "Rushabh Shah", contactPhone: "+91 93222 13274", contactEmail: "taitoffice@tait.in", logoSlug: "tait" },
  { stateSlug: "maharashtra", name: "Vidarbha Computer & Media Dealer's Welfare Association (VCMDWA)", city: "Nagpur", presidentName: "Dinesh Naidu", contactPhone: "+91 98230 16763", contactEmail: "admin@vcmdwa.org", logoSlug: "vcmdwa" },
  { stateSlug: "maharashtra", name: "CMDA Pune", city: "Pune", presidentName: "Mahesh More", contactPhone: "+91 98220 44158", contactEmail: "president@cmdapune.org", logoSlug: "cmda-pune" },
  { stateSlug: "maharashtra", name: "Computer Association of Nasik (CAN)", city: "Nashik", presidentName: "Sharad Mishra", contactPhone: "+91 98230 55584", contactEmail: "info@canit.co.in", logoSlug: "can-nasik" },
  { stateSlug: "maharashtra", name: "CMDA Sangli", city: "Sangli", presidentName: "Pravin Suresh Pachore", contactPhone: "+91 93721 46565", contactEmail: "president@cmdasangli.in", logoSlug: "cmda-sangli" },
  { stateSlug: "maharashtra", name: "Computer Association of Ichalkaranji", city: "Ichalkaranji", presidentName: "Kiran Chougule", contactPhone: "+91 93700 12682", contactEmail: "sandeep542001@gmail.com", logoSlug: "ca-ichalkaranji" },
  { stateSlug: "maharashtra", name: "Navi Mumbai IT Association (NMIT)", city: "Navi Mumbai", presidentName: "Hemant Gupta", contactPhone: "+91 98198 10100", contactEmail: "twinklesystems@gmail.com", logoSlug: "nmit" },
  { stateSlug: "delhi", name: "Computer Media Dealers Association, Delhi [Regd] (CMDA)", city: "New Delhi", presidentName: "Puneet Singhal", contactPhone: "+91 98100 48176", contactEmail: "infocmda@gmail.com", logoSlug: "cmda-delhi" },
  { stateSlug: "delhi", name: "Progressive Channels Association Of Information Technology (PCAIT)", city: "New Delhi", presidentName: "Alok Gupta", contactPhone: "+91 98101 98881", contactEmail: "alokgupta@unistal.com", logoSlug: "pcait" },
  { stateSlug: "delhi", name: "Confederation of Indian MSME in ESDM & IT (CIMEIT)", city: "New Delhi", presidentName: "Milan Agrawal", contactPhone: "+91 98102 39199", contactEmail: "dg@ciemei.in", logoSlug: "cimeit" },
  { stateSlug: "rajasthan", name: "Udaipur Computer Traders Association (UCTA)", city: "Udaipur", presidentName: "Ajay Srivastava", contactPhone: "+91 98290 42643", contactEmail: "info@ucta.org.in", logoSlug: "ucta" },
  { stateSlug: "uttar-pradesh", name: "Society For Welfare Of IT Dealers U.P.", city: "Lucknow", presidentName: "Vipul Garg", contactPhone: "+91 98370 26945", contactEmail: "vipul@saviks.com", logoSlug: "swid-up" },
];

const testimonials = [
  { name: "Navin Gupta", role: "President, FAIITA", association: "Bihar IT Association", quote: "FAIITA has been instrumental in uniting IT dealers across India. Through sustained advocacy, our members have seen real policy change.", order: 1 },
  { name: "Liju P. Raju", role: "Sr. Vice President, FAIITA", association: "Kerala IT Dealers Association", quote: "Being part of FAIITA gives our state association a voice at the national level. The networking opportunities are invaluable.", order: 2 },
  { name: "Rajeev Chitkara", role: "Vice President, FAIITA", association: "Punjab Computer Dealers Association", quote: "FAIITA's training programs and industry insights help our members stay competitive in a fast-changing market.", order: 3 },
  { name: "Amit Kumar", role: "Secretary, FAIITA", association: "Delhi IT Traders Association", quote: "The federation's work on GST simplification and digital-transformation advocacy has directly benefited our 5,000+ members.", order: 4 },
];

// Current Governing Body — FAIITA TEAM 25-27 (DAIRY 25 27.pptx).
// imageUrl points to /public/leadership/<slug>.jpg — see public/leadership/README.md.
const leaders = [
  { name: "Navin Gupta", role: "President", order: 1, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/navin-gupta.jpg" },
  { name: "Liju P Raju", role: "Senior Vice President", order: 2, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/liju-p-raju.jpg" },
  { name: "Praful Desai", role: "Vice President", order: 3, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/praful-desai.jpg" },
  { name: "Sanjeev Walia", role: "General Secretary", order: 4, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sanjeev-walia.jpg" },
  { name: "Deepak Bommisetty", role: "Joint Secretary", order: 5, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/deepak-bommisetty.jpg" },
  { name: "Naveen Gupta", role: "Treasurer", order: 6, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/naveen-gupta.jpg" },
  { name: "Koushik Pandya", role: "Advisor, IPP", order: 7, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/koushik-pandya.jpg" },
  { name: "Arun Dey", role: "GB Member", order: 8, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/arun-dey.jpg" },
  { name: "Pawan Agarwal", role: "GB Member", order: 9, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/pawan-agarwal.jpg" },
  { name: "Sulalith Gupta", role: "GB Member", order: 10, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sulalith-gupta.jpg" },
  { name: "Neeraj Agarwal", role: "GB Member", order: 11, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/neeraj-agarwal.jpg" },
  { name: "Kuldeep S Verma", role: "GB Member", order: 12, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/kuldeep-s-verma.jpg" },
  { name: "Devesh Rastogi", role: "GB Member", order: 13, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/devesh-rastogi.jpg" },
  { name: "S. Karthikeyan", role: "GB Member", order: 14, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/s-karthikeyan.jpg" },
  { name: "Susheel Kumar", role: "GB Member", order: 15, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/susheel-kumar.jpg" },
  { name: "Paresh Salgaonkar", role: "GB Member", order: 16, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/paresh-salgaonkar.jpg" },
  { name: "Sugreev Singh Ranawat", role: "GB Member", order: 17, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sugreev-singh-ranawat.jpg" },
  { name: "Dharmesh Negandhi", role: "GB Member", order: 18, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/dharmesh-negandhi.jpg" },
];

// Previous Governing Body — FAIITA TEAM 22-24 (DAIRY 23 WITH LOGO.pdf).
const pastLeaders = [
  { name: "Devesh Rastogi", role: "President", order: 1, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/devesh-rastogi.jpg" },
  { name: "S. Karthikeyan", role: "Senior Vice President", order: 2, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/s-karthikeyan.jpg" },
  { name: "Arun Dey", role: "Vice President", order: 3, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/arun-dey.jpg" },
  { name: "Navin Gupta", role: "General Secretary", order: 4, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/navin-gupta.jpg" },
  { name: "Deepak Bommisetty", role: "Joint Secretary", order: 5, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/deepak-bommisetty.jpg" },
  { name: "Naveen Gupta", role: "Treasurer", order: 6, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/naveen-gupta.jpg" },
  { name: "Susheel Kumar", role: "Joint Treasurer", order: 7, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/susheel-kumar.jpg" },
  { name: "Koushik Pandya", role: "Advisor, IPP", order: 8, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/koushik-pandya.jpg" },
  { name: "Sanjeev Walia", role: "GB Member", order: 9, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/sanjeev-walia.jpg" },
  { name: "Liju R", role: "GB Member / Zonal Chairman (South)", order: 10, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/liju-p-raju.jpg" },
  { name: "Naresh Batra", role: "GB Member", order: 11, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/naresh-batra.jpg" },
  { name: "Puneet Singhaal", role: "GB Member", order: 12, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/puneet-singhaal.jpg" },
  { name: "Deepak Vidhani", role: "GB Member", order: 13, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/deepak-vidhani.jpg" },
  { name: "B L Navlakha", role: "GB Member / Zonal Chairman (East)", order: 14, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/b-l-navlakha.jpg" },
  { name: "Praful Desai", role: "GB Member / Zonal Chairman (West)", order: 15, category: "national", term: "2022–2024", isCurrent: false, imageUrl: "/leadership/praful-desai.jpg" },
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
  { label: "States Covered", value: "31", suffix: "", icon: "MapPinned", order: 1 },
  { label: "Member Associations", value: "100", suffix: "+", icon: "Building2", order: 2 },
  { label: "Channel Partners", value: "50", suffix: "K+", icon: "Users", order: 3 },
  { label: "Employment Generated", value: "5", suffix: "L+", icon: "Briefcase", order: 4 },
  { label: "Years Since 2014", suffix: "+", value: "12", icon: "CalendarClock", order: 5 },
  { label: "Policy Advocacy Wins", value: "300", suffix: "+", icon: "ShieldCheck", order: 6 },
];

const newsItems = [
  { slug: "faiita-hosts-national-it-summit-2025", title: "FAIITA Hosts National IT Summit 2025 in New Delhi", excerpt: "Leaders from all 29 state associations convened to chart the federation's advocacy roadmap for the year ahead.", category: "Events", featured: true, daysAgo: 20 },
  { slug: "new-gst-guidelines-for-it-products", title: "New GST Guidelines for IT Products Announced", excerpt: "FAIITA's sustained advocacy leads to simplified GST compliance for IT dealers and distributors nationwide.", category: "Policy", featured: true, daysAgo: 35 },
  { slug: "digital-india-skill-development", title: "Digital India Initiative: FAIITA's Role in Skill Development", excerpt: "Partnership with government agencies to train 10,000+ IT professionals in emerging technologies.", category: "Initiative", featured: false, daysAgo: 48 },
  { slug: "faiita-emerging-tech-roundtable", title: "FAIITA Convenes Roundtable on Emerging Technology Retail", excerpt: "State association leaders discussed the shift toward AI-enabled devices and its impact on channel partners.", category: "Press Release", featured: false, daysAgo: 60 },
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

const newsletters = [
  { title: "FAIITA Quarterly — Q1 2026", issueNumber: 21, monthsAgo: 1, description: "GST updates, state association spotlights, and the year's advocacy roadmap." },
  { title: "FAIITA Quarterly — Q4 2025", issueNumber: 20, monthsAgo: 4, description: "AGM highlights, new member associations, and policy wins from 2025." },
  { title: "FAIITA Quarterly — Q3 2025", issueNumber: 19, monthsAgo: 7, description: "Channel partner summit recap and skill-development programme results." },
];

const policies = [
  { title: "FAIITA Annual Report 2025", category: "Annual", fileSize: "4.2 MB", description: "Comprehensive overview of the federation's work and impact in FY24–25." },
  { title: "IT Channel Partners Market Study 2026", category: "Research", fileSize: "2.8 MB", description: "Analysis of the IT channel partner ecosystem in Tier 1, 2, and 3 cities." },
  { title: "GST Impact Report on IT Trade", category: "Policy", fileSize: "1.6 MB", description: "Data-driven look at GST's effect on IT retailers and distributors nationwide." },
  { title: "Skill Development White Paper", category: "White Paper", fileSize: "2.1 MB", description: "Recommendations for upskilling India's IT channel workforce." },
];

async function main() {
  console.log("Seeding FAIITA database…");

  await prisma.contactSubmission.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
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

  const stateBySlug = new Map<string, string>(); // slug -> id, for attaching realMemberAssociations below

  for (const s of states) {
    const slug = s.stateName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const state = await prisma.stateAssociation.create({
      data: {
        slug,
        stateName: s.stateName,
        stateCode: s.stateCode,
        region: s.region,
        associationName: s.associationName,
        foundedYear: s.foundedYear,
        memberCount: s.memberCount,
        presidentName: s.presidentName ?? "REPLACE ME",
        contactEmail: s.contactEmail ?? `${s.stateCode.toLowerCase()}@faiita.co.in`,
        contactPhone: s.contactPhone ?? "+91 00000 00000",
        address: `${s.city}, ${s.stateName}`,
        description: `${s.associationName} represents IT channel partners, retailers and distributors across ${s.stateName}, working under the FAIITA umbrella${s.foundedYear ? ` since ${s.foundedYear}` : ""}.`,
        logoUrl: s.logoSlug ? `/logos/state/${s.logoSlug}.png` : null,
        mapX: s.mapX,
        mapY: s.mapY,
      },
    });
    stateBySlug.set(slug, state.id);
  }

  // Additional real member associations (states with more than one FAIITA-affiliated body).
  for (const m of realMemberAssociations) {
    const stateId = stateBySlug.get(m.stateSlug);
    if (!stateId) continue;
    await prisma.memberAssociation.create({
      data: {
        slug: `${m.stateSlug}-${m.logoSlug}`,
        name: m.name,
        city: m.city,
        type: "Retail",
        memberCount: 0,
        description: `${m.name} is a FAIITA-affiliated IT trade association based in ${m.city}.`,
        presidentName: m.presidentName,
        contactPhone: m.contactPhone,
        contactEmail: m.contactEmail,
        logoUrl: `/logos/member/${m.logoSlug}.png`,
        stateId,
      },
    });
  }

  await prisma.testimonial.createMany({ data: testimonials });
  await prisma.leader.createMany({ data: [...leaders, ...pastLeaders] });
  await prisma.stat.createMany({ data: stats });

  const now = Date.now();
  await prisma.news.createMany({
    data: newsItems.map((n) => ({
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      content: n.excerpt,
      category: n.category,
      featured: n.featured,
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
    })),
  });

  await prisma.galleryItem.createMany({ data: galleryItems });

  await prisma.newsletter.createMany({
    data: newsletters.map((n) => ({
      title: n.title,
      description: n.description,
      issueNumber: n.issueNumber,
      issueDate: new Date(now - n.monthsAgo * 30 * 86400000),
    })),
  });

  await prisma.policy.createMany({
    data: policies.map((p) => ({
      title: p.title,
      category: p.category,
      description: p.description,
      fileSize: p.fileSize,
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
