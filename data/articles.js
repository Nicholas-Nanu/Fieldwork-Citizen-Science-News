/*
 * ═══════════════════════════════════════════════════════════════
 *   FIELDWORK — YOUR STORIES DATABASE
 * ═══════════════════════════════════════════════════════════════
 *
 *   TO ADD A NEW STORY:
 *   1. Copy the template below
 *   2. Paste it at the TOP of the articles array (after the opening '[')
 *   3. Fill in the details
 *   4. Save the file and push to GitHub — your site updates automatically!
 *
 *   TEMPLATE (copy everything between the --- lines):
 *   ---
 *   {
 *     id: 999,                          ← Change to next number
 *     title: "Your story title here",
 *     source: "Where it was published",
 *     category: "ecology",              ← One of: ecology, space, marine, archaeology, health, biodiversity, climate, tech
 *     hoursAgo: 1,                      ← How many hours ago was this published?
 *     excerpt: "A short summary of the story in 1-2 sentences.",
 *     credibility: {
 *       evidence: 0,                    ← 0=Peer-Reviewed, 1=Preprint, 2=Observational, 3=Anecdotal
 *       source: 0,                      ← 0=Academic, 1=Government, 2=NGO/Nonprofit, 3=Independent
 *       replication: 0,                 ← 0=Replicated, 1=Awaiting, 2=First Observation, 3=Unverified
 *       funding: 0,                     ← 0=Fully Disclosed, 1=Partially Known, 2=Undisclosed
 *     },
 *     type: "discovery",                ← One of: discovery, project, organization, award, individual
 *     featured: false,                  ← Set to true to show in Featured section
 *     readTime: "5 min",
 *     trending: false,                  ← Set to true to show trending badge
 *     trendScore: 100,
 *     sourceUrl: "https://...",         ← Link to the original article
 *   },
 *   ---
 *
 * ═══════════════════════════════════════════════════════════════
 */

