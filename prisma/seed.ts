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
  foundedYear: number;
  memberCount: number;
  city: string;
  mapX: number;
  mapY: number;
};

// x/y are relative (0-100) positions on the illustrated India map viewBox.
const states: StateSeed[] = [
  { stateName: "Jammu & Kashmir", stateCode: "JK", region: "North", associationName: "J&K IT Traders Association", foundedYear: 2015, memberCount: 220, city: "Srinagar", mapX: 36, mapY: 8 },
  { stateName: "Himachal Pradesh", stateCode: "HP", region: "North", associationName: "Himachal IT Dealers Association", foundedYear: 2016, memberCount: 180, city: "Shimla", mapX: 39, mapY: 17 },
  { stateName: "Punjab", stateCode: "PB", region: "North", associationName: "Punjab Computer Dealers Association", foundedYear: 2014, memberCount: 1450, city: "Ludhiana", mapX: 32, mapY: 19 },
  { stateName: "Uttarakhand", stateCode: "UT", region: "North", associationName: "Uttarakhand IT Association", foundedYear: 2017, memberCount: 340, city: "Dehradun", mapX: 43, mapY: 20 },
  { stateName: "Haryana", stateCode: "HR", region: "North", associationName: "Haryana IT Dealers Federation", foundedYear: 2015, memberCount: 980, city: "Gurugram", mapX: 35, mapY: 23 },
  { stateName: "Delhi", stateCode: "DL", region: "North", associationName: "Delhi IT Traders Association", foundedYear: 2014, memberCount: 5200, city: "New Delhi", mapX: 37, mapY: 25 },
  { stateName: "Rajasthan", stateCode: "RJ", region: "North", associationName: "Rajasthan IT Dealers Association", foundedYear: 2014, memberCount: 2100, city: "Jaipur", mapX: 26, mapY: 31 },
  { stateName: "Uttar Pradesh", stateCode: "UP", region: "North", associationName: "UP IT Traders Welfare Association", foundedYear: 2014, memberCount: 4300, city: "Lucknow", mapX: 46, mapY: 30 },
  { stateName: "Bihar", stateCode: "BR", region: "East", associationName: "Bihar IT Association", foundedYear: 2015, memberCount: 1600, city: "Patna", mapX: 55, mapY: 33 },
  { stateName: "Sikkim", stateCode: "SK", region: "North-East", associationName: "Sikkim IT Dealers Forum", foundedYear: 2018, memberCount: 60, city: "Gangtok", mapX: 61, mapY: 27 },
  { stateName: "West Bengal", stateCode: "WB", region: "East", associationName: "West Bengal IT Traders Association", foundedYear: 2014, memberCount: 3100, city: "Kolkata", mapX: 62, mapY: 38 },
  { stateName: "Assam", stateCode: "AS", region: "North-East", associationName: "Assam IT Dealers Association", foundedYear: 2016, memberCount: 410, city: "Guwahati", mapX: 70, mapY: 29 },
  { stateName: "Arunachal Pradesh", stateCode: "AR", region: "North-East", associationName: "Arunachal IT Traders Forum", foundedYear: 2019, memberCount: 45, city: "Itanagar", mapX: 76, mapY: 20 },
  { stateName: "Nagaland", stateCode: "NL", region: "North-East", associationName: "Nagaland IT Dealers Association", foundedYear: 2019, memberCount: 40, city: "Kohima", mapX: 79, mapY: 28 },
  { stateName: "Manipur", stateCode: "MN", region: "North-East", associationName: "Manipur IT Traders Association", foundedYear: 2019, memberCount: 38, city: "Imphal", mapX: 77, mapY: 32 },
  { stateName: "Mizoram", stateCode: "MZ", region: "North-East", associationName: "Mizoram IT Dealers Forum", foundedYear: 2020, memberCount: 30, city: "Aizawl", mapX: 74, mapY: 36 },
  { stateName: "Tripura", stateCode: "TR", region: "North-East", associationName: "Tripura IT Traders Association", foundedYear: 2019, memberCount: 42, city: "Agartala", mapX: 68, mapY: 35 },
  { stateName: "Meghalaya", stateCode: "ML", region: "North-East", associationName: "Meghalaya IT Dealers Forum", foundedYear: 2020, memberCount: 35, city: "Shillong", mapX: 71, mapY: 31 },
  { stateName: "Jharkhand", stateCode: "JH", region: "East", associationName: "Jharkhand IT Traders Association", foundedYear: 2016, memberCount: 780, city: "Ranchi", mapX: 54, mapY: 38 },
  { stateName: "Odisha", stateCode: "OR", region: "East", associationName: "Odisha IT Dealers Association", foundedYear: 2016, memberCount: 890, city: "Bhubaneswar", mapX: 55, mapY: 47 },
  { stateName: "Chhattisgarh", stateCode: "CT", region: "Central", associationName: "Chhattisgarh IT Traders Federation", foundedYear: 2017, memberCount: 520, city: "Raipur", mapX: 46, mapY: 44 },
  { stateName: "Madhya Pradesh", stateCode: "MP", region: "Central", associationName: "MP IT Dealers Association", foundedYear: 2015, memberCount: 1980, city: "Indore", mapX: 38, mapY: 41 },
  { stateName: "Gujarat", stateCode: "GJ", region: "West", associationName: "Gujarat Electronics & IT Association", foundedYear: 2014, memberCount: 3400, city: "Ahmedabad", mapX: 20, mapY: 43 },
  { stateName: "Maharashtra", stateCode: "MH", region: "West", associationName: "Maharashtra IT Dealers Association", foundedYear: 2014, memberCount: 6100, city: "Mumbai", mapX: 30, mapY: 54 },
  { stateName: "Telangana", stateCode: "TG", region: "South", associationName: "Telangana IT Traders Association", foundedYear: 2015, memberCount: 1750, city: "Hyderabad", mapX: 43, mapY: 58 },
  { stateName: "Andhra Pradesh", stateCode: "AP", region: "South", associationName: "AP Computer Dealers Association", foundedYear: 2015, memberCount: 1620, city: "Vijayawada", mapX: 46, mapY: 64 },
  { stateName: "Karnataka", stateCode: "KA", region: "South", associationName: "Karnataka IT Dealers Association", foundedYear: 2014, memberCount: 4200, city: "Bengaluru", mapX: 33, mapY: 68 },
  { stateName: "Goa", stateCode: "GA", region: "West", associationName: "Goa IT Traders Forum", foundedYear: 2018, memberCount: 110, city: "Panaji", mapX: 26, mapY: 62 },
  { stateName: "Kerala", stateCode: "KL", region: "South", associationName: "Kerala IT Dealers Association", foundedYear: 2014, memberCount: 2600, city: "Kochi", mapX: 31, mapY: 84 },
  { stateName: "Tamil Nadu", stateCode: "TN", region: "South", associationName: "Tamil Nadu IT Traders Association", foundedYear: 2014, memberCount: 3800, city: "Chennai", mapX: 39, mapY: 84 },
];

