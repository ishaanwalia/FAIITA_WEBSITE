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
import { memberAssociations } from "../lib/member-associations";

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
  /** Filename (with extension) expected at /public/logos/state/<logoSlug> */
  logoSlug?: string;
  description?: string;
  /** Defaults to "<city>, <stateName>" — override when stateName isn't a literal state. */
  address?: string;
};

// Authoritative list of FAIITA state associations — Faiita_President_XL_2025 27.xlsx
// (31 associations; states like Maharashtra, Delhi, MP and Rajasthan have several).
// Some states have no dedicated state association, so a member association is
// recognised as the state association — hence multiple entries share a state.
// x/y are relative (0-100) positions on the illustrated India map viewBox.
const states: StateSeed[] = [
  // — North —
  { stateName: "Jammu & Kashmir", stateCode: "JK", region: "North", associationName: "Jammu Computer Dealer Association (Regd.)", foundedYear: 2005, memberCount: 120, city: "Jammu", mapX: 36, mapY: 8, presidentName: "Mahajan Atul", contactPhone: "9419188409", contactEmail: "mahajanatul136@gmail.com", secretaryEmail: "drgopalpsharma@gmail.com", websiteUrl: "http://jcdajammu.com/", logoSlug: "jcda.png", description: "Jammu Computer Dealer Association (Regd.) popularly known as JCDA is the representative body of IT Dealers in Jammu province covering ten districts of Jammu & Kashmir. JCDA has always stood for ethical business and has fought for the cause of IT fraternity. Apart from representing its members, the association is actively involved in social activities. As member of FAIITA, JCDA has represented Jammu and Kashmir at national level as and when required." },
  { stateName: "Himachal Pradesh", stateCode: "HP", region: "North", associationName: "Shimla I T Dealer Association (SITDA)", foundedYear: 2016, memberCount: 180, city: "Shimla", mapX: 39, mapY: 17, presidentName: "Rupin Rekhi", contactPhone: "+91 98160 77729", contactEmail: "info@sitda.in", logoSlug: "sitda.jpg" },
  { stateName: "Punjab", stateCode: "PB", region: "North", associationName: "Punjab Association of Computer Traders (PACT)", foundedYear: 2012, memberCount: 800, city: "Ludhiana", mapX: 32, mapY: 19, contactEmail: "president@pactpunjab.com", secretaryEmail: "secretary@pactpunjab.com", websiteUrl: "https://www.pactpunjab.com", logoSlug: "pact.webp", description: "Punjab Association of Computer Traders - PACT is the apex body representing the IT trade across Punjab and Chandigarh. It unites computer dealers, distributors, system integrators, networking and surveillance solution providers and technology businesses on a common platform. PACT is committed to safeguarding the interests of the IT industry, promoting ethical business practices, fostering collaboration and representing the trade before government authorities and industry stakeholders. Through advocacy, networking and knowledge-sharing initiatives, PACT is working towards building a stronger, more progressive and future-ready IT ecosystem for Punjab. United for the Growth of Punjab's IT Industry." },
  { stateName: "Chandigarh", stateCode: "CH", region: "North", associationName: "TECSPA Chandigarh", memberCount: 0, city: "Chandigarh", mapX: 34, mapY: 21, presidentName: "Satpal Singh", contactPhone: "+91 94172 18200", contactEmail: "president@tecspa.in", logoSlug: "tecspa.jpg" },
  { stateName: "Uttarakhand", stateCode: "UT", region: "North", associationName: "Uttaranchal IT Traders Association (UITTA)", foundedYear: 2001, memberCount: 120, city: "Dehradun", mapX: 43, mapY: 20, contactEmail: "president@uitta.org", logoSlug: "uitta.png", description: "UITTA is a group of individuals who come together with a shared vision and common purpose established in year 2001. We as UITTA promotes unity, cooperation and support to their members and also collective efforts for the betterment of our members." },
  { stateName: "Delhi", stateCode: "DL", region: "North", associationName: "All Delhi Computers Traders Association (ADCTA)", foundedYear: 2014, memberCount: 5200, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Mahinder Agrawal", contactPhone: "+91 92121 27937", contactEmail: "adcta.nehruplace@gmail.com", logoSlug: "adcta.webp" },
  { slug: "delhi-cmda", stateName: "Delhi", stateCode: "DL", region: "North", associationName: "Computer Media Dealers Association, Delhi (CMDA)", memberCount: 0, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Puneet Singhal", contactPhone: "+91 98100 48176", contactEmail: "infocmda@gmail.com", logoSlug: "cmda-delhi.webp" },
  { slug: "delhi-pcait", stateName: "Delhi", stateCode: "DL", region: "North", associationName: "Progressive Channels Association Of Information Technology (PCAIT)", memberCount: 0, city: "New Delhi", mapX: 37, mapY: 25, presidentName: "Alok Gupta", contactPhone: "+91 98101 98881", contactEmail: "alokgupta@unistal.com", logoSlug: "pcait.webp" },
  { stateName: "Rajasthan", stateCode: "RJ", region: "North", associationName: "Rajasthan Computer Traders Association (RCTA)", foundedYear: 2014, memberCount: 2100, city: "Jaipur", mapX: 26, mapY: 31, presidentName: "Sugriv Singh", contactPhone: "+91 94140 72413", contactEmail: "rajshreesystems.udaipur@gmail.com", logoSlug: "rcta.webp" },
  { slug: "rajasthan-ucta", stateName: "Rajasthan", stateCode: "RJ", region: "North", associationName: "Udaipur Computer Traders Association (UCTA)", memberCount: 0, city: "Udaipur", mapX: 26, mapY: 31, presidentName: "Ajay Srivastava", contactPhone: "+91 98290 42643", contactEmail: "info@ucta.org.in", logoSlug: "ucta.png" },
  { stateName: "Uttar Pradesh", stateCode: "UP", region: "North", associationName: "Uttar Pradesh Computer Dealers Welfare Association (UPCDWA)", foundedYear: 2014, memberCount: 550, city: "Lucknow", mapX: 46, mapY: 30, contactEmail: "president@upcdwa.com", secretaryEmail: "secretary@upcdwa.com", websiteUrl: "https://www.upcdwa.com", logoSlug: "upcdwa.jpeg", description: "The Uttar Pradesh Computer Dealers Welfare Association (UPCDWA) is the premier industry body representing IT hardware and software dealers, retailers, and distributors across the state of Uttar Pradesh. Operating under the national umbrella of the Federation of All India IT Associations (FAIITA) since 2014, the association unites over 550 members to give local IT businesses a collective voice." },

  // — East —
  {
    stateName: "Bihar", stateCode: "BR", region: "East",
    associationName: "Bihar IT Association (BITA)",
    foundedYear: 1995, memberCount: 350, city: "Patna", mapX: 55, mapY: 33,
    presidentName: "Rajiv Agrawal", contactPhone: "+91 94310 18295",
    contactEmail: "shailesh@anagencies.in", secretaryEmail: "bitabiharitassociation@gmail.com",
    logoSlug: "bita.jpg",
    // Website is in process — set websiteUrl once BITA shares it. Third
    // contact: shobhit@krishnaagencies.co.in (not displayed per BITA).
    description:
      "The Bihar IT Association (BITA) is the premier association representing IT trade professionals, dealers, distributors, retailers, and system integrators across Bihar. Dedicated to uniting the regional IT fraternity and fostering a collaborative, growth-oriented ecosystem, BITA plays a pivotal role in protecting local traders' interests, resolving key industry and business challenges, and connecting members with national IT bodies. By promoting ethical trade practices, BITA's mission is to drive digital empowerment, technological expansion, and build a robust, progressive IT trade landscape throughout Bihar.",
  },
  { stateName: "West Bengal", stateCode: "WB", region: "East", associationName: "COMPASS Kolkata", foundedYear: 2014, memberCount: 3100, city: "Kolkata", mapX: 62, mapY: 38, presidentName: "Manish Lunia", contactPhone: "+91 98311 55806", contactEmail: "manish@shreesales.co.in", logoSlug: "compass.webp" },
  { stateName: "Jharkhand", stateCode: "JH", region: "East", associationName: "Jharkhand Computer Traders Association (JCTA)", foundedYear: 2007, memberCount: 145, city: "Ranchi", mapX: 54, mapY: 38, contactEmail: "president@jcta.org.in", secretaryEmail: "secretary@jcta.org.in", websiteUrl: "https://www.jcta.org.in", logoSlug: "jcta.jpeg", description: [
    "The Jharkhand Computer Traders Association (JCTA) is the premier association representing the IT trade, dealers, distributors, and system integrators across Jharkhand. Dedicated to uniting the IT fraternity and fostering a collaborative ecosystem, JCTA plays a pivotal role in protecting local traders' interests, resolving business challenges, and bridging them with national bodies. Promoting ethical trade practices, our mission is to drive digital empowerment, technological growth, and support a robust, progressive IT trade ecosystem in the region.",
    "Our Strength:\n• Unity & Emotional Bonding\n• Collective Celebrations\n• Problem Solving & Support\n• Knowledge Sharing\n• Business Growth & Protection",
    "Together We Create Impact\n• Microsoft issues resolved across India with FAIITA support.\n• Avita issue resolved across India, ensuring partners received their money.",
    "Our Mission:\nTo promote the growth of the IT industry in Jharkhand by uniting computer traders, solving industry issues, sharing knowledge, celebrating togetherness, and protecting members' rights and benefits.",
  ].join("\n\n") },
  { stateName: "Odisha", stateCode: "OR", region: "East", associationName: "Information Technology Association Of Orissa (ITAO)", foundedYear: 2016, memberCount: 890, city: "Bhubaneswar", mapX: 55, mapY: 47, presidentName: "Abhinash Patnayak", contactPhone: "+91 98610 63215", contactEmail: "president@itaoodisha.org", logoSlug: "itao.webp" },
  // NECTA covers the whole North-East (Sikkim + the seven sister states) as
  // one unit, headquartered in Guwahati, Assam. There is no separate
  // North-East zone — NECTA is grouped under the East zone.
  { stateName: "North East", stateCode: "AS", region: "East", associationName: "North East Computer Traders Association (NECTA)", foundedYear: 2016, memberCount: 410, city: "Guwahati", mapX: 70, mapY: 29, presidentName: "Ranjan Kumar Das", contactPhone: "+91 94351 18986", contactEmail: "president@necta.co.in", logoSlug: "necta.png", address: "Guwahati, Assam", description: "North East Computer Traders Association (NECTA) represents IT channel partners, retailers and distributors across the entire North-East — Sikkim, Assam, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura and Meghalaya — headquartered in Guwahati and working under the FAIITA umbrella since 2016." },

  // — Central —
  {
    stateName: "Madhya Pradesh", stateCode: "MP", region: "Central",
    associationName: "Bhoj Information Technology & Office Automation Dealers Association (BITOAA)",
    foundedYear: 2007, memberCount: 260, city: "Bhopal", mapX: 38, mapY: 41,
    presidentName: "Manish Gupta", contactPhone: "+91 98260 99941",
    // President also uses president.bitoaa@gmail.com (alternate address).
    contactEmail: "president@bitoaa.com", secretaryEmail: "secretary.bitoaa@gmail.com",
    websiteUrl: "https://bitoaa.com", logoSlug: "biotaa.png",
    description: [
      "“Grow Your Business Through Relations”",
      "At the outset, we are pleased to introduce BITOAA (Bhoj Information Technology & Office Automation Dealers Association, Bhopal), a prestigious association representing Information Technology, Security Systems, Power Systems, and Office Automation dealers in Bhopal for the past 19 years.",
      "BITOAA was established with the objective of bringing all professionals and businesses from the Information Technology, Security Systems, Power Systems, and Office Automation sectors under one umbrella. Over the years, the association has grown significantly and currently boasts a strong membership base of more than 256 members. The primary mission of BITOAA is to promote ethical business practices and ensure the delivery of genuine products, superior quality, and timely services to customers.",
      "The association organizes four General Body Meetings annually to encourage collaboration, knowledge sharing, and business development among its members. BITOAA continuously strives to keep its members informed about the latest industry trends, technologies, and market opportunities.",
      "In addition to its business-focused initiatives, BITOAA actively fulfills its social responsibilities through various community welfare programs, including:\n• Health check-up camps for members and their families.\n• Blood donation drives.\n• Contributions and support to old age homes and orphanages.\n• Tree plantation campaigns on the occasion of World Environment Day.",
      "To strengthen the bond among its members, BITOAA regularly organizes family-oriented events such as MILAP gatherings and family picnics twice a year. The association also promotes a healthy and competitive spirit by conducting sports events, including cricket tournaments and badminton competitions.",
      "For the year 2026–2027, BITOAA is inviting sponsorship opportunities that offer mutual benefits to both sponsors and members. Sponsors will receive extensive visibility and engagement opportunities through various association events and activities. Detailed sponsorship proposals and event schedules will be shared with interested organizations in due course.",
      "The BITOAA Event Team is committed to ensuring that all sponsors receive maximum value through enhanced visibility, brand recognition, market reach, sales opportunities, and direct proximity to end users and business decision-makers.",
      "We look forward to your valuable support and contribution in helping us continue our journey of excellence and community development.",
    ].join("\n\n"),
  },
  { slug: "madhya-pradesh-mpctas", stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "M.P. Computer Telecom Association Samiti (MPCTAS)", memberCount: 0, city: "Indore", mapX: 38, mapY: 41, presidentName: "Rakesh Daga", contactPhone: "+91 93032 88083", contactEmail: "indoredb@gmail.com", logoSlug: "mpcta.jpg" },
  { slug: "madhya-pradesh-mcda", stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "Mahakaushal Computer Dealer's Association (MCDA)", memberCount: 0, city: "Jabalpur", mapX: 38, mapY: 41, presidentName: "B.L. Patel", contactPhone: "+91 93007 64155", contactEmail: "mcdajbp2003@gmail.com", logoSlug: "mcda.webp" },

  // — West —
  {
    stateName: "Gujarat", stateCode: "GJ", region: "West",
    associationName: "Federation Of Information Technology Association Gujarat (FITAG)",
    foundedYear: 2008, memberCount: 10000, city: "Ahmedabad", mapX: 20, mapY: 43,
    presidentName: "Alok Ghelani", contactPhone: "+91 98986 22606",
    contactEmail: "president@fitag.in", secretaryEmail: "secretary@fitag.in",
    websiteUrl: "https://www.fitag.in", logoSlug: "gujarat.png",
    description: [
      "FITAG has been an old idea, which has now flourished through the interest and initiative of many leaders of the IT fraternity in Gujarat. In fact, there is no such umbrella body at the regional level anywhere across India. Cities across Gujarat, as well as India, have their own associations and most of their problems are common — FITAG is the first body of its kind in India to address those common issues.",
      "Founded in 2008, FITAG today unites 44 IT associations under a single umbrella, representing 10,000+ IT partners across Gujarat.",
      "FITAG's objectives, in a nutshell, rest on a five-point agenda — Flourish, Knowledge, Networking, Strength and Protection — the foundation on which FITAG is laid:",
      "• Flourish — to flourish and co-exist by being united and supportive of each other.\n• Knowledge — to share the knowledge available by all means.\n• Networking — to increase awareness through extensive networking with each other.\n• Strength — to stay united and utilise the collective strength.\n• Protection — to protect the common interest.",
    ].join("\n\n"),
  },
  {
    stateName: "Maharashtra", stateCode: "MH", region: "West",
    associationName: "Computer Media Dealers Association, Mumbai (CMDA)",
    foundedYear: 1981, memberCount: 225, city: "Mumbai", mapX: 30, mapY: 54,
    presidentName: "Samir Parekh", contactEmail: "Brain2@ymail.com",
    secretaryEmail: "devang@3findia.com",
    websiteUrl: "https://www.cmdamumbai.in", logoSlug: "cmda-mumbai.webp",
    description: [
      "CMDA Mumbai is a premier IT channel association in Maharashtra, recently revitalised into a highly active hub of collaboration. Under the visionary guidance of industry leaders, it unites IT business owners, resellers, system integrators, cybersecurity experts and hardware manufacturers across Mumbai. The association serves as a powerful collective voice — driving networking, financial literacy and regulatory advocacy to empower Mumbai's technology trade community.",
      "Founded in 1981 and registered under the Ministry of Corporate Affairs as Computer Media Dealers' Association, CMDA Mumbai today brings together nearly 225 senior, reputable business owners — under recent leadership the association grew its active base from a dwindling 25 members to its current strength.",
    ].join("\n\n"),
  },
  { slug: "maharashtra-asirt", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Association Of System Integrators & Retailers in Technology (ASIRT)", foundedYear: 2012, memberCount: 270, city: "Mumbai", mapX: 30, mapY: 54, contactEmail: "president@asirt.in", secretaryEmail: "secretary@asirt.in", websiteUrl: "https://www.asirt.in", logoSlug: "asirt.webp", description: "ASIRT (Association of System Integrators and Retailers in Technology) is one of India's most dynamic IT channel associations, dedicated to empowering System Integrators, Solution Providers, Retailers, Cloud Partners, and IT Services companies. Founded in Mumbai and serving the IT community since 2012, ASIRT provides a powerful platform for collaboration, networking, business growth, and knowledge sharing.\n\nWith a vibrant community of over 270 members, ASIRT brings together technology entrepreneurs and business leaders to create meaningful partnerships and new business opportunities. Through regular technology seminars, business conclaves, training programs, consortium initiatives, and industry interactions, ASIRT helps members evolve, expand, and stay ahead in a rapidly changing technology landscape.\n\nASIRT also acts as a strong voice for the IT channel community, facilitating engagement with OEMs and vendors, addressing member grievances, and fostering a healthy and profitable business ecosystem. Beyond business, ASIRT nurtures a spirit of camaraderie through events such as the ASIRT Synergy Biz Conclave, ACPL cricket tournament, social gatherings, and family-oriented activities.\n\nDriven by its philosophy of Partner, Progress, and Evolve, ASIRT continues to build a unified, future-ready IT partner ecosystem where members learn, grow, and win together." },
  { slug: "maharashtra-tait", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Trade Association Of Information Technology (TAIT)", foundedYear: 1996, memberCount: 450, city: "Mumbai", mapX: 30, mapY: 54, contactEmail: "president@tait.in", secretaryEmail: "swetal@megamaninfo.com", websiteUrl: "https://www.tait.in", logoSlug: "tait.png", description: "Trade Association of Information Technology (TAIT) was formed in March 1996 to represent the interest of IT community in the ecosystem of Distributors / Sub-distributors / Resellers, System Integrators & Service Providers.\n\nTAIT has over 450+ members representing the complete spectrum of IT organizations. The association was formed to uphold the larger interest of the IT trade, which represents 70% of Mumbai's IT industry. It's a forum where the challenges of Mumbai's domestic IT Industry business is heard and understood. TAIT is a pro-active, leading IT association of India.\n\nTAIT enjoys cordial relations with all OEMs. TAIT's role has also been lauded by various IT / non IT media on several occasions and partnered with them from time to time. TAIT is also fortunate to have very resourceful members who bring in expertise to share their perspective with fellow members. TAIT has very cordial working relationship with other representative associations like MAIT, NASSCOM, IMC and work closely with them on issues related to IT industry.\n\nTAIT over the past years have interacted with state Government Departments, Central Government Departments to brief and resolution of IT channel community business challenges. It continues to do so in future.\n\nTAIT has its own office in Mumbai managed by professional team. It has team of consultants on board on various taxation and policy matters.\n\nTAIT organizes regular meetings on member's issues like non-payments / warranty / service, SI meet, Technology sessions, Product Promotion meets, and Media Meets. It sponsors ICT events / meets organized by the government, IT media, and industry players at regional & national level. TAIT Knowledge Series Events focus on Seminars / workshops on technology awareness and professional / personal skills development of the member community." },
  {
    slug: "maharashtra-nmit", stateName: "Maharashtra", stateCode: "MH", region: "West",
    associationName: "Navi Mumbai IT Association (NMITA)",
    foundedYear: 2025, memberCount: 100, city: "Navi Mumbai", mapX: 30, mapY: 54,
    presidentName: "Hemant Gupta", contactPhone: "+91 98198 10100",
    contactEmail: "tssvision1@gmail.com", secretaryEmail: "deepak.manodara@gmail.com",
    logoSlug: "nmit.png",
    description: [
      "The Navi Mumbai IT Association (NMITA) is a prominent regional tech coalition established in 2025 to support the rapidly growing digital ecosystem in Navi Mumbai. Spurred by major infrastructure developments like the Navi Mumbai International Airport, NMITA serves as the unified voice for the city's expanding information technology sector.",
      "Formed just a year ago, the association has already brought together a powerful network of 100+ members, ranging from early-stage tech startups to established software houses, system integrators, and IT consultants.",
      "The primary objective is to cultivate Navi Mumbai into a premier destination for tech entrepreneurship, bridging the gap between local companies, industry mentors, and institutional giants like the WTC Navi Mumbai.",
      "NMITA actively hosts knowledge-sharing sessions, fosters internal B2B referral networks, and interfaces with local municipal bodies to ensure robust IT infrastructure, stable power, and favorable tech policies.",
    ].join("\n\n"),
  },
  { slug: "maharashtra-cmda-pune", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "CMDA Pune", memberCount: 0, city: "Pune", mapX: 30, mapY: 54, presidentName: "Mahesh More", contactPhone: "+91 98220 44158", contactEmail: "president@cmdapune.org", logoSlug: "cmda-pune.webp" },
  { slug: "maharashtra-can", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Computer Association of Nasik (CAN)", memberCount: 0, city: "Nashik", mapX: 30, mapY: 54, presidentName: "Sharad Mishra", contactPhone: "+91 98230 55584", contactEmail: "info@canit.co.in", logoSlug: "can.webp" },
  { slug: "maharashtra-vcmdwa", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Vidarbha Computer & Media Dealers Welfare Association (VCMDWA)", foundedYear: 1991, memberCount: 125, city: "Nagpur", mapX: 30, mapY: 54, presidentName: "Dinesh Naidu", contactEmail: "dinesh@dineshnaidu.com", secretaryEmail: "lg40@hotmail.com", websiteUrl: "https://www.vcmdwa.org", logoSlug: "vcmdwa.png", description: "The Vidarbha Computer & Media Dealers Welfare Association (VCMDWA), established in 1991, is a registered charitable trust under the Societies Registration Act, 1860. It is one of Central India's most active and respected industry associations representing the interests of computer hardware, software, digital media, surveillance, and IT service providers.\n\nWith a robust network of over 125+ active members, VCMDWA functions as a non-profit, non-political body, promoting ethical business practices, industry collaboration, customer trust, and community welfare in the IT and electronics sector." },
  { slug: "maharashtra-jjita", stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Jalgaon Jilha Information Technology Association (JJITA)", foundedYear: 2022, memberCount: 127, city: "Jalgaon", mapX: 30, mapY: 54, contactEmail: "itajalgaonjilha@gmail.com", contactPhone: "+91 98601 28301", websiteUrl: "https://www.jjita.com", logoSlug: "jjita.png", description: "A registered association representing IT dealers, system integrators and technology entrepreneurs across Jalgaon district. Founded in 2022, JJITA brings the district's IT community together to foster collaboration, share knowledge and create business opportunities — driving industry growth through collective advocacy, business networking and skill development initiatives." },
  { stateName: "Goa", stateCode: "GA", region: "West", associationName: "Goa IT Business Association (GIBA)", foundedYear: 1996, memberCount: 105, city: "Panaji", mapX: 26, mapY: 62, contactEmail: "gibaofficegoa@gmail.com", websiteUrl: "https://gibagoa.co.in", logoSlug: "giba.png", description: "Goa IT Business Association (GIBA) was formed in the year 1996. GIBA has around 105 members at present and its primary objective is to offer guidance, support and most importantly an opportunity to grow their businesses.\n\nEvery year GIBA organises events such as Tech Days, Blood Donation Camps, GIBA Family Get-together and sports activities such as the GIBA Cricket event, technical training for GIBA members and their employees, medical check-up camps and more.\n\nGIBA's objective is to unite all the IT dealers of Goa and extend whatever help is needed to ensure they develop and grow their respective business in this highly competitive environment.\n\nGIBA has members from the fields of IT hardware, software, Internet Service Providers, CCTV and more." },

  // — South —
  { stateName: "Andhra Pradesh", stateCode: "AP", region: "South", associationName: "Computer Dealers Association Of Nellore Distt (CDAN)", foundedYear: 2015, memberCount: 1620, city: "Nellore", mapX: 46, mapY: 64, presidentName: "B.V. Deepak", contactPhone: "+91 98481 75765", contactEmail: "deepak@sv-technologies.net", logoSlug: "cdan.webp" },
  {
    stateName: "Kerala", stateCode: "KL", region: "South",
    associationName: "All Kerala IT Dealers Association (AKITDA)",
    foundedYear: 2004, memberCount: 1500, city: "Ernakulam", mapX: 31, mapY: 84,
    presidentName: "Hareesh Kollam", contactPhone: "+91 94470 75216",
    contactEmail: "statepresident@akitda.co.in", secretaryEmail: "stategs@akitda.co.in",
    websiteUrl: "https://www.akitda.co.in", logoSlug: "akitda.png",
    address: "ER-366/2004, Ist Floor, Krishnakripa, KSN Menon Road, Near South Over Bridge, Ernakulam, Kerala – 682016",
    description: [
      "AKITDA was formed in April 2004 for the welfare and protection of the rights of people associated with the production, sales and service of computers, computer-associated products and spare parts. Thousands of IT dealers are part of this association, which develops organizational skills, plans welfare schemes and helps in members' professional development. Exhibitions and seminars that help in the expansion of business are also conducted for the welfare of members. The association helps IT dealers overcome all sorts of troubles they experience and helps them get their claimed benefits — Snehasparsham is the programme introduced for implementing this.",
      "The main objectives of the association are:\n• To develop organizational awareness and financial support by mutual cooperation among computer dealers.\n• To provide scientific and technical knowledge which results in the uplifting of dealers and merchants.\n• To develop projects for the financial security of dealers.\n• To develop an atmosphere for co-existence and for the consolidation of IT dealers all over India.\n• To protect the best interests of the IT business community, of the public and of the country.\n• To develop the qualities of honesty, compassion, patriotism and willingness to sacrifice among the members.",
      "Registered Office: ER-366/2004, Ist Floor, Krishnakripa, KSN Menon Road, Near South Over Bridge, Ernakulam, Kerala – 682016.",
      "Websites: www.akitda.co.in · www.akitda.org · www.akitda.in",
    ].join("\n\n"),
  },
  { stateName: "Tamil Nadu", stateCode: "TN", region: "South", associationName: "Confederation Of IT Associations (CONFED ITA)", foundedYear: 2014, memberCount: 3800, city: "Chennai", mapX: 39, mapY: 84, presidentName: "Vasudevan", contactPhone: "+91 99444 40980", contactEmail: "president@confedita.com", logoSlug: "confed.webp", description: "Confederation Of IT Associations (CONFED ITA) represents IT channel partners, retailers and distributors across Tamil Nadu and Puducherry, working under the FAIITA umbrella since 2014." },
];

// Verified member associations live in lib/member-associations.ts — the
// member-associations page renders straight from that file, and the seed
// mirrors it into the DB so state detail pages list them as member chapters.

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
  // term is Devesh Rastogi (2022–24), listed below as Chairman.
  { name: "Koushik Pandya", role: "Advisor, PP", order: 8, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/koushik-pandya.jpg" },
  { name: "Arun Dey", role: "GB Member", order: 9, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/arun-dey.jpg" },
  { name: "Pawan Agarwal", role: "GB Member", order: 10, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/pawan-agarwal.jpg" },
  { name: "Sulalith Gupta", role: "GB Member", order: 11, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/sulalith-gupta.jpg" },
  { name: "Neeraj Agarwal", role: "GB Member", order: 12, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/neeraj-agarwal.jpg" },
  { name: "Kuldeep S Verma", role: "GB Member", order: 13, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/kuldeep-s-verma.jpg" },
  // Chairman — display position (right after the President) is handled by the
  // leadership page's office-bearer ordering, not this DB order.
  { name: "Devesh Rastogi", role: "Chairman", order: 14, category: "national", term: "2025–2027", isCurrent: true, imageUrl: "/leadership/devesh-rastogi.jpg" },
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
  // 31 affiliated associations operate across 26 covered states — the stat
  // shows the states figure per FAIITA's preference.
  { label: "States Covered", value: "26", suffix: "", icon: "MapPinned", order: 1 },
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
  { slug: "faiita-hosts-national-it-summit-2025", title: "FAIITA Hosts National IT Summit 2025 in New Delhi", excerpt: "Leaders from state associations across all 26 states convened to chart the federation's advocacy roadmap for the year ahead.", category: "Events", featured: false, daysAgo: 160 },
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

// Real gallery albums live in lib/gallery-albums.ts and render straight from
// code — no demo gallery items are seeded anymore. The galleryItem table is
// kept for future one-off photos (seeded empty; the page filters isDemo).

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

  const stateIdBySlug = new Map<string, string>();

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
        logoUrl: s.logoSlug ? `/logos/state/${s.logoSlug}` : null,
        mapX: s.mapX,
        mapY: s.mapY,
      },
    });
    stateIdBySlug.set(slug, state.id);
  }

  for (const m of memberAssociations) {
    if (m.isDemo) continue; // placeholder cards render from lib/ only, never seeded
    const stateId = stateIdBySlug.get(m.stateSlug);
    if (!stateId) {
      console.warn(`Skipping member association ${m.slug} — no state with slug "${m.stateSlug}"`);
      continue;
    }
    await prisma.memberAssociation.create({
      data: {
        slug: m.slug,
        name: m.name,
        city: m.city,
        type: m.type,
        memberCount: m.memberCount,
        description: m.description,
        website: m.website,
        presidentName: m.presidentName,
        contactEmail: m.contactEmail,
        contactPhone: m.contactPhone,
        logoUrl: m.logoUrl,
        stateId,
      },
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