const articles = [
  {
    id: 1,
    title: "Amateur Astronomers Discover New Exoplanet in Habitable Zone Using Backyard Telescopes",
    source: "ScienceDaily",
    category: "space",
    hoursAgo: 2,
    excerpt: "A collaborative network of 47 amateur astronomers across three continents has confirmed the detection of a rocky exoplanet orbiting within the habitable zone of a nearby star system.",
    credibility: { evidence: 1, source: 0, replication: 2, funding: 0 },
    type: "discovery",
    featured: true,
    readTime: "6 min",
    trending: true,
    trendScore: 847,
    heroImg: 0,
    sourceUrl: "https://www.sciencedaily.com",
  },
  {
    id: 2,
    title: "Community-Led Coral Reef Mapping Project Reveals New Species Hotspot Off Indonesian Coast",
    source: "Nature Communications",
    category: "marine",
    hoursAgo: 18,
    excerpt: "Citizen divers equipped with underwater cameras and AI-powered identification tools have documented over 340 previously unmapped coral species across a 200km stretch of reef.",
    credibility: { evidence: 0, source: 0, replication: 1, funding: 0 },
    type: "project",
    featured: true,
    readTime: "8 min",
    trending: true,
    trendScore: 632,
    heroImg: 1,
    sourceUrl: "https://www.nature.com/ncomms",
  },
  {
    id: 3,
    title: "eBird Data Reveals Dramatic Shift in Migration Patterns Across Northern Hemisphere",
    source: "Cornell Lab of Ornithology",
    category: "biodiversity",
    hoursAgo: 36,
    excerpt: "Analysis of 2.3 million citizen science observations shows 23 bird species arriving at breeding grounds an average of 12 days earlier than the 30-year baseline.",
    credibility: { evidence: 0, source: 0, replication: 0, funding: 0 },
    type: "discovery",
    featured: false,
    readTime: "5 min",
    trending: true,
    trendScore: 421,
    sourceUrl: "https://www.birds.cornell.edu",
  },
  {
    id: 4,
    title: "Foldit Players Crack New Protein Structure Linked to Antibiotic Resistance",
    source: "University of Washington",
    category: "health",
    hoursAgo: 52,
    excerpt: "Gamers using the citizen science platform Foldit have solved a protein folding puzzle that had stumped researchers for over a decade, opening new pathways for antibiotic development.",
    credibility: { evidence: 1, source: 0, replication: 1, funding: 0 },
    type: "discovery",
    featured: false,
    readTime: "4 min",
    trending: false,
    trendScore: 189,
    sourceUrl: "https://www.washington.edu",
  },
  {
    id: 5,
    title: "LiDAR Volunteers Uncover Lost Roman Road Network Beneath Welsh Countryside",
    source: "The Guardian",
    category: "archaeology",
    hoursAgo: 72,
    excerpt: "Volunteers analyzing publicly available LiDAR data have identified what appears to be an extensive Roman road system previously unknown to historians, spanning over 60 miles.",
    credibility: { evidence: 2, source: 2, replication: 2, funding: 1 },
    type: "discovery",
    featured: false,
    readTime: "7 min",
    trending: false,
    trendScore: 156,
    sourceUrl: "https://www.theguardian.com",
  },
  {
    id: 6,
    title: "Community Weather Station Network Improves Flood Prediction Accuracy by 40%",
    source: "Met Office",
    category: "climate",
    hoursAgo: 78,
    excerpt: "A grassroots network of over 5,000 personal weather stations feeding real-time data has dramatically improved short-range flood forecasting in rural areas across the UK.",
    credibility: { evidence: 0, source: 1, replication: 0, funding: 0 },
    type: "project",
    featured: false,
    readTime: "5 min",
    trending: true,
    trendScore: 398,
    sourceUrl: "https://www.metoffice.gov.uk",
  },
  {
    id: 7,
    title: "AI-Assisted Citizen Scientists Identify New Forest Carbon Sinks Using Satellite Imagery",
    source: "Global Forest Watch",
    category: "ecology",
    hoursAgo: 120,
    excerpt: "Over 12,000 volunteers using machine learning tools have classified satellite imagery to identify previously unrecognized carbon-sequestering forest patches across Sub-Saharan Africa.",
    credibility: { evidence: 1, source: 2, replication: 1, funding: 0 },
    type: "project",
    featured: false,
    readTime: "6 min",
    trending: false,
    trendScore: 203,
    sourceUrl: "https://www.globalforestwatch.org",
  },
  {
    id: 8,
    title: "Open-Source AI Model Trained on Citizen Data Achieves Breakthrough in Species ID",
    source: "iNaturalist / Google Research",
    category: "tech",
    hoursAgo: 144,
    excerpt: "A new open-source vision model trained on 150 million citizen-submitted photos can now identify 98.2% of known plant species from a single photograph.",
    credibility: { evidence: 1, source: 0, replication: 1, funding: 0 },
    type: "discovery",
    featured: false,
    readTime: "5 min",
    trending: false,
    trendScore: 312,
    sourceUrl: "https://www.inaturalist.org",
  },
  {
    id: 9,
    title: "Global Mosquito Alert Network Helps Predict Dengue Outbreaks Two Weeks in Advance",
    source: "WHO Bulletin",
    category: "health",
    hoursAgo: 160,
    excerpt: "Citizen scientists in 42 countries reporting mosquito sightings via a mobile app have helped create a predictive model that can forecast dengue outbreaks with 83% accuracy.",
    credibility: { evidence: 0, source: 1, replication: 1, funding: 0 },
    type: "project",
    featured: false,
    readTime: "6 min",
    trending: false,
    trendScore: 178,
    sourceUrl: "https://www.who.int",
  },
  {
    id: 10,
    title: "Asteroid Hunters Club Awarded International Astronomical Union Prize for Youth Engagement",
    source: "IAU Press Release",
    category: "space",
    hoursAgo: 200,
    excerpt: "The volunteer-run Asteroid Hunters Club, which has engaged over 25,000 young people in near-Earth object tracking, received the IAU's inaugural Citizen Science Excellence Award.",
    credibility: { evidence: 0, source: 0, replication: 0, funding: 0 },
    type: "award",
    featured: false,
    readTime: "3 min",
    trending: false,
    trendScore: 95,
    sourceUrl: "https://www.iau.org",
  },
];

export default articles;