const testimonials = [
  { name: "Navin Gupta", role: "President, FAIITA", association: "Bihar IT Association", quote: "FAIITA has been instrumental in uniting IT dealers across India. Through sustained advocacy, our members have seen real policy change.", order: 1 },
  { name: "Liju P. Raju", role: "Sr. Vice President, FAIITA", association: "Kerala IT Dealers Association", quote: "Being part of FAIITA gives our state association a voice at the national level. The networking opportunities are invaluable.", order: 2 },
  { name: "Rajeev Chitkara", role: "Vice President, FAIITA", association: "Punjab Computer Dealers Association", quote: "FAIITA's training programs and industry insights help our members stay competitive in a fast-changing market.", order: 3 },
  { name: "Amit Kumar", role: "Secretary, FAIITA", association: "Delhi IT Traders Association", quote: "The federation's work on GST simplification and digital-transformation advocacy has directly benefited our 5,000+ members.", order: 4 },
];

const leaders = [
  { name: "Navin Gupta", role: "President", order: 1, associationName: "Bihar IT Association", stateName: "Bihar", category: "national", term: "2024–2026", isCurrent: true, bio: "Leading the federation with a focus on advocacy, policy engagement, and empowering channel partners across every state in India." },
  { name: "Liju P. Raju", role: "Senior Vice President", order: 2, associationName: "Kerala IT Dealers Association", stateName: "Kerala", category: "national", term: "2024–2026", isCurrent: true, bio: "Oversees the Southern and Western zones, strengthening ties between state associations and driving regional membership growth." },
  { name: "Rajeev Chitkara", role: "Vice President", order: 3, associationName: "Punjab Computer Dealers Association", stateName: "Punjab", category: "national", term: "2024–2026", isCurrent: true, bio: "Champions training and skill-development programs that keep channel partners competitive in a fast-changing market." },
  { name: "Amit Kumar", role: "Secretary General", order: 4, associationName: "Delhi IT Traders Association", stateName: "Delhi", category: "national", term: "2024–2026", isCurrent: true, bio: "Manages the federation's day-to-day administration, correspondence, and coordination across all 29 state associations." },
  { name: "Suresh Menon", role: "Treasurer", order: 5, associationName: "Karnataka IT Dealers Association", stateName: "Karnataka", category: "national", term: "2024–2026", isCurrent: true, bio: "Oversees FAIITA's finances, membership dues, and budget planning to keep the federation on solid financial footing." },
  { name: "Priya Sharma", role: "Joint Secretary", order: 6, associationName: "Maharashtra IT Dealers Association", stateName: "Maharashtra", category: "national", term: "2024–2026", isCurrent: true, bio: "Supports the Secretary General's office and coordinates communication between the GB and state-level leadership." },
  { name: "Vikram Reddy", role: "Executive Member", order: 7, associationName: "AP Computer Dealers Association", stateName: "Andhra Pradesh", category: "national", term: "2024–2026", isCurrent: true, bio: "Represents the interests of Southern-zone member associations on the Governing Body's executive council." },
  { name: "Manoj Verma", role: "Executive Member", order: 8, associationName: "UP IT Traders Welfare Association", stateName: "Uttar Pradesh", category: "national", term: "2024–2026", isCurrent: true, bio: "Represents the interests of Northern-zone member associations on the Governing Body's executive council." },
];

