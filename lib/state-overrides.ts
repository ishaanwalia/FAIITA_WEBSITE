/**
 * Display-level overrides for state association rows, keyed by slug — the
 * same stopgap pattern as `statFixes` / `normalizeZone`. The production DB
 * reseed is pending (permission-gated), so verified corrections shipped in
 * prisma/seed.ts are mirrored here to show immediately. Idempotent: once the
 * reseed runs these become no-ops and the entries can be deleted.
 */
type StateOverride = {
  associationName?: string;
  foundedYear?: number | null;
  memberCount?: number;
  presidentName?: string | null;
  contactEmail?: string | null;
  secretaryEmail?: string | null;
  contactPhone?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  address?: string | null;
};

const overrides: Record<string, StateOverride> = {
  // CMDA Mumbai — verified details supplied July 2026 (matches seed.ts).
  maharashtra: {
    foundedYear: 1981,
    memberCount: 225,
    presidentName: "Samir Parekh",
    contactEmail: "Brain2@ymail.com",
    secretaryEmail: "devang@3findia.com",
    contactPhone: null,
    websiteUrl: "https://www.cmdamumbai.in",
    description: [
      "CMDA Mumbai is a premier IT channel association in Maharashtra, recently revitalised into a highly active hub of collaboration. Under the visionary guidance of industry leaders, it unites IT business owners, resellers, system integrators, cybersecurity experts and hardware manufacturers across Mumbai. The association serves as a powerful collective voice — driving networking, financial literacy and regulatory advocacy to empower Mumbai's technology trade community.",
      "Founded in 1981 and registered under the Ministry of Corporate Affairs as Computer Media Dealers' Association, CMDA Mumbai today brings together nearly 225 senior, reputable business owners — under recent leadership the association grew its active base from a dwindling 25 members to its current strength.",
    ].join("\n\n"),
  },
  // JCDA Jammu — verified details supplied July 2026 (matches seed.ts).
  "jammu-kashmir": {
    associationName: "Jammu Computer Dealer Association (Regd.)",
    foundedYear: 2005,
    memberCount: 120,
    presidentName: "Mahajan Atul",
    contactEmail: "mahajanatul136@gmail.com",
    secretaryEmail: "drgopalpsharma@gmail.com",
    contactPhone: "9419188409",
    websiteUrl: "http://jcdajammu.com/",
    description: "Jammu Computer Dealer Association (Regd.) popularly known as JCDA is the representative body of IT Dealers in Jammu province covering ten districts of Jammu & Kashmir. JCDA has always stood for ethical business and has fought for the cause of IT fraternity. Apart from representing its members, the association is actively involved in social activities. As member of FAIITA, JCDA has represented Jammu and Kashmir at national level as and when required.",
  },
  // UITTA Uttarakhand — verified details supplied July 2026 (matches seed.ts).
  uttarakhand: {
    associationName: "Uttaranchal IT Traders Association (UITTA)",
    foundedYear: 2001,
    memberCount: 120,
    presidentName: null,
    contactEmail: "president@uitta.org",
    secretaryEmail: null,
    contactPhone: null,
    websiteUrl: null,
    description: "UITTA is a group of individuals who come together with a shared vision and common purpose established in year 2001. We as UITTA promotes unity, cooperation and support to their members and also collective efforts for the betterment of our members.",
  },
  // ASIRT Maharashtra — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-asirt": {
    associationName: "Association Of System Integrators & Retailers in Technology (ASIRT), Mumbai",
    foundedYear: 2012,
    memberCount: 270,
    presidentName: null,
    contactEmail: "president@asirt.in",
    secretaryEmail: "secretary@asirt.in",
    contactPhone: null,
    websiteUrl: "https://www.asirt.in",
    description: "ASIRT (Association of System Integrators and Retailers in Technology) is one of India's most dynamic IT channel associations, dedicated to empowering System Integrators, Solution Providers, Retailers, Cloud Partners, and IT Services companies. Founded in Mumbai and serving the IT community since 2012, ASIRT provides a powerful platform for collaboration, networking, business growth, and knowledge sharing.\n\nWith a vibrant community of over 270 members, ASIRT brings together technology entrepreneurs and business leaders to create meaningful partnerships and new business opportunities. Through regular technology seminars, business conclaves, training programs, consortium initiatives, and industry interactions, ASIRT helps members evolve, expand, and stay ahead in a rapidly changing technology landscape.\n\nASIRT also acts as a strong voice for the IT channel community, facilitating engagement with OEMs and vendors, addressing member grievances, and fostering a healthy and profitable business ecosystem. Beyond business, ASIRT nurtures a spirit of camaraderie through events such as the ASIRT Synergy Biz Conclave, ACPL cricket tournament, social gatherings, and family-oriented activities.\n\nDriven by its philosophy of Partner, Progress, and Evolve, ASIRT continues to build a unified, future-ready IT partner ecosystem where members learn, grow, and win together.",
  },
  // TAIT Maharashtra — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-tait": {
    associationName: "Trade Association Of Information Technology (TAIT)",
    foundedYear: 1996,
    memberCount: 450,
    presidentName: null,
    contactEmail: "president@tait.in",
    secretaryEmail: "swetal@megamaninfo.com",
    contactPhone: null,
    websiteUrl: "https://www.tait.in",
    description: "Trade Association of Information Technology (TAIT) was formed in March 1996 to represent the interest of IT community in the ecosystem of Distributors / Sub-distributors / Resellers, System Integrators & Service Providers.\n\nTAIT has over 450+ members representing the complete spectrum of IT organizations. The association was formed to uphold the larger interest of the IT trade, which represents 70% of Mumbai's IT industry. It's a forum where the challenges of Mumbai's domestic IT Industry business is heard and understood. TAIT is a pro-active, leading IT association of India.\n\nTAIT enjoys cordial relations with all OEMs. TAIT's role has also been lauded by various IT / non IT media on several occasions and partnered with them from time to time. TAIT is also fortunate to have very resourceful members who bring in expertise to share their perspective with fellow members. TAIT has very cordial working relationship with other representative associations like MAIT, NASSCOM, IMC and work closely with them on issues related to IT industry.\n\nTAIT over the past years have interacted with state Government Departments, Central Government Departments to brief and resolution of IT channel community business challenges. It continues to do so in future.\n\nTAIT has its own office in Mumbai managed by professional team. It has team of consultants on board on various taxation and policy matters.\n\nTAIT organizes regular meetings on member's issues like non-payments / warranty / service, SI meet, Technology sessions, Product Promotion meets, and Media Meets. It sponsors ICT events / meets organized by the government, IT media, and industry players at regional & national level. TAIT Knowledge Series Events focus on Seminars / workshops on technology awareness and professional / personal skills development of the member community.",
  },
  // GIBA Goa — verified details supplied July 2026 (matches seed.ts).
  goa: {
    foundedYear: 1996,
    memberCount: 105,
    presidentName: null,
    contactEmail: "gibaofficegoa@gmail.com",
    secretaryEmail: null,
    contactPhone: null,
    websiteUrl: "https://gibagoa.co.in",
    description: "Goa IT Business Association (GIBA) was formed in the year 1996. GIBA has around 105 members at present and its primary objective is to offer guidance, support and most importantly an opportunity to grow their businesses.\n\nEvery year GIBA organises events such as Tech Days, Blood Donation Camps, GIBA Family Get-together and sports activities such as the GIBA Cricket event, technical training for GIBA members and their employees, medical check-up camps and more.\n\nGIBA's objective is to unite all the IT dealers of Goa and extend whatever help is needed to ensure they develop and grow their respective business in this highly competitive environment.\n\nGIBA has members from the fields of IT hardware, software, Internet Service Providers, CCTV and more.",
  },
  // JCTA Jharkhand — verified details supplied July 2026 (matches seed.ts).
  jharkhand: {
    logoUrl: "/logos/state/jcta.jpeg",
    foundedYear: 2007,
    memberCount: 145,
    presidentName: null,
    contactEmail: "president@jcta.org.in",
    secretaryEmail: "secretary@jcta.org.in",
    contactPhone: null,
    websiteUrl: "https://www.jcta.org.in",
    description: [
      "The Jharkhand Computer Traders Association (JCTA) is the premier association representing the IT trade, dealers, distributors, and system integrators across Jharkhand. Dedicated to uniting the IT fraternity and fostering a collaborative ecosystem, JCTA plays a pivotal role in protecting local traders' interests, resolving business challenges, and bridging them with national bodies. Promoting ethical trade practices, our mission is to drive digital empowerment, technological growth, and support a robust, progressive IT trade ecosystem in the region.",
      "Our Strength:\n• Unity & Emotional Bonding\n• Collective Celebrations\n• Problem Solving & Support\n• Knowledge Sharing\n• Business Growth & Protection",
      "Together We Create Impact\n• Microsoft issues resolved across India with FAIITA support.\n• Avita issue resolved across India, ensuring partners received their money.",
      "Our Mission:\nTo promote the growth of the IT industry in Jharkhand by uniting computer traders, solving industry issues, sharing knowledge, celebrating togetherness, and protecting members' rights and benefits.",
    ].join("\n\n"),
  },
  // VCMDWA Nagpur — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-vcmdwa": {
    logoUrl: "/logos/state/vcmdwa.png",
    associationName: "Vidarbha Computer & Media Dealers Welfare Association (VCMDWA)",
    foundedYear: 1991,
    memberCount: 125,
    presidentName: "Dinesh Naidu",
    contactEmail: "dinesh@dineshnaidu.com",
    secretaryEmail: "lg40@hotmail.com",
    contactPhone: null,
    websiteUrl: "https://www.vcmdwa.org",
    description: "The Vidarbha Computer & Media Dealers Welfare Association (VCMDWA), established in 1991, is a registered charitable trust under the Societies Registration Act, 1860. It is one of Central India's most active and respected industry associations representing the interests of computer hardware, software, digital media, surveillance, and IT service providers.\n\nWith a robust network of over 125+ active members, VCMDWA functions as a non-profit, non-political body, promoting ethical business practices, industry collaboration, customer trust, and community welfare in the IT and electronics sector.",
  },
  // UPCDWA Uttar Pradesh — verified details supplied July 2026 (matches seed.ts).
  "uttar-pradesh": {
    logoUrl: "/logos/state/upcdwa.jpeg",
    foundedYear: 2014,
    memberCount: 550,
    presidentName: null,
    contactEmail: "president@upcdwa.com",
    secretaryEmail: "secretary@upcdwa.com",
    contactPhone: null,
    websiteUrl: "https://www.upcdwa.com",
    description: "The Uttar Pradesh Computer Dealers Welfare Association (UPCDWA) is the premier industry body representing IT hardware and software dealers, retailers, and distributors across the state of Uttar Pradesh. Operating under the national umbrella of the Federation of All India IT Associations (FAIITA) since 2014, the association unites over 550 members to give local IT businesses a collective voice.",
  },
  // BITOAA Bhopal — verified details supplied July 2026 (matches seed.ts).
  "madhya-pradesh": {
    foundedYear: 2007,
    memberCount: 260,
    contactEmail: "president@bitoaa.com",
    secretaryEmail: "secretary.bitoaa@gmail.com",
    websiteUrl: "https://bitoaa.com",
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
  // NMITA Navi Mumbai — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-nmit": {
    associationName: "Navi Mumbai IT Association (NMITA)",
    foundedYear: 2025,
    memberCount: 100,
    contactEmail: "tssvision1@gmail.com",
    secretaryEmail: "deepak.manodara@gmail.com",
    logoUrl: "/logos/state/nmit.png",
    description: [
      "The Navi Mumbai IT Association (NMITA) is a prominent regional tech coalition established in 2025 to support the rapidly growing digital ecosystem in Navi Mumbai. Spurred by major infrastructure developments like the Navi Mumbai International Airport, NMITA serves as the unified voice for the city's expanding information technology sector.",
      "Formed just a year ago, the association has already brought together a powerful network of 100+ members, ranging from early-stage tech startups to established software houses, system integrators, and IT consultants.",
      "The primary objective is to cultivate Navi Mumbai into a premier destination for tech entrepreneurship, bridging the gap between local companies, industry mentors, and institutional giants like the WTC Navi Mumbai.",
      "NMITA actively hosts knowledge-sharing sessions, fosters internal B2B referral networks, and interfaces with local municipal bodies to ensure robust IT infrastructure, stable power, and favorable tech policies.",
    ].join("\n\n"),
  },
  // BITA Bihar — verified details supplied July 2026 (matches seed.ts).
  bihar: {
    foundedYear: 1995,
    memberCount: 350,
    contactEmail: "shailesh@anagencies.in",
    secretaryEmail: "bitabiharitassociation@gmail.com",
    logoUrl: "/logos/state/bita.jpg",
    description:
      "The Bihar IT Association (BITA) is the premier association representing IT trade professionals, dealers, distributors, retailers, and system integrators across Bihar. Dedicated to uniting the regional IT fraternity and fostering a collaborative, growth-oriented ecosystem, BITA plays a pivotal role in protecting local traders' interests, resolving key industry and business challenges, and connecting members with national IT bodies. By promoting ethical trade practices, BITA's mission is to drive digital empowerment, technological expansion, and build a robust, progressive IT trade landscape throughout Bihar.",
  },
  // AKITDA Kerala — verified details supplied July 2026 (matches seed.ts).
  kerala: {
    foundedYear: 2004,
    memberCount: 1500,
    secretaryEmail: "stategs@akitda.co.in",
    websiteUrl: "https://www.akitda.co.in",
    address: "ER-366/2004, Ist Floor, Krishnakripa, KSN Menon Road, Near South Over Bridge, Ernakulam, Kerala – 682016",
    description: [
      "AKITDA was formed in April 2004 for the welfare and protection of the rights of people associated with the production, sales and service of computers, computer-associated products and spare parts. Thousands of IT dealers are part of this association, which develops organizational skills, plans welfare schemes and helps in members' professional development. Exhibitions and seminars that help in the expansion of business are also conducted for the welfare of members. The association helps IT dealers overcome all sorts of troubles they experience and helps them get their claimed benefits — Snehasparsham is the programme introduced for implementing this.",
      "The main objectives of the association are:\n• To develop organizational awareness and financial support by mutual cooperation among computer dealers.\n• To provide scientific and technical knowledge which results in the uplifting of dealers and merchants.\n• To develop projects for the financial security of dealers.\n• To develop an atmosphere for co-existence and for the consolidation of IT dealers all over India.\n• To protect the best interests of the IT business community, of the public and of the country.\n• To develop the qualities of honesty, compassion, patriotism and willingness to sacrifice among the members.",
      "Registered Office: ER-366/2004, Ist Floor, Krishnakripa, KSN Menon Road, Near South Over Bridge, Ernakulam, Kerala – 682016.",
      "Websites: www.akitda.co.in · www.akitda.org · www.akitda.in",
    ].join("\n\n"),
  },
  // COMPASS West Bengal — verified details supplied July 2026 (matches seed.ts).
  "west-bengal": {
    associationName: "Computer Association of Eastern India (COMPASS)",
    foundedYear: 1994,
    memberCount: 457,
    presidentName: null,
    contactEmail: "crown@crown.org.in",
    secretaryEmail: "info@vikasinfo.in",
    contactPhone: null,
    websiteUrl: "https://www.compassindia.com/",
    logoUrl: "/logos/state/compass.png",
    description: [
      "COMPASS – Powering the IT Ecosystem of Eastern India",
      "In the early 1990s, a group of twelve visionary IT dealers gathered at 25 Ganesh Chandra Avenue, Kolkata, with a shared conviction — that the IT industry in Eastern India needed a unified voice. That conversation sparked a movement. By 1994, nineteen IT entrepreneurs assembled at the Lynton Hotel and gave shape to what would become one of the most influential IT bodies in the region. On 9th June 1994, the Computer Association of Eastern India — COMPASS — was formally registered under the Companies Act.",
      "Over three decades later, COMPASS stands tall as the nodal agency for IT trade and industry development in Eastern India, with a membership base of over 457 IT entrepreneurs spread across the region, all anchored by its headquarters in Kolkata.",
      "COMPASS was built on four founding pillars: to exchange ideas for a better tomorrow, to protect the rights and interests of its members, to collectively engage with statutory authorities, and to spread IT awareness across Eastern India. These values continue to drive the association today.",
      "As a non-profit and proactive industry body, COMPASS works closely with government on policy matters, advises on industry issues, and consistently acts as a facilitator and catalyst for growth. Through advisory, consultative, and networking services, it has helped create an ecosystem where IT businesses can thrive — enhancing efficiency, competitiveness, and expanding market opportunities for its members.",
      "From a small gathering three decades ago to becoming the most important IT forum in Eastern India, COMPASS continues its mission — building a stronger, smarter, and more connected digital future for the region.",
    ].join("\n\n"),
  },
  // ADCTA Delhi — verified details supplied July 2026 (matches seed.ts).
  delhi: {
    associationName: "All Delhi Computer Traders Association (Regd.) — ADCTA",
    foundedYear: 1990,
    memberCount: 2500,
    contactEmail: "adcta.nehruplace@gmail.com",
    secretaryEmail: "broadwaydelhi@gmail.com",
    websiteUrl: "https://www.adcta.com",
    logoUrl: "/logos/state/adcta.jpg",
    address: "Nehru Place, New Delhi",
    description: [
      "All Delhi Computer Traders Association (Regd.) (ADCTA) is one of India's oldest and most respected associations representing the IT trade and computer business community. Established in 1990 with the vision of uniting computer dealers, distributors, retailers, importers, manufacturers and service providers, ADCTA has been dedicated to protecting the interests of the IT industry while promoting ethical business practices and sustainable growth.",
      "With its registered office in Nehru Place, New Delhi — one of India's largest IT hardware markets — ADCTA has played a significant role in strengthening the computer and information technology trade across Delhi and the NCR. The association has grown into a strong and influential platform representing a large network of around 2,500 IT businesses and professionals.",
      "For over three decades, ADCTA has worked closely with government departments, industry leaders, technology brands and business stakeholders to address trade-related issues, advocate for fair business policies and create a transparent and progressive business environment. The association actively supports its members through awareness programs, legal guidance, networking opportunities, business events, seminars and industry collaborations.",
      "Our Mission: to protect and promote the interests of the IT trade community; to encourage ethical, transparent and responsible business practices; to represent members before government authorities and regulatory bodies; to foster collaboration, innovation and knowledge sharing within the technology ecosystem; and to strengthen the growth of the IT industry through education, networking and advocacy.",
      "Our Vision: to be the leading voice of the computer and information technology trade, creating a trusted, innovative and sustainable business ecosystem that empowers every member to grow and succeed.",
      "What We Do: represent the interests of IT traders and businesses; provide guidance on business regulations, taxation and compliance; resolve trade-related concerns and disputes through collective representation; and build strong partnerships between members, technology brands, distributors and policymakers.",
      "Today, ADCTA continues to serve as a trusted platform for the IT business community, working towards the collective growth of the industry while upholding the values of integrity, cooperation, professionalism and innovation. With its strong legacy and commitment to excellence, ADCTA remains dedicated to empowering businesses and shaping the future of India's IT trade.",
    ].join("\n\n"),
  },
  // PACT Punjab — verified details supplied July 2026 (matches seed.ts).
  punjab: {
    logoUrl: "/logos/state/pact.webp",
    associationName: "Punjab Association of Computer Traders (PACT)",
    foundedYear: 2012,
    memberCount: 800,
    presidentName: null,
    contactEmail: "president@pactpunjab.com",
    secretaryEmail: "secretary@pactpunjab.com",
    contactPhone: null,
    websiteUrl: "https://www.pactpunjab.com",
    description: "Punjab Association of Computer Traders - PACT is the apex body representing the IT trade across Punjab and Chandigarh. It unites computer dealers, distributors, system integrators, networking and surveillance solution providers and technology businesses on a common platform. PACT is committed to safeguarding the interests of the IT industry, promoting ethical business practices, fostering collaboration and representing the trade before government authorities and industry stakeholders. Through advocacy, networking and knowledge-sharing initiatives, PACT is working towards building a stronger, more progressive and future-ready IT ecosystem for Punjab. United for the Growth of Punjab's IT Industry.",
  },
  // MCDA Jabalpur — verified details supplied July 2026 (matches seed.ts).
  "madhya-pradesh-mcda": {
    foundedYear: 2003,
    memberCount: 150,
    contactEmail: "akhilesh_cin@yahoo.com",
    secretaryEmail: "mpcomputerse@rediffmail.com",
    websiteUrl: "https://www.mcda.in",
    logoUrl: "/logos/state/mcda.png",
    description: [
      "We at Mahakaushal Computer Dealer's Association (MCDA), situated at Jabalpur (Madhya Pradesh) are one of the oldest IT associations in Madhya Pradesh. Established in 2003, with a nominal strength of 13 members, we have grown to 150 members till now. These numbers are increasing year on year. We operate under a registered society.",
      "Our mission is to make a healthy business environment for the IT Sector in the Mahakaushal Region of Madhya Pradesh. We have members from almost all the southern part of our state. We are also collaborated with small regional associations operating at District level in our territory.",
      "We are also involved in Social Activities like Plantation (Go Green Earth), Orphanage Visits, IT Seminars, Health Check-up Camps, Medical Emergency Equipment Help, Insurance Schemes for Office Workers, Offline Business Promotion via Coupon Schemes, etc.",
    ].join("\n\n"),
  },
  // RCTA Rajasthan — verified details supplied July 2026 (matches seed.ts).
  rajasthan: {
    foundedYear: 2001,
    memberCount: 360,
    contactEmail: "rctajaipur2025@gmail.com",
    secretaryEmail: "frontlinejaipur@gmail.com",
    websiteUrl: "https://www.rctaonline.in",
    logoUrl: "/logos/state/rcta.jpg",
    description: [
      "The Rajasthan Computer Traders Association (RCTA) is a leading non-profit organization representing the IT trade community of Rajasthan. Established with the objective of uniting computer dealers, distributors, system integrators, and service providers across the state, RCTA serves as a strong platform for collaboration, growth, and industry advancement.",
      "With a growing membership across multiple districts, RCTA acts as a bridge between vendors, dealers, and customers, ensuring fair trade practices and supporting business development through training programs, exhibitions, and networking opportunities.",
      "Beyond business, RCTA is also actively involved in social and community welfare activities, reflecting our commitment to contribute positively to society.",
    ].join("\n\n"),
  },
  // NECTA North East — verified details supplied July 2026 (matches seed.ts).
  "north-east": {
    foundedYear: 2001,
    memberCount: 210,
    contactEmail: "president@necta.co.in",
    secretaryEmail: "secretary@necta.co.in",
    websiteUrl: "https://www.necta.co.in",
    description: [
      "NECTA : A Catalyst for IT Transformation in the Northeast",
      "Established in 2001, the North East Computer Traders' Association (NECTA) serves as a premier organisation for IT dealers across the Northeast region of India. Comprising a distinguished assembly of professionals, NECTA fosters synergy within the diverse layers of the IT channel, ensuring collaborative growth and stability for all stakeholders.",
      "Beyond mere commercial interests, NECTA operates as a charitable, non-political, and non-profit entity. Its unwavering commitment lies in facilitating the widespread adoption and development of information technology throughout Northeast India. By actively bridging the gap between the IT trading community and the government, NECTA provides valuable insights and recommendations, paving the way for policies that effectively address the region's unique technological needs.",
      "NECTA's dedication extends beyond mere market expansion. Recognising the transformative potential of technology, the association strives to bring the latest advancements to every doorstep, empowering individuals and communities across the Northeast. By diligently advocating for improved access and infrastructure, NECTA envisions a future where technology serves as a catalyst for progress and improved living standards for all.",
    ].join("\n\n"),
  },
  // CDAN Nellore, Andhra Pradesh — verified details supplied July 2026 (matches seed.ts).
  "andhra-pradesh": {
    associationName: "Computer Dealers Association of Nellore District (CDAN)",
    foundedYear: 2011,
    memberCount: 55,
    contactEmail: "president@cdan.com",
    secretaryEmail: "secretary@cdan.com",
    description: [
      "The Computer Dealers Association of Nellore District (CDAN) is a professional, non-profit association that represents the interests of IT dealers, computer retailers, distributors, system integrators, service providers, and technology businesses across Nellore District, Andhra Pradesh. CDAN serves as a common platform for members to collaborate, address industry challenges, promote ethical business practices, and strengthen the local IT ecosystem.",
      "Vision\nTo build a strong, united, and progressive IT business community that promotes sustainable growth, innovation, and customer trust.",
      "Mission\n• Unite IT dealers and technology businesses in Nellore District.\n• Protect and promote the interests of authorized offline retailers.\n• Enhance business opportunities through networking and collaboration.\n• Encourage ethical trade practices and professional standards.\n• Support skill development, knowledge sharing, and technology awareness.\n• Act as a bridge between members, technology brands, distributors, and government authorities.",
      "Key Objectives\n• Represent members on industry-related issues.\n• Organize business meetings, seminars, exhibitions, and networking events.\n• Promote genuine products and authorized sales channels.\n• Support members with market intelligence and policy updates.\n• Encourage digital transformation and business modernization.\n• Foster strong relationships with national and state IT associations.",
    ].join("\n\n"),
  },
  // CAN Nashik, Maharashtra — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-can": {
    associationName: "Computer Association Nashik (CAN)",
    foundedYear: 1998,
    memberCount: 180,
    websiteUrl: "https://www.canit.co.in",
    description:
      "Computer Association Nashik (CAN) is a professional organization formed to support and promote the IT industry in Nashik. It brings together developers, entrepreneurs, and IT companies on a common platform.\n\nWe aim to encourage collaboration, knowledge sharing, and business growth within the technology sector. CAN plays a vital role in building a strong IT ecosystem in the region.\n\nOur association continuously works towards empowering professionals through events, training, and networking opportunities.",
  },
  // UCTA Udaipur, Rajasthan — verified details supplied July 2026 (matches seed.ts).
  "rajasthan-ucta": {
    associationName: "Udaipur Computer Traders Association (Regd.) (UCTA)",
    foundedYear: 2006,
    memberCount: 180,
    contactEmail: "President@ucta.org.in",
    secretaryEmail: "info@ucta.org.in",
    websiteUrl: "https://www.ucta.org.in",
    description:
      "Udaipur Computer Traders Association (Regd.), popularly known as UCTA, was founded in the year 2006. UCTA is a Computer Trade Association whose members are committed to setting and maintaining the highest technical and ethical standards in the independent provision of specialist computer-related services. By independent we mean \"free to trade within the law without being obliged to acknowledge the authority, control or influence of any third party\".",
  },
  // CMDA Pune — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-cmda-pune": {
    associationName: "Computers & Media Dealers Association, Pune (CMDA)",
    foundedYear: 1992,
    memberCount: 377,
    websiteUrl: "https://cmdapune.org/",
    description: [
      "The Computers & Media Dealers Association, Pune (CMDA) is a prominent organization representing over 377 IT entrepreneurs in Pune. Its members include computer dealers, distributors, system integrators, and service providers, collectively accounting for nearly 90% of the computer hardware and consumables business in Pune.",
      "Key Objectives & Activities\nCMDA serves as a vital platform for its members, focusing on:",
      "Addressing Common Issues: Facilitating resolution of shared problems, disputes, and government representations.",
      "Arbitration of IT Dealers: IT dealers disputes related to payments, delivery issues, warranty claims, and service delays are brought before the CMDA Committee. The committee hears both parties, examines documents, and facilitates an amicable solution. This process helps avoid legal proceedings, saves time and cost, and maintains healthy business relationships within the IT community.",
      "Information Exchange: Sharing technical and commercial information among members.",
      "Promoting IT Awareness: Organizing IT trade exhibitions and technical seminars on new technologies and developments.",
      "Ethical Business Practices: Actively working to support and promote ethical business and trade practices within the IT industry.",
    ].join("\n\n"),
  },
  // CMDA Delhi — verified details supplied July 2026 (matches seed.ts).
  "delhi-cmda": {
    associationName: "Computer Media Dealers Association, Delhi (CMDA-Delhi)",
    foundedYear: 2002,
    memberCount: 150,
    description:
      "The Computer Media Dealers Association, Delhi (CMDA-Delhi) is a premier information and communications technology (ICT) trade association representing IT channel partners, retailers, manufacturers, and distributors across Delhi. Founded and registered in 2002, the association acts as a unified voice to promote ethical business practices, protect dealer interests, and drive growth in the regional IT hardware and consumables sector.",
  },
  // CONFED-ITA Tamil Nadu — verified details supplied July 2026 (matches seed.ts).
  "tamil-nadu": {
    associationName: "Confederation of Information Technology Associations (CONFED-ITA)",
    foundedYear: 2007,
    memberCount: 1900,
    contactEmail: "president@confedita.co.in",
    secretaryEmail: "secretary@confedita.co.in",
    websiteUrl: "https://www.confedita.co.in",
    logoUrl: "/logos/state/confed.jpeg",
    description: [
      "CONFED-ITA – Confederation of Information Technology Associations is the apex body representing the IT dealer and channel community across Tamil Nadu and Puducherry. It brings together 28 district-level IT associations and a network of 1,900+ IT dealers, creating a unified platform for collaboration, industry representation, knowledge sharing, business development, and collective growth.",
      "Founded with the vision of uniting IT associations under one strong umbrella, CONFED-ITA has grown into an influential platform connecting IT dealers, distributors, vendors, technology brands, industry leaders, and policymakers. The organisation promotes stronger relationships within the IT ecosystem while addressing the common challenges and business interests of its member associations.",
      "Through initiatives such as technology summits, district events, industry interactions, vendor engagement, knowledge-sharing sessions, sports activities, digital platforms, and networking programmes, CONFED-ITA creates opportunities for its members to connect, collaborate, innovate, and grow together.",
      "CONFED-ITA stands committed to strengthening the IT channel community, encouraging innovation, creating new business opportunities, and building a more connected and sustainable technology ecosystem across Tamil Nadu and Puducherry.",
      "Our Vision: To empower the IT channel community through unity, innovation, collaboration, and collective progress.",
      "Our Motto: INNOVATE | COLLABORATE | ELEVATE",
    ].join("\n\n"),
  },
};

export function applyStateOverrides<T extends { slug: string }>(state: T): T {
  const fix = overrides[state.slug];
  return fix ? { ...state, ...fix } : state;
}

/**
 * Associations removed from FAIITA's data in July 2026 — CCMDA (Chhattisgarh),
 * FITDAK (Karnataka) and CIMEIT (Delhi). prisma/seed.ts no longer carries
 * them, but the production rows survive until the next reseed, so every
 * state query filters them out here. Idempotent: once the reseed runs this
 * matches nothing and the set can be emptied.
 */
const removedStateSlugs = new Set(["chhattisgarh", "karnataka", "delhi-cimeit"]);

export function isRemovedStateSlug(slug: string): boolean {
  return removedStateSlugs.has(slug);
}

export function excludeRemovedStates<T extends { slug: string }>(states: T[]): T[] {
  return states.filter((s) => !removedStateSlugs.has(s.slug));
}