// Previous Governing Body — FAIITA's GB serves a 2-year term.
const pastLeaders = [
  { name: "REPLACE ME (Past President)", role: "President", order: 1, associationName: "Maharashtra IT Dealers Association", stateName: "Maharashtra", category: "national", term: "2022–2024", isCurrent: false, bio: "Led the federation's 2022–2024 term, focused on expanding state-level coverage and GST advocacy." },
  { name: "REPLACE ME (Past Sr. VP)", role: "Senior Vice President", order: 2, associationName: "Tamil Nadu IT Traders Association", stateName: "Tamil Nadu", category: "national", term: "2022–2024", isCurrent: false, bio: "Oversaw regional coordination during the 2022–2024 term." },
  { name: "REPLACE ME (Past VP)", role: "Vice President", order: 3, associationName: "West Bengal IT Traders Association", stateName: "West Bengal", category: "national", term: "2022–2024", isCurrent: false, bio: "Supported training and skill-development initiatives during the 2022–2024 term." },
  { name: "REPLACE ME (Past Secretary)", role: "Secretary General", order: 4, associationName: "Karnataka IT Dealers Association", stateName: "Karnataka", category: "national", term: "2022–2024", isCurrent: false, bio: "Managed federation administration during the 2022–2024 term." },
  { name: "REPLACE ME (Past Treasurer)", role: "Treasurer", order: 5, associationName: "Gujarat Electronics & IT Association", stateName: "Gujarat", category: "national", term: "2022–2024", isCurrent: false, bio: "Oversaw federation finances during the 2022–2024 term." },
];

const stats = [
  { label: "States Covered", value: "29", suffix: "", icon: "MapPinned", order: 1 },
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

  for (const s of states) {
    const state = await prisma.stateAssociation.create({
      data: {
        slug: s.stateName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        stateName: s.stateName,
        stateCode: s.stateCode,
        region: s.region,
        associationName: s.associationName,
        foundedYear: s.foundedYear,
        memberCount: s.memberCount,
        presidentName: "REPLACE ME",
        contactEmail: `${s.stateCode.toLowerCase()}@faiita.co.in`,
        contactPhone: "+91 00000 00000",
        address: `${s.city}, ${s.stateName}`,
        description: `${s.associationName} represents IT channel partners, retailers and distributors across ${s.stateName}, working under the FAIITA umbrella since ${s.foundedYear}.`,
        mapX: s.mapX,
        mapY: s.mapY,
      },
    });

    // Give a couple of larger states a sample member association for the UI
    if (["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu"].includes(s.stateName)) {
      await prisma.memberAssociation.create({
        data: {
          slug: `${state.slug}-central-chapter`,
          name: `${s.city} Central IT Traders Chapter`,
          city: s.city,
          type: "Retail",
          memberCount: Math.round(s.memberCount * 0.3),
          description: `The largest chapter within ${s.associationName}, covering ${s.city} and surrounding trade hubs.`,
          stateId: state.id,
        },
      });
    }
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
